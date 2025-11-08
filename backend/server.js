const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const farmerRoutes = require('./routes/farmer');
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// ✅ CORRECTED ROUTES
app.use('/', authRoutes);              // Handles /register, /login, /profile, /change_password
app.use('/products', productRoutes);   // Handles /products/*
app.use('/orders', orderRoutes);       // Handles /orders/*
app.use('/farmer', farmerRoutes);      // Handles /farmer/*
app.use('/customer', customerRoutes);  // Handles /customer/*
app.use('/admin', adminRoutes);        // Handles /admin/*

// Database connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Database synced');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err);
  });

module.exports = app;
