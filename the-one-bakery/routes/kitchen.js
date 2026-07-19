const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {

    try {

        const result = await pool.query(`

            SELECT

                p.name,

                SUM(oi.quantity) AS total_quantity

            FROM order_items oi

            JOIN products p

            ON oi.product_id = p.id

            JOIN orders o

            ON oi.order_id = o.id

            WHERE o.status <> 'เสร็จแล้ว'

            GROUP BY p.name

            ORDER BY p.name;

        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

module.exports = router;