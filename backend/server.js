const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const farmerRoutes = require('./routes/farmer');
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin');

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// ============================================
// ROUTES - MOUNT AT ROOT LEVEL
// ============================================

// Auth Routes
app.use(authRoutes);

// Product Routes
app.use(productRoutes);

// Order Routes
app.use(orderRoutes);

// Farmer Routes
app.use('/farmer', farmerRoutes);

// Customer Routes
app.use('/customer', customerRoutes);

// Admin Routes
app.use('/admin', adminRoutes);

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ============================================
// Database Connection & Server Start
// ============================================
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Database synced');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}`);
      console.log('\n📋 Available Routes:');
      console.log('   POST   /register');
      console.log('   POST   /login');
      console.log('   GET    /profile');
      console.log('   PUT    /profile');
      console.log('   PUT    /change_password');
      console.log('   POST   /create_product');
      console.log('   GET    /products/list');
      console.log('   GET    /products/farmer');
      console.log('   PUT    /products/update');
      console.log('   POST   /create_order');
      console.log('   GET    /orders/customer');
      console.log('   POST   /orders/cancel');
      console.log('   POST   /orders/status');
      console.log('   GET    /farmer/orders');
      console.log('   PUT    /farmer/accept_order');
      console.log('   PUT    /farmer/reject_order');
      console.log('   PUT    /farmer/ship_order');
      console.log('   PUT    /farmer/deliver_order');
      console.log('   GET    /customer/purchase_requests');
      console.log('   GET    /customer/billing_reports');
      console.log('   GET    /admin/users');
      console.log('   DELETE /admin/users/:id');
      console.log('   DELETE /admin/users');
      console.log('   GET    /admin/orders');
      console.log('   GET    /admin/purchase_requests');
      console.log('   GET    /admin/billing_report');
      console.log('');
    });
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });

module.exports = app;