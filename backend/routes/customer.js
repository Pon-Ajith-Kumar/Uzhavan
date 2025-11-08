const express = require('express');
const PurchaseRequest = require('../models/PurchaseRequest');
const BillingReport = require('../models/BillingReport');
const Order = require('../models/Order');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get customer purchase requests
router.get('/purchase_requests', authenticate, authorizeRole('customer'), async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.user.id },
      attributes: ['id']
    });

    const orderIds = orders.map(o => o.id);

    const purchaseRequests = await PurchaseRequest.findAll({
      where: { order_id: orderIds },
      order: [['id', 'DESC']]
    });

    res.json({ purchase_requests: purchaseRequests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch purchase requests', error: error.message });
  }
});

// Get customer billing reports
router.get('/billing_reports', authenticate, authorizeRole('customer'), async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.user.id },
      attributes: ['id']
    });

    const orderIds = orders.map(o => o.id);

    const billingReports = await BillingReport.findAll({
      where: { order_id: orderIds },
      order: [['id', 'DESC']]
    });

    res.json({ billing_reports: billingReports });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch billing reports', error: error.message });
  }
});

module.exports = router;
