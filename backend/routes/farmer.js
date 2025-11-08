const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const PurchaseRequest = require('../models/PurchaseRequest');
const BillingReport = require('../models/BillingReport');
const User = require('../models/User');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// ============================================
// FARMER ROUTES
// ============================================

// ✅ GET FARMER'S ORDERS - GET /farmer/orders
router.get('/orders', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    console.log('📋 Fetching orders for farmer:', req.user.id);
    
    const products = await Product.findAll({
      where: { farmer_id: req.user.id },
      attributes: ['id']
    });

    const productIds = products.map(p => p.id);

    const orders = await Order.findAll({
      where: { product_id: productIds },
      include: [
        { model: Product, as: 'product' },
        { model: User, as: 'customer' }
      ],
      order: [['id', 'DESC']]
    });

    console.log(`✅ Found ${orders.length} orders`);
    res.json({ orders });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// ✅ ACCEPT ORDER - PUT /farmer/accept_order
router.put('/accept_order', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    console.log('✅ Accepting order:', req.body);
    const { order_id } = req.body;
    
    const order = await Order.findByPk(order_id, {
      include: [{ model: Product, as: 'product' }]
    });

    if (!order || order.product.farmer_id !== req.user.id) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be accepted' });
    }

    await order.update({ status: 'accepted' });
    await PurchaseRequest.update({ status: 'accepted' }, { where: { order_id } });

    console.log('✅ Order accepted:', order_id);
    res.json({ message: 'Order accepted successfully' });
  } catch (error) {
    console.error('❌ Error accepting order:', error);
    res.status(500).json({ message: 'Failed to accept order', error: error.message });
  }
});

// ✅ REJECT ORDER - PUT /farmer/reject_order
router.put('/reject_order', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    console.log('❌ Rejecting order:', req.body);
    const { order_id } = req.body;
    
    const order = await Order.findByPk(order_id, {
      include: [{ model: Product, as: 'product' }]
    });

    if (!order || order.product.farmer_id !== req.user.id) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be rejected' });
    }

    // Restore product quantity when rejected
    const product = order.product;
    const orderedQuantity = order.quantity;

    if (product.num_available !== null) {
      await product.update({
        num_available: orderedQuantity,
        available: true
      });
      console.log(`♻️ Restored num_available after rejection: 0 -> ${orderedQuantity}`);
    } else if (product.quantity_available !== null) {
      await product.update({
        quantity_available: orderedQuantity,
        available: true
      });
      console.log(`♻️ Restored quantity_available after rejection: 0 -> ${orderedQuantity} ${product.unit}`);
    }

    await order.update({ status: 'rejected' });
    await PurchaseRequest.update({ status: 'rejected' }, { where: { order_id } });

    console.log('✅ Order rejected:', order_id);
    res.json({ message: 'Order rejected successfully' });
  } catch (error) {
    console.error('❌ Error rejecting order:', error);
    res.status(500).json({ message: 'Failed to reject order', error: error.message });
  }
});

// ✅ SHIP ORDER - PUT /farmer/ship_order
router.put('/ship_order', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    console.log('📦 Shipping order:', req.body);
    const { order_id } = req.body;
    
    const order = await Order.findByPk(order_id, {
      include: [{ model: Product, as: 'product' }]
    });

    if (!order || order.product.farmer_id !== req.user.id) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    if (order.status !== 'accepted') {
      return res.status(400).json({ message: 'Order cannot be shipped' });
    }

    await order.update({ status: 'shipped' });
    await PurchaseRequest.update({ status: 'shipped' }, { where: { order_id } });

    console.log('✅ Order shipped:', order_id);
    res.json({ message: 'Order shipped successfully' });
  } catch (error) {
    console.error('❌ Error shipping order:', error);
    res.status(500).json({ message: 'Failed to ship order', error: error.message });
  }
});

// ✅ DELIVER ORDER - PUT /farmer/deliver_order
router.put('/deliver_order', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    console.log('🚚 Delivering order:', req.body);
    const { order_id } = req.body;
    
    const order = await Order.findByPk(order_id, {
      include: [
        { model: Product, as: 'product' },
        { model: User, as: 'customer' }
      ]
    });

    if (!order || order.product.farmer_id !== req.user.id) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    if (order.status !== 'shipped') {
      return res.status(400).json({ message: 'Order cannot be delivered' });
    }

    await order.update({ status: 'delivered' });
    await PurchaseRequest.update({ status: 'delivered' }, { where: { order_id } });

    // Create billing report with total price
    const totalPrice = order.product.price * order.quantity;
    
    await BillingReport.create({
      order_id: order.id,
      status: 'delivered',
      product_name: order.product.name,
      price: totalPrice,
      customer_name: order.customer.username,
      details: `Order delivered successfully. Quantity: ${order.quantity}${order.product.unit ? ' ' + order.product.unit : ''}`
    });

    console.log('✅ Order delivered:', order_id);
    console.log(`💰 Billing report created with total: ₹${totalPrice}`);
    
    res.json({ message: 'Order delivered successfully' });
  } catch (error) {
    console.error('❌ Error delivering order:', error);
    res.status(500).json({ message: 'Failed to deliver order', error: error.message });
  }
});

module.exports = router;