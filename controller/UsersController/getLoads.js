import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getAllLoads = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const userId = req.query.user_id;
  const lang = req.query.lang || "en";

  const fetchLoadsQuery = `
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
        l.loads_status != $1
        ${userId ? `AND l.user_id != $4` : ''}
    ORDER BY 
        l.loads_id DESC  
    LIMIT 
        $2 OFFSET $3;
  `;

  try {
    const queryParams = [3, limit, offset];
    if (userId) queryParams.push(userId);

    const result = await pool.query(fetchLoadsQuery, queryParams);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No loads found for the specified page." });
    }

    const translatedRows = await Promise.all(
      result.rows.map(async (row) => {
        const [
          pickupLoc,
          deliveryLoc,
          materials_name,
          truck_capacities_name,
          truck_types_name,
          users_name,
          user_types_name,
        ] = await Promise.all([
          translateText(row.pickupLoc, lang),
          translateText(row.deliveryLoc, lang),
          translateText(row.materials_name, lang),
          translateText(row.truck_capacities_name, lang),
          translateText(row.truck_types_name, lang),
          translateText(row.users_name, lang),
          translateText(row.user_types_name, lang),
        ]);

        return {
          ...row,
          pickupLoc: pickupLoc || row.pickupLoc,
          deliveryLoc: deliveryLoc || row.deliveryLoc,
          materials_name: materials_name || row.materials_name,
          truck_capacities_name: truck_capacities_name || row.truck_capacities_name,
          truck_types_name: truck_types_name || row.truck_types_name,
          users_name: users_name || row.users_name,
          user_types_name: user_types_name || row.user_types_name,
        };
      })
    );

    res.status(200).json({
      message: "Loads retrieved and translated successfully.",
      currentPage: page,
      pageSize: translatedRows.length,
      data: translatedRows,
    });
  } catch (error) {
    console.error("Error retrieving paginated loads:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
