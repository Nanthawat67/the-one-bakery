const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const multer = require("multer");
const path = require("path");

// ======================================
// Multer
// ======================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "public/uploads");

    },

    filename: (req, file, cb) => {

        const ext = path.extname(file.originalname);

        cb(

            null,

            Date.now() + ext

        );

    }

});

const upload = multer({

    storage

});

// ======================================
// Upload Image
// ======================================

router.post(

    "/upload",

    upload.single("image"),

    (req, res) => {

        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "ไม่พบไฟล์"

            });

        }

        res.json({

            success: true,

            image_url: `/uploads/${req.file.filename}`

        });

    }

);

// ======================================
// ดึงสินค้าทั้งหมด
// ======================================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`

            SELECT

                id,

                name,

                price,

                image_url

            FROM products

            ORDER BY id ASC

        `);

        res.json(result.rows);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: "โหลดสินค้าไม่สำเร็จ"

        });

    }

});

// ======================================
// ดึงสินค้า 1 รายการ
// ======================================

router.get("/:id", async (req, res) => {

    try {

        const result = await pool.query(

            `

            SELECT

                id,

                name,

                price,

                image_url

            FROM products

            WHERE id=$1

            `,

            [

                req.params.id

            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,
                message: "ไม่พบสินค้า"

            });

        }

        res.json(result.rows[0]);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: "โหลดสินค้าไม่สำเร็จ"

        });

    }

});

// ======================================
// เพิ่มสินค้า
// ======================================

router.post("/", async (req, res) => {

    const {

        name,

        price,

        image_url

    } = req.body;

    if (!name || !price) {

        return res.status(400).json({

            success: false,
            message: "กรุณากรอกข้อมูล"

        });

    }

    try {

        const result = await pool.query(

            `

            INSERT INTO products

            (

                name,

                price,

                image_url

            )

            VALUES

            ($1,$2,$3)

            RETURNING *

            `,

            [

                name,

                price,

                image_url || ""

            ]

        );

        res.json({

            success: true,

            product: result.rows[0]

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: "เพิ่มสินค้าไม่สำเร็จ"

        });

    }

});

// ======================================
// แก้ไขสินค้า
// ======================================

router.put("/:id", async (req, res) => {

    const {

        name,

        price,

        image_url

    } = req.body;

    try {

        const result = await pool.query(

            `

            UPDATE products

            SET

                name=$1,

                price=$2,

                image_url=$3

            WHERE id=$4

            RETURNING *

            `,

            [

                name,

                price,

                image_url,

                req.params.id

            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,
                message: "ไม่พบสินค้า"

            });

        }

        res.json({

            success: true,

            product: result.rows[0]

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: "แก้ไขไม่สำเร็จ"

        });

    }

});

// ======================================
// ลบสินค้า
// ======================================

router.delete("/:id", async (req, res) => {

    try {

        const result = await pool.query(

            `

            DELETE FROM products

            WHERE id=$1

            RETURNING *

            `,

            [

                req.params.id

            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,
                message: "ไม่พบสินค้า"

            });

        }

        res.json({

            success: true

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: "ลบสินค้าไม่สำเร็จ"

        });

    }

});

module.exports = router;