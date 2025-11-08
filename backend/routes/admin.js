const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const PurchaseRequest = require('../models/PurchaseRequest');
const BillingReport = require('../models/BillingReport');
const { authenticate, authorizeRole } = require('../middleware/auth');
const sequelize = require('../config/database');

const router = express.Router();

// Get all users
router.get('/users', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'ASC']]
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Delete specific user
router.delete('/users/:id', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

// Delete all users
router.delete('/users', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await sequelize.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    res.json({ message: 'All users deleted and auto-increment reset' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete users', error: error.message });
  }
});

// Get all orders
router.get('/orders', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: User, as: 'customer' }
      ],
      order: [['id', 'DESC']]
    });
    
    const formattedOrders = orders.map(order => ({
      id: order.id,
      product_name: order.product.name,
      customer_name: order.customer.username,
      status: order.status,
      quantity: order.quantity
    }));
    
    res.json({ orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get all purchase requests
router.get('/purchase_requests', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const purchaseRequests = await PurchaseRequest.findAll({
      order: [['id', 'DESC']]
    });
    res.json(purchaseRequests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch purchase requests', error: error.message });
  }
});

// Get all billing reports
router.get('/billing_report', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const billingReports = await BillingReport.findAll({
      order: [['id', 'DESC']]
    });
    res.json(billingReports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch billing reports', error: error.message });
  }
});

module.exports = router;
