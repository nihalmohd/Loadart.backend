import pool from "../../Model/Config.js";

export const createUserSubscription = async (req, res) => {
  const { userId, planId,  status } = req.body;
   const durationDays = 30
  try {
    const query = `
      INSERT INTO "UserSubscription" (
        "userId",
        "planId",
        "startDate",
        "endDate",
        "status"
      ) VALUES (
        $1, $2, NOW(), NOW() + ($3 || ' days')::interval, $4
      ) RETURNING *;
    `;

    const result = await pool.query(query, [userId, planId, durationDays, status]);

    res.status(201).json({
      message: "Subscription created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating subscription:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
