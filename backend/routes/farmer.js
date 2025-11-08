const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const PurchaseRequest = require('../models/PurchaseRequest');
const BillingReport = require('../models/BillingReport');
const User = require('../models/User');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get farmer's orders
router.get('/orders', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { farmer_id: req.user.id },
      attributes: ['id']
    });

    const productIds = products.map(p => p.id);

    const orders = await Order.findAll({
      where: { product_id: productIds },
      include: [{ model: Product, as: 'product' }],
      order: [['id', 'DESC']]
    });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Accept Order
router.put('/accept_order', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    const { order_id } = req.body;
    
    const order = await Order.findByPk(order_id, {
      include: [{ model: Product, as: 'product' }]
    });

    if (!order || order.product.farmer_id !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status: 'accepted' });
    
    await PurchaseRequest.update(
      { status: 'accepted' },
      { where: { order_id } }
    );

    res.json({ message: 'Order accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept order', error: error.message });
  }
});

// Reject Order
router.put('/reject_order', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    const { order_id } = req.body;
    
    const order = await Order.findByPk(order_id, {
      include: [{ model: Product, as: 'product' }]
    });

    if (!order || order.product.farmer_id !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status: 'rejected' });
    
    await PurchaseRequest.update(
      { status: 'rejected' },
      { where: { order_id } }
    );

    res.json({ message: 'Order rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject order', error: error.message });
  }
});

// Ship Order
router.put('/ship_order', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    const { order_id } = req.body;
    
    const order = await Order.findByPk(order_id, {
      include: [{ model: Product, as: 'product' }]
    });

    if (!order || order.product.farmer_id !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status: 'shipped' });
    
    await PurchaseRequest.update(
      { status: 'shipped' },
      { where: { order_id } }
    );

    res.json({ message: 'Order shipped successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to ship order', error: error.message });
  }
});

// Deliver Order
router.put('/deliver_order', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    const { order_id } = req.body;
    
    const order = await Order.findByPk(order_id, {
      include: [
        { model: Product, as: 'product' },
        { model: User, as: 'customer' }
      ]
    });

    if (!order || order.product.farmer_id !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status: 'delivered' });
    
    await PurchaseRequest.update(
      { status: 'delivered' },
      { where: { order_id } }
    );

    // Create billing report
    await BillingReport.create({
      order_id: order.id,
      status: 'delivered',
      product_name: order.product.name,
      price: order.product.price,
      customer_name: order.customer.username,
      details: `Order delivered successfully`
    });

    res.json({ message: 'Order delivered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to deliver order', error: error.message });
  }
});

module.exports = router;
