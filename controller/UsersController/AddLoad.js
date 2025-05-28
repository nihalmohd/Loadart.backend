<<<<<<< HEAD
import pool from "../../Model/Config.js";

export const addLoad = async (req, res) => {
    const {
        pickupLoc,
        deliveryLoc, 
        pickupDate,
        material_id,
        capacity_id,
        truck_type_id,
        comment,
        user_id,
        no_of_trucks,
    } = req.body;

    if (
        !pickupLoc ||
        !deliveryLoc ||
        !pickupDate || !capacity_id || !user_id ||
        !no_of_trucks
    ) {
        return res.status(400).json({ message: "All fields except 'comment' are mandatory." });
    }

   
    const insertLoadQuery = `
        INSERT INTO loadart.loads 
        ("pickupLoc", "deliveryLoc", "pickupDate", "material_id", "capacity_id",  "truck_type_id", "comment", "user_id", "no_of_trucks")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;

    try {
        const insertValues = [
            pickupLoc,
            deliveryLoc,
            pickupDate,
            material_id,
            capacity_id,
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
=======
import pool from "../../Model/Config.js";

export const addLoad = async (req, res) => {
    const {
        pickupLoc,
        deliveryLoc,
        pickupDate,
        material_id,
        capacity_id,
        truck_type_id,
        comment,
        user_id,
        no_of_trucks,
    } = req.body;

    if (
        !pickupLoc ||
        !deliveryLoc ||
        !pickupDate ||
        !capacity_id ||
        !user_id ||
        !no_of_trucks
    ) {
        return res.status(400).json({ message: "All fields except 'comment' and 'truck_type_id' are mandatory." });
    }

    const insertLoadQuery = `
        INSERT INTO loadart.loads 
        ("pickupLoc", "deliveryLoc", "pickupDate", "material_id", "capacity_id", "truck_type_id", "comment", "user_id")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    try {
        const insertedLoads = [];

        for (let i = 0; i < no_of_trucks; i++) {
            const insertValues = [
                pickupLoc,
                deliveryLoc,
                pickupDate,
                material_id,
                capacity_id,
                truck_type_id || null,
                comment || null,
                user_id,
            ];

            const result = await pool.query(insertLoadQuery, insertValues);
            insertedLoads.push(result.rows[0]);
        }

        res.status(201).json({
            message: "Loads added successfully",
            data: insertedLoads,
        });

    } catch (error) {
        console.error("Error adding load:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

>>>>>>> 663ca9c01ea460882333fff5de8798075e7db799
