const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ======================================
// ดึงรายการสินค้าที่ต้องผลิต
// ======================================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`

            SELECT

                p.id AS product_id,

                p.name AS product_name,

                SUM(oi.quantity) AS total_quantity

            FROM order_items oi

            JOIN products p

                ON oi.product_id = p.id

            JOIN orders o

                ON oi.order_id = o.id

            WHERE o.status = 'รอผลิต'

            GROUP BY

                p.id,

                p.name

            ORDER BY

                p.name ASC

        `);

        res.json(result.rows);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "ไม่สามารถโหลดข้อมูล Kitchen ได้"

        });

    }

});

// ======================================
// ผลิตเสร็จทั้งหมด
// เปลี่ยนสถานะเป็น รอแพ็ก
// ======================================

router.put("/finish", async (req, res) => {

    try {

        const result = await pool.query(`

            UPDATE orders

            SET status = 'รอแพ็ก'

            WHERE status = 'รอผลิต'

            RETURNING id

        `);

        res.json({

            success: true,

            message: "ส่งรายการไปยังฝ่ายแพ็กเรียบร้อย",

            total: result.rowCount

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "ไม่สามารถอัปเดตสถานะได้"

        });

    }

});

module.exports = router;