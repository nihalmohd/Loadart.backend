import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getPostTrucks = async (req, res) => {
    const { page = 1, lang = "en" } = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const query = `
            SELECT 
                pt.*, 
                t.*
            FROM 
                loadart."postTrucks" pt
            JOIN 
                loadart."trucks" t
            ON 
                pt.truck_id = t.truck_id
            ORDER BY 
                pt."postTrucks_id" DESC
            LIMIT 
                $1 OFFSET $2;
        `;

        const result = await pool.query(query, [limit, offset]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No postTrucks data found." });
        }

        let translatedData = result.rows;

        if (lang !== "en") {
            translatedData = await Promise.all(result.rows.map(async (item) => ({
                ...item,
                postTrucks_from: item.postTrucks_from ? await translateText(item.postTrucks_from, lang) : null,
                postTrucks_to: item.postTrucks_to ? await translateText(item.postTrucks_to, lang) : null,
                comments: item.comments ? await translateText(item.comments, lang) : null
            })));
        }

        res.status(200).json({
            message: "postTrucks data retrieved successfully.",
            currentPage: page,
            data: translatedData,
        });
    } catch (error) {
        console.error("Error retrieving postTrucks data:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
