require("dotenv").config();

const express = require("express");
const cors = require("cors");

// ======================================
// Routes
// ======================================

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const dashboardRoutes = require("./routes/dashboard");
const kitchenRoutes = require("./routes/kitchen");
const packingRoutes = require("./routes/packing");

// ======================================

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================
// Middleware
// ======================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ======================================
// API Routes
// ======================================

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/packing", packingRoutes);

// ======================================
// 404 API
// ======================================

// ถ้าไม่มี API ไหนตรง จะมาตกที่นี่
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API Not Found"
    });
});

// ======================================
// 404 Web (Optional)
// ======================================

// หากต้องการให้หน้าเว็บที่ไม่มีอยู่ตอบ 404
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// ======================================
// Start Server
// ======================================

app.listen(PORT, () => {
    console.log("================================");
    console.log("THE ONE Bakery Server Started");
    console.log(`Running : http://localhost:${PORT}`);
    console.log("================================");
});
