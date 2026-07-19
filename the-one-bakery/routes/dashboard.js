const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {

    try {

        // จำนวนออเดอร์
        const orderResult =
        await pool.query(`
            SELECT COUNT(*) AS total_orders
            FROM orders
        `);

        // ยอดขาย
        const salesResult =
        await pool.query(`
            SELECT
            COALESCE(SUM(total_price),0) AS total_sales
            FROM orders
            WHERE status <> 'ยกเลิก'
        `);

        // สินค้าขายดี
        const bestProduct =
        await pool.query(`
            SELECT
                p.name,
                SUM(oi.quantity) AS total
            FROM order_items oi
            JOIN products p
            ON oi.product_id = p.id
            GROUP BY p.name
            ORDER BY total DESC
            LIMIT 1
        `);

        res.json({

            totalOrders:
            Number(orderResult.rows[0].total_orders),

            totalSales:
            Number(salesResult.rows[0].total_sales),

            bestProduct:
            bestProduct.rows.length
                ? bestProduct.rows[0].name
                : "-"

        });

    }
    catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

});

module.exports = router;