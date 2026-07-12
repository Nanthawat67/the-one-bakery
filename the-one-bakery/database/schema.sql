CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  delivery_type VARCHAR(20) NOT NULL,
  address TEXT,
  total_price DECIMAL(10,2),
  status VARCHAR(30) DEFAULT 'รอยืนยัน',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
