const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ======================================
// ดึงรายการออเดอร์ที่รอแพ็ก
// ======================================

router.get("/", async (req, res) => {

    try {

        const orders = await pool.query(

            `
            SELECT
                id,
                customer_name,
                phone,
                delivery_type,
                address,
                total_price,
                status,
                created_at

            FROM orders

            WHERE status = 'รอแพ็ก'

            ORDER BY created_at ASC
            `

        );

        for (const order of orders.rows) {

            const items = await pool.query(

                `
                SELECT

                    p.name,

                    p.price,

                    oi.quantity

                FROM order_items oi

                JOIN products p

                ON oi.product_id = p.id

                WHERE oi.order_id = $1
                `,

                [

                    order.id

                ]

            );

            order.items = items.rows;

        }

        res.json(orders.rows);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "ไม่สามารถโหลดข้อมูล Packing ได้"

        });

    }

});

// ======================================
// แพ็กเสร็จ
// เปลี่ยนสถานะเป็น เสร็จแล้ว
// ======================================

router.put("/:id/finish", async (req, res) => {

    try {

        const result = await pool.query(

            `
            UPDATE orders

            SET status = 'เสร็จแล้ว'

            WHERE id = $1
            AND status = 'รอแพ็ก'

            RETURNING *
            `,

            [

                req.params.id

            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "ไม่พบออเดอร์"

            });

        }

        res.json({

            success: true,

            message: "แพ็กสินค้าเรียบร้อย",

            order: result.rows[0]

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