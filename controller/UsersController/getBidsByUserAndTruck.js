import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getTruckBidsForUserAndPostTruck = async (req, res) => {
  const { user_id, trucks_id, lang = "en" } = req.query;

  try {
    if (!user_id || !trucks_id) {
      return res
        .status(400)
        .json({ message: "Both user_id and trucks_id are required." });
    }

    const query = `
      SELECT 
        bt."bidsTruck_id", 
        bt."bidsTruck_amount", 
        bt."bidsTruck_status",
        u.users_id,  
        u.users_name,  
        t.truck_id,
        t."regNumber", 
        l.loads_id, 
        l."pickupLoc", 
        l."deliveryLoc", 
        l."pickupDate", 
        l.user_id, 
        tt.truck_types_name, 
        m.materials_id,  
        m."materials_name",  
        tc.truck_capacities_name  
      FROM 
        Loadart."bidsTruck" bt
      JOIN 
        Loadart."users" u ON bt.user_id = u.users_id
      JOIN 
        Loadart."loads" l ON bt.loads_id = l.loads_id
      JOIN 
        Loadart."trucks" t ON bt.trucks_id = t.truck_id
      LEFT JOIN 
        Loadart."truck_types" tt ON t."trucks_type_id" = tt."truck_types_id"
      LEFT JOIN 
        Loadart."materials" m ON l."material_id" = m."materials_id"
      JOIN 
        Loadart."truck_capacities" tc ON t."capacity_id" = tc."truck_capacities_id"
      WHERE 
        bt.user_id = $1 
        AND bt."trucks_id" = $2
      ORDER BY 
        bt."bidsTruck_id" DESC;
    `;

    const result = await pool.query(query, [user_id, trucks_id]);

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: "No bids found for the given user_id and trucks_id.",
      });
    }

    // Apply translations
    const translatedData = await Promise.all(
      result.rows.map(async (item) => {
        const translatedItem = { ...item };

        // Translate only if values exist
        if (translatedItem.users_name)
          translatedItem.users_name = await translateText(translatedItem.users_name, lang);
        if (translatedItem.pickupLoc)
          translatedItem.pickupLoc = await translateText(translatedItem.pickupLoc, lang);
        if (translatedItem.deliveryLoc)
          translatedItem.deliveryLoc = await translateText(translatedItem.deliveryLoc, lang);
        if (translatedItem.truck_types_name)
          translatedItem.truck_types_name = await translateText(translatedItem.truck_types_name, lang);
        if (translatedItem.materials_name)
          translatedItem.materials_name = await translateText(translatedItem.materials_name, lang);
        if (translatedItem.truck_capacities_name)
          translatedItem.truck_capacities_name = await translateText(translatedItem.truck_capacities_name, lang);

        return translatedItem;
      })
    );

    res.status(200).json({
      message: "Bids retrieved successfully.",
      data: translatedData,
    });
  } catch (error) {
    console.error("Error retrieving bids for user and truck:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
