const express = require('express');
const router = express.Router();
const pool = require('../config/db');


router.post('/', async (req, res) => {

  const {
    customer_name,
    phone,
    delivery_type,
    address,
    total_price,
    items
  } = req.body;


  try {

    const orderResult = await pool.query(
      `
      INSERT INTO orders
      (
        customer_name,
        phone,
        delivery_type,
        address,
        total_price
      )
      VALUES
      ($1,$2,$3,$4,$5)
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

      await pool.query(
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


    res.json({
      message: "สร้างออเดอร์สำเร็จ",
      order_id: orderId
    });


  } catch(err){

    console.error(err);

    res.status(500).json({
      message:"สร้างออเดอร์ไม่สำเร็จ"
    });

  }

});


// ดึงรายการออเดอร์ทั้งหมด พร้อมรายการสินค้า
router.get('/', async (req, res) => {

  try {

    const orders = await pool.query(`
      SELECT 
        o.id,
        o.customer_name,
        o.phone,
        o.delivery_type,
        o.address,
        o.total_price,
        o.status,
        o.created_at
      FROM orders o
      ORDER BY o.id DESC
    `);


    for (let order of orders.rows) {

      const items = await pool.query(`
        SELECT
          p.name,
          oi.quantity,
          p.price
        FROM order_items oi
        JOIN products p
        ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `,
      [order.id]);


      order.items = items.rows;

    }


    res.json(orders.rows);


  } catch(err){

    console.error(err);

    res.status(500).json({
      message:"ไม่สามารถดึงข้อมูลออเดอร์ได้"
    });

  }

});

router.put('/:id', async (req, res) => {

  const { status } = req.body;

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


    res.json(result.rows[0]);


  } catch(err){

    console.error(err);

    res.status(500).json({
      message:"อัปเดตสถานะไม่สำเร็จ"
    });

  }

});

module.exports = router;