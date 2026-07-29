const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ======================================
// สร้างออเดอร์
// ======================================

router.post("/", async (req, res) => {

    const {
        customer_name,
        phone,
        delivery_type,
        address,
        total_price,
        items
    } = req.body;

    if (
        !customer_name ||
        !phone ||
        !delivery_type ||
        !items ||
        items.length === 0
    ) {

        return res.status(400).json({
            success: false,
            message: "ข้อมูลไม่ครบ"
        });

    }

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const orderResult = await client.query(
            `
            INSERT INTO orders
            (
                customer_name,
                phone,
                delivery_type,
                address,
                total_price,
                status
            )
            VALUES
            ($1,$2,$3,$4,$5,'รอผลิต')
            RETURNING id
            `,
            [
                customer_name,
                phone,
                delivery_type,
                address,
                total_price
            ]
        );

        const orderId = orderResult.rows[0].id;

        for (const item of items) {

            await client.query(
                `
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity
                )
                VALUES
                ($1,$2,$3)
                `,
                [
                    orderId,
                    item.id,
                    item.quantity
                ]
            );

        }

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "สร้างออเดอร์สำเร็จ",
            order_id: orderId
        });

    }
    catch (err) {

        await client.query("ROLLBACK");

        console.error(err);

        res.status(500).json({
            success: false,
            message: "สร้างออเดอร์ไม่สำเร็จ"
        });

    }
    finally {

        client.release();

    }

});

// ======================================
// โหลดออเดอร์ทั้งหมด / ตามวันที่
// ======================================

router.get("/", async (req, res) => {

    try {

        const { date } = req.query;

        let sql = `
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
        `;

        const params = [];

        // ถ้ามีเลือกวันที่
        if (date) {

            sql += `
                WHERE DATE(created_at + INTERVAL '7 hour') = $1
            `;

            params.push(date);

        }

        sql += `
            ORDER BY created_at DESC
        `;

        const result = await pool.query(sql, params);

        for (const order of result.rows) {

            const items = await pool.query(
                `
                SELECT
                    p.id,
                    p.name,
                    p.price,
                    oi.quantity
                FROM order_items oi
                JOIN products p
                    ON oi.product_id = p.id
                WHERE oi.order_id = $1
                ORDER BY p.name
                `,
                [order.id]
            );

            order.items = items.rows;

        }

        res.json(result.rows);

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "โหลดออเดอร์ไม่สำเร็จ"
        });

    }

});

// ======================================
// เปลี่ยนสถานะ
// ======================================

router.put("/:id", async (req, res) => {

    const { status } = req.body;

    const allowStatus = [
        "รอผลิต",
        "รอแพ็ก",
        "เสร็จแล้ว"
    ];

    if (!allowStatus.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "สถานะไม่ถูกต้อง"
        });

    }

    try {

        const result = await pool.query(
            `
            UPDATE orders
            SET status = $1
            WHERE id = $2
            RETURNING *
            `,
            [
                status,
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
            message: "อัปเดตสถานะสำเร็จ",
            order: result.rows[0]
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "อัปเดตสถานะไม่สำเร็จ"
        });

    }

});

module.exports = router;