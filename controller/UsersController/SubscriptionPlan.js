import pool from "../../Model/Config.js";

export const getPlansByUserType = async (req, res) => {
  const { userTypeId } = req.query;

  if (!userTypeId) {
    return res.status(400).json({ message: "userTypeId is required." });
  }

  try {
    const query = `
      SELECT *
      FROM loadart."SubscriptionPlan"
      WHERE $1 = ANY(string_to_array("userTypeIds", ','))
    `;

    const result = await pool.query(query, [userTypeId]);

    res.status(200).json({
      message: "Plans retrieved successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving plans:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};