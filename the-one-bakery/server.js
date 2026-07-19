const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');require('dotenv').config();
const dashboardRoutes =require('./routes/dashboard');
const kitchenRoutes =require('./routes/kitchen');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/kitchen',kitchenRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});