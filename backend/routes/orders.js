const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const PurchaseRequest = require('../models/PurchaseRequest');
const BillingReport = require('../models/BillingReport');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Create Order (Customer only)
router.post('/create_order', authenticate, authorizeRole('customer'), async (req, res) => {
  try {
    const { product_id } = req.body;
    
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = await Order.create({
      product_id,
      customer_id: req.user.id,
      quantity: 1,
      status: 'pending'
    });

    // Create purchase request
    await PurchaseRequest.create({
      order_id: order.id,
      status: 'pending',
      product_name: product.name,
      price: product.price,
      customer_name: req.user.username
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Get customer orders
router.get('/customer', authenticate, authorizeRole('customer'), async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.user.id },
      include: [{ model: Product, as: 'product' }],
      order: [['id', 'DESC']]
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Cancel Order
router.post('/cancel', authenticate, authorizeRole('customer'), async (req, res) => {
  try {
    const { order_id } = req.body;
    
    const order = await Order.findOne({
      where: { id: order_id, customer_id: req.user.id }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel order' });
    }

    await order.update({ status: 'cancelled' });
    
    // Update purchase request
    await PurchaseRequest.update(
      { status: 'cancelled' },
      { where: { order_id } }
    );

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
});

// Get order status
router.post('/status', authenticate, async (req, res) => {
  try {
    const { order_id } = req.body;
    const order = await Order.findByPk(order_id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order_status: order.status });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order status', error: error.message });
  }
});

module.exports = router;
