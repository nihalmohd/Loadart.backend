import pool from "../Model/Config.js";

export const addLoad = async (req, res) => {
    const {
        pickupLoc_id,
        deliveryLoc_id, 
        pickupDate,
        material_id,
        capacity_id,
        truck_id,
        truck_type_id,
        comment,
        user_id,
        no_of_trucks,
    } = req.body;

    if (
        !pickupLoc_id ||
        !deliveryLoc_id ||
        !pickupDate ||
        !material_id ||
        !capacity_id ||
        !truck_id ||
        !truck_type_id ||
        !user_id ||
        !no_of_trucks
    ) {
        return res.status(400).json({ message: "All fields except 'comment' are mandatory." });
    }

   
    const insertLoadQuery = `
        INSERT INTO loadart.loads 
        ("pickupLoc_id", "deliveryLoc_id", "pickupDate", "material_id", "capacity_id", "truck_id", "truck_type_id", "comment", "user_id", "no_of_trucks")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;

    try {
        const insertValues = [
            pickupLoc_id,
            deliveryLoc_id,
            pickupDate,
            material_id,
            capacity_id,
            truck_id,
            truck_type_id,
            comment || null, 
            user_id,
            no_of_trucks,
        ];

        const result = await pool.query(insertLoadQuery, insertValues);

        if(result){
            res.status(201).json({
                message: "Load added successfully",
                data: result.rows[0],
            });
        }else{
            res.status(422).json({message:"Unprocessable Entity please check values in table and your entry"})
        }

    } catch (error) {
        console.error("Error adding load:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
