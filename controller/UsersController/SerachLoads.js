import pool from "../../Model/Config.js";

export const getMatchingLoads = async (req, res) => {
    const {
        pickupLoc,
        deliveryLoc,
        pickupDate,
        material_id,
        capacity_id,
        truck_type_id,
        no_of_trucks,
        limit,
        offset
    } = req.body;

    try {
        let pickupDistrict = null;
        let deliveryDistrict = null;
        let formattedPickupDate = null;

        // Function to extract the last two parts (District + State)
        const extractDistrict = (location) => {
            if (!location) return null;
            const parts = location.split(",").map(part => part.trim());
            const len = parts.length;
            return len >= 2 ? `${parts[len - 2]}, ${parts[len - 1]}` : location;
        };

        console.log("Raw pickupDate from request:", pickupDate);

        // Convert pickupDate to a valid PostgreSQL date format (YYYY-MM-DD)
        if (pickupDate) {
            const dateObject = new Date(pickupDate);
            if (!isNaN(dateObject.getTime())) {
                formattedPickupDate = dateObject.toISOString().split("T")[0]; // Extract YYYY-MM-DD
            }
        }

        // console.log("Formatted pickupDate:", formattedPickupDate);

        // Extract district + state for both pickup and delivery locations
        pickupDistrict = extractDistrict(pickupLoc);
        deliveryDistrict = extractDistrict(deliveryLoc);

        const query = `
        SELECT 
            l.*, 
            m.*, 
            tc.*, 
            tt.*, 
            u.*, 
            ut.*
        FROM 
            Loadart."loads" l
        JOIN 
            Loadart."materials" m
        ON 
            l.material_id = m.materials_id
        JOIN 
            Loadart."truck_capacities" tc
        ON 
            l.capacity_id = tc.truck_capacities_id
        JOIN 
            Loadart."truck_types" tt
        ON 
            l.truck_type_id = tt.truck_types_id
        JOIN 
            Loadart."users" u
        ON 
            l.user_id = u.users_id
        JOIN 
            Loadart."user_types" ut
        ON 
            u.user_types_id = ut.user_types_id
        WHERE 
            ($1::text IS NULL OR l."pickupLoc" ILIKE '%' || $1 || '%') AND
            ($2::text IS NULL OR l."deliveryLoc" ILIKE '%' || $2 || '%') AND
            ($3::date IS NULL OR l."pickupDate" >= $3::date) AND
            ($4::integer IS NULL OR l."material_id" = $4) AND
            ($5::integer IS NULL OR l."capacity_id" <= $5) AND
            ($6::integer IS NULL OR l."truck_type_id" = $6)
        ORDER BY 
            l."loads_id" DESC  
        LIMIT $7 OFFSET $8;
    `;

        const itemsPerPage = limit || 12;  
        const currentOffset = offset || 0;  

        const values = [
            pickupDistrict || null,  
            deliveryDistrict || null,
            formattedPickupDate || null,  
            material_id || null,
            capacity_id || null,  
            truck_type_id || null,
            itemsPerPage,  
            currentOffset  
        ];

        // console.log("Query values:", values); // Debugging log

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No matching loads found." });
        }

        res.status(200).json({
            message: "Matching loads retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving matching loads:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
