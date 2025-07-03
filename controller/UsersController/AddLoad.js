// Controllers/loadController.js
import pool from "../../Model/Config.js";
import { translateToEnglish } from "../../Utils/Translate.js";


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
    return res.status(400).json({
      message: "All fields except 'comment' and 'truck_type_id' are mandatory.",
    });
  }

  try {
    // Translate inputs to English
    const translatedPickupLoc = await translateToEnglish(pickupLoc);
    const translatedDeliveryLoc = await translateToEnglish(deliveryLoc);
    const translatedComment = comment ? await translateToEnglish(comment) : null;
     console.log(translatedComment,translatedPickupLoc,translatedDeliveryLoc);
     
    const insertLoadQuery = `
      INSERT INTO loadart.loads 
      ("pickupLoc", "deliveryLoc", "pickupDate", "material_id", "capacity_id", "truck_type_id", "comment", "user_id")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const insertedLoads = [];

    for (let i = 0; i < no_of_trucks; i++) {
      const insertValues = [
        translatedPickupLoc,
        translatedDeliveryLoc,
        pickupDate,
        material_id,
        capacity_id,
        truck_type_id || null,
        translatedComment,
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
