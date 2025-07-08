import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";


export const getBidsLoadWithDetails = async (req, res) => {
  const { load_id, user_id, lang = "en" } = req.query;

  try {
    if (!load_id || !user_id) {
      return res.status(400).json({ message: "load_id and user_id are required." });
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
          Loadart."trucks" t ON bt."trucks_id" = t."truck_id"
      JOIN 
          Loadart."loads" l ON bt.loads_id = l.loads_id
      LEFT JOIN 
          Loadart."truck_types" tt ON t."trucks_type_id" = tt."truck_types_id"
      LEFT JOIN 
          Loadart."materials" m ON l."material_id" = m."materials_id"  
      JOIN 
          Loadart."truck_capacities" tc ON t."capacity_id" = tc."truck_capacities_id" 
      WHERE 
          bt.loads_id = $1
      AND 
          bt."bidsTruck_status"::INTEGER != 4 
      AND 
          bt.user_id != $2
      ORDER BY 
          bt."bidsTruck_id" DESC;
    `;

    const result = await pool.query(query, [load_id, user_id]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No data found." });
    }

    const translatedData = await Promise.all(
      result.rows.map(async (row) => {
        if (lang !== "en") {
          const [
            pickupLoc,
            deliveryLoc,
            materials_name,
            truck_capacities_name,
            truck_types_name,
            users_name,
          ] = await Promise.all([
            translateText(row.pickupLoc, lang),
            translateText(row.deliveryLoc, lang),
            row.materials_name ? translateText(row.materials_name, lang) : null,
            row.truck_capacities_name ? translateText(row.truck_capacities_name, lang) : null,
            row.truck_types_name ? translateText(row.truck_types_name, lang) : null,
            translateText(row.users_name, lang),
          ]);

          return {
            ...row,
            pickupLoc,
            deliveryLoc,
            materials_name,
            truck_capacities_name,
            truck_types_name,
            users_name,
          };
        } else {
          return row;
        }
      })
    );

    res.status(200).json({
      message: "Data retrieved successfully.",
      data: translatedData,
    });

  } catch (error) {
    console.error("Error retrieving bidsLoad data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
