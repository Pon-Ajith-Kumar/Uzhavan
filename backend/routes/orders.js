const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const PurchaseRequest = require('../models/PurchaseRequest');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// ============================================
// ORDER ROUTES
// ============================================

// ✅ CREATE ORDER - POST /create_order
router.post('/create_order', authenticate, authorizeRole('customer'), async (req, res) => {
  try {
    console.log('📝 Creating order...');
    console.log('Customer:', req.user.id);
    console.log('Body:', req.body);

    const { product_id } = req.body;
    
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.available) {
      return res.status(400).json({ message: 'Product not available' });
    }

    // Determine order quantity based on product type
    let orderQuantity = 0;
    let quantityType = null;
    
    if (product.num_available !== null && product.num_available > 0) {
      // If product uses num_available (countable items)
      orderQuantity = product.num_available;
      quantityType = 'num_available';
    } else if (product.quantity_available !== null && product.quantity_available > 0) {
      // If product uses quantity_available (weight/volume)
      orderQuantity = product.quantity_available;
      quantityType = 'quantity_available';
    } else {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    // Create the order with full quantity
    const order = await Order.create({
      product_id,
      customer_id: req.user.id,
      quantity: orderQuantity,
      status: 'pending'
    });

    // Update product - SET QUANTITY TO 0 and mark as unavailable
    if (quantityType === 'num_available') {
      await product.update({
        num_available: 0,
        available: false
      });
      console.log(`📦 Updated num_available: ${orderQuantity} -> 0`);
    } else if (quantityType === 'quantity_available') {
      await product.update({
        quantity_available: 0,
        available: false
      });
      console.log(`📦 Updated quantity_available: ${orderQuantity} ${product.unit} -> 0`);
    }

    // Create purchase request
    await PurchaseRequest.create({
      order_id: order.id,
      status: 'pending',
      product_name: product.name,
      price: product.price,
      customer_name: req.user.username
    });

    console.log('✅ Order created with ID:', order.id);
    console.log(`✅ Product stock updated to 0`);

    res.status(201).json({ 
      message: 'Order created successfully', 
      order: {
        ...order.toJSON(),
        product: product.toJSON()
      }
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// ✅ GET CUSTOMER ORDERS - GET /orders/customer
router.get('/orders/customer', authenticate, authorizeRole('customer'), async (req, res) => {
  try {
    console.log('📋 Fetching orders for customer:', req.user.id);
    const orders = await Order.findAll({
      where: { customer_id: req.user.id },
      include: [{ model: Product, as: 'product' }],
      order: [['id', 'DESC']]
    });
    console.log(`✅ Found ${orders.length} orders`);
    res.json({ orders });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// ✅ CANCEL ORDER - POST /orders/cancel
router.post('/orders/cancel', authenticate, authorizeRole('customer'), async (req, res) => {
  try {
    console.log('🚫 Cancelling order:', req.body);
    const { order_id } = req.body;
    
    const order = await Order.findOne({
      where: { id: order_id, customer_id: req.user.id },
      include: [{ model: Product, as: 'product' }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel this order. Only pending orders can be cancelled.' });
    }

    // Restore product quantity from the order
    const product = order.product;
    const orderedQuantity = order.quantity;

    if (product.num_available !== null) {
      // Restore num_available
      await product.update({
        num_available: orderedQuantity,
        available: true
      });
      console.log(`♻️ Restored num_available: 0 -> ${orderedQuantity}`);
    } else if (product.quantity_available !== null) {
      // Restore quantity_available
      await product.update({
        quantity_available: orderedQuantity,
        available: true
      });
      console.log(`♻️ Restored quantity_available: 0 -> ${orderedQuantity} ${product.unit}`);
    }

    // Update order and purchase request status
    await order.update({ status: 'cancelled' });
    await PurchaseRequest.update({ status: 'cancelled' }, { where: { order_id } });

    console.log('✅ Order cancelled:', order_id);

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('❌ Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
});

// ✅ GET ORDER STATUS - POST /orders/status
router.post('/orders/status', authenticate, async (req, res) => {
  try {
    const { order_id } = req.body;
    console.log('🔍 Checking order status:', order_id);
    
    const order = await Order.findByPk(order_id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order_status: order.status });
  } catch (error) {
    console.error('❌ Error fetching order status:', error);
    res.status(500).json({ message: 'Failed to fetch order status', error: error.message });
  }
});

module.exports = router;