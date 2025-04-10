import pool from "../../Model/Config.js";

export const createUserSubscription = async (req, res) => {
  const { userId, planId } = req.body;

  try {
    const client = await pool.connect();

    // 1. Get duration string like "15 days" or "1 months"
    const planQuery = `
      SELECT "duration"
      FROM "SubscriptionPlan"
      WHERE "SubscriptionPlanId" = $1
    `;
    const planResult = await client.query(planQuery, [planId]);

    if (planResult.rowCount === 0) {
      return res.status(404).json({ message: "Subscription plan not found." });
    }

    const { duration } = planResult.rows[0];

    // Parse duration string
    const [durationValueStr, durationType] = duration.trim().toLowerCase().split(" ");
    const durationValue = parseInt(durationValueStr);

    if (isNaN(durationValue) || !["days","months", "month"].includes(durationType)) {
      return res.status(400).json({ message: "Invalid duration format in SubscriptionPlan." });
    }

    // Normalize unit
    const unit = durationType.startsWith("month") ? "months" : "days";

    // 2. Check for existing active subscription
    const existingSubQuery = `
      SELECT "endDate" FROM "UserSubscription"
      WHERE "userId" = $1 AND "endDate" > NOW()
      ORDER BY "endDate" DESC
      LIMIT 1
    `;
    const existingSubResult = await client.query(existingSubQuery, [userId]);

    let startDate;
    if (existingSubResult.rowCount > 0) {
      startDate = new Date(existingSubResult.rows[0].endDate);
    } else {
      startDate = new Date();
    }

    // 3. Calculate endDate
    let endDate = new Date(startDate);
    if (unit === "months") {
      endDate.setMonth(endDate.getMonth() + durationValue);
    } else {
      endDate.setDate(endDate.getDate() + durationValue);
    }

    // 4. Insert into UserSubscription
    const insertQuery = `
      INSERT INTO "UserSubscription" (
        "userId",
        "planId",
        "startDate",
        "endDate"
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const insertResult = await client.query(insertQuery, [
      userId,
      planId,
      startDate,
      endDate,
    ]);

    res.status(201).json({
      message: "Subscription created successfully.",
      data: insertResult.rows[0],
    });

    client.release();
  } catch (error) {
    console.error("Error creating subscription:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
