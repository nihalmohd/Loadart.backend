import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getTruckSchedulesByUserId = async (req, res) => {
    const { user_id, date_filter, lang = "en" } = req.query;

    try {
        if (!user_id) {
            return res.status(400).json({ message: "user_id is required." });
        }

        let query = `
        SELECT 
            schedules.*, 
            trucks.*, 
            loads.*, 
            materials.*
        FROM 
            Loadart."truck_schedules" AS schedules
        LEFT JOIN 
            Loadart."trucks" AS trucks ON schedules."trucks_id" = trucks."truck_id"
        LEFT JOIN 
            Loadart."loads" AS loads ON schedules."loads_id" = loads."loads_id"::BIGINT
        LEFT JOIN 
            Loadart."materials" AS materials ON loads."material_id"::TEXT = materials."materials_id"::TEXT
        WHERE 
            schedules."user_id" = $1
        `;

        const queryParams = [user_id];

        if (date_filter) {
            let dateCondition = "";
            if (date_filter === "last_day") {
                dateCondition = `AND schedules."truckSchedules_date" >= NOW() - INTERVAL '1 day'`;
            } else if (date_filter === "last_30_days") {
                dateCondition = `AND schedules."truckSchedules_date" >= NOW() - INTERVAL '30 days'`;
            } else if (date_filter === "last_6_months") {
                dateCondition = `AND schedules."truckSchedules_date" >= NOW() - INTERVAL '6 months'`;
            } else if (date_filter === "last_year") {
                dateCondition = `AND schedules."truckSchedules_date" >= NOW() - INTERVAL '1 year'`;
            }

            query += ` ${dateCondition}`;
        }

        query += ` ORDER BY schedules."truckSchedules_id" DESC;`;

        const result = await pool.query(query, queryParams);

        if (result.rows.length === 0) {
            return res.status(200).json({
                message: "No schedules found for the given criteria.",
                data: [],
            });
        }

        const translatedSchedules = await Promise.all(
            result.rows.map(async (item) => {
                const translated = { ...item };

                if (translated.pickup_loc)
                    translated.pickup_loc = await translateText(translated.pickup_loc, lang);

                if (translated.delivery_loc)
                    translated.delivery_loc = await translateText(translated.delivery_loc, lang);

                if (translated.pickupLoc)
                    translated.pickupLoc = await translateText(translated.pickupLoc, lang);

                if (translated.deliveryLoc)
                    translated.deliveryLoc = await translateText(translated.deliveryLoc, lang);

                if (translated.materials_name)
                    translated.materials_name = await translateText(translated.materials_name, lang);

                return translated;
            })
        );

        res.status(200).json({
            message: "Truck schedules fetched successfully.",
            schedules: translatedSchedules,
        });
    } catch (error) {
        console.error("Error fetching truck schedules:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
