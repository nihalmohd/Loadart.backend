import pool from "../../Model/Config.js";

export const getLoadsByUserId = async (req, res) => {
    const { user_id, page } = req.query;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const limitValue = 12; 
    const pageNumber = page ? parseInt(page) : 1; 
    const offsetValue = (pageNumber - 1) * limitValue;  

    const fetchLoadsQuery = `
        SELECT 
            l.*, 
            m.*, 
            tc.*, 
            tt.*, 
            u.*
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
        WHERE 
            l.user_id = $1 
            AND l.loads_status != 3
        LIMIT 
            $2 OFFSET $3;
    `;

    try {
        const result = await pool.query(fetchLoadsQuery, [user_id, limitValue, offsetValue]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No loads found." });
        }

        res.status(200).json({
            message: "Loads retrieved successfully.",
            data: result.rows,
            pagination: {
                page: pageNumber,
                limit: limitValue,
                offset: offsetValue
            }
        });
    } catch (error) {
        console.error("Error retrieving loads:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
