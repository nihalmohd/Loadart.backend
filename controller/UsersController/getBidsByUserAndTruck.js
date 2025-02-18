import pool from "../../Model/Config.js";

export const getTruckBidsForUserAndPostTruck = async (req, res) => {
  const { user_id, trucks_id } = req.query;
    console.log(req.query);
    
  try {
    if (!user_id || !trucks_id) {
      return res
        .status(400)
        .json({ message: "Both user_id and trucks_id are required." });
    }

    const query = `
            SELECT 
                bt.*, 
                u.*,  
                l.*, 
                t.*,
                tt.*,
                m.*,
                tc.*    
            FROM 
                Loadart."bidsTruck" bt
            JOIN 
                Loadart."users" u
            ON 
                bt.user_id = u.users_id
            JOIN 
                Loadart."loads" l
            ON 
                bt.loads_id = l.loads_id
            JOIN 
                Loadart."trucks" t
            ON 
                bt.trucks_id = t.truck_id
            JOIN 
                Loadart."truck_types" tt 
            ON 
               t."trucks_type_id" = tt."truck_types_id"
            JOIN 
               Loadart."materials" m  
            ON 
               l."material_id" = m."materials_id"  
            JOIN 
                Loadart."truck_capacities" tc  
            ON 
               t."capacity_id" = tc."truck_capacities_id" 
            WHERE 
                bt.user_id = $1 AND bt."trucks_id" = $2;
        `;

    const result = await pool.query(query, [user_id, trucks_id]);

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: "No bids found for the given user_id and trucks_id.",
      });
    }

    res.status(200).json({
      message: "Bids retrieved successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving bids for user and truck:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
