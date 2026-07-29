const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ======================================
// Dashboard
// ======================================

router.get("/", async (req, res) => {

    try {

        // รายได้วันนี้
        const salesToday = await pool.query(`
            SELECT
                COALESCE(SUM(total_price),0) AS total_sales
            FROM orders
            WHERE status = 'เสร็จแล้ว'
            AND DATE(created_at) = CURRENT_DATE
        `);

        // จำนวนออเดอร์วันนี้
        const orderToday = await pool.query(`
            SELECT
                COUNT(*) AS total_orders
            FROM orders
            WHERE DATE(created_at) = CURRENT_DATE
        `);

        // จำนวนออเดอร์แต่ละสถานะ
        const statusSummary = await pool.query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM orders
            GROUP BY status
        `);

        // Top 5 สินค้าขายดี
        const topProducts = await pool.query(`
            SELECT
                p.name,
                SUM(oi.quantity) AS total_quantity
            FROM order_items oi
            JOIN products p
                ON oi.product_id = p.id
            JOIN orders o
                ON oi.order_id = o.id
            GROUP BY
                p.id,
                p.name
            ORDER BY
                total_quantity DESC
            LIMIT 5
        `);

        // สินค้าขายดีที่สุด
        const bestSeller = topProducts.rows.length > 0
            ? topProducts.rows[0]
            : null;

        res.json({

            success: true,

            sales_today:
                Number(salesToday.rows[0].total_sales),

            orders_today:
                Number(orderToday.rows[0].total_orders),

            waiting_production:
                Number(
                    statusSummary.rows.find(
                        s => s.status === "รอผลิต"
                    )?.total || 0
                ),

            waiting_packing:
                Number(
                    statusSummary.rows.find(
                        s => s.status === "รอแพ็ก"
                    )?.total || 0
                ),

            completed:
                Number(
                    statusSummary.rows.find(
                        s => s.status === "เสร็จแล้ว"
                    )?.total || 0
                ),

            best_seller: bestSeller,

            top_products: topProducts.rows

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "ไม่สามารถโหลดข้อมูล Dashboard ได้"

        });

    }

});

module.exports = router;