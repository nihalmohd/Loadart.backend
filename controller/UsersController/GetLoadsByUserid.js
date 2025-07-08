import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getLoadsByUserId = async (req, res) => {
  const { user_id, page, lang = "en" } = req.query;

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
    LEFT JOIN 
        Loadart."materials" m ON l.material_id = m.materials_id
    JOIN 
        Loadart."truck_capacities" tc ON l.capacity_id = tc.truck_capacities_id
    LEFT JOIN 
        Loadart."truck_types" tt ON l.truck_type_id = tt.truck_types_id
    JOIN 
        Loadart."users" u ON l.user_id = u.users_id
    WHERE 
        l.user_id = $1 
        AND l.loads_status != 3
    ORDER BY 
        l.loads_id DESC  
    LIMIT 
        $2 OFFSET $3;
  `;

  try {
    const result = await pool.query(fetchLoadsQuery, [user_id, limitValue, offsetValue]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No loads found." });
    }

    const translatedRows = await Promise.all(
      result.rows.map(async (row) => {
        if (lang !== "en") {
          const [
            pickupLoc,
            deliveryLoc,
            materials_name,
            truck_capacities_name,
            truck_types_name,
            users_name
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
      message: "Loads retrieved successfully.",
      data: translatedRows,
      pagination: {
        page: pageNumber,
        limit: limitValue,
        offset: offsetValue,
      },
    });
  } catch (error) {
    console.error("Error retrieving loads:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
