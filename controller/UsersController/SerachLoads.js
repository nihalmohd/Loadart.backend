import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";


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
    offset,
    user_id,
    lang = "en" // language code from body
  } = req.body;

  try {
    let formattedPickupDate = null;

    if (pickupDate) {
      const dateObject = new Date(pickupDate);
      if (!isNaN(dateObject.getTime())) {
        formattedPickupDate = dateObject.toISOString().split("T")[0];
      }
    }

    const normalizedPickupLoc = pickupLoc?.trim() || null;
    const normalizedDeliveryLoc = deliveryLoc?.trim() || null;

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
      LEFT JOIN 
          Loadart."materials" m ON l.material_id = m.materials_id
      JOIN 
          Loadart."truck_capacities" tc ON l.capacity_id = tc.truck_capacities_id
      LEFT JOIN 
          Loadart."truck_types" tt ON l.truck_type_id = tt.truck_types_id
      JOIN 
          Loadart."users" u ON l.user_id = u.users_id
      JOIN 
          Loadart."user_types" ut ON u.user_types_id = ut.user_types_id
      WHERE 
          ($1::text IS NULL OR LOWER(TRIM(l."pickupLoc")) ILIKE '%' || LOWER(TRIM($1)) || '%') AND
          ($2::text IS NULL OR LOWER(TRIM(l."deliveryLoc")) ILIKE '%' || LOWER(TRIM($2)) || '%') AND
          ($3::date IS NULL OR l."pickupDate" >= $3::date) AND
          ($4::integer IS NULL OR l."material_id" = $4) AND
          ($5::integer IS NULL OR l."capacity_id" <= $5) AND
          ($6::integer IS NULL OR l."truck_type_id" = $6) AND
          l."user_id" != $7
      ORDER BY 
          l."loads_id" DESC
      LIMIT $8 OFFSET $9;
    `;

    const itemsPerPage = limit || 12;
    const currentOffset = offset || 0;

    const values = [
      normalizedPickupLoc,
      normalizedDeliveryLoc,
      formattedPickupDate || null,
      material_id || null,
      capacity_id || null,
      truck_type_id || null,
      user_id,
      itemsPerPage,
      currentOffset
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No matching loads found." });
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
            users_name,
            user_types_name
          ] = await Promise.all([
            translateText(row.pickupLoc, lang),
            translateText(row.deliveryLoc, lang),
            row.materials_name ? translateText(row.materials_name, lang) : null,
            row.truck_capacities_name ? translateText(row.truck_capacities_name, lang) : null,
            row.truck_types_name ? translateText(row.truck_types_name, lang) : null,
            translateText(row.users_name, lang),
            translateText(row.user_types_name, lang)
          ]);

          return {
            ...row,
            pickupLoc,
            deliveryLoc,
            materials_name,
            truck_capacities_name,
            truck_types_name,
            users_name,
            user_types_name
          };
        } else {
          return row;
        }
      })
    );

    res.status(200).json({
      message: "Matching loads retrieved successfully.",
      data: translatedRows,
    });

  } catch (error) {
    console.error("Error retrieving matching loads:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
