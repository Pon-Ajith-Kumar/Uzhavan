const express = require('express');
const PurchaseRequest = require('../models/PurchaseRequest');
const BillingReport = require('../models/BillingReport');
const Order = require('../models/Order');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// ============================================
// CUSTOMER ROUTES
// ============================================

// ✅ GET CUSTOMER PURCHASE REQUESTS - GET /customer/purchase_requests
router.get('/purchase_requests', authenticate, authorizeRole('customer'), async (req, res) => {
  try {
    console.log('📋 Fetching purchase requests for customer:', req.user.id);
    
    const orders = await Order.findAll({
      where: { customer_id: req.user.id },
      attributes: ['id']
    });

    const orderIds = orders.map(o => o.id);

    const purchaseRequests = await PurchaseRequest.findAll({
      where: { order_id: orderIds },
      order: [['id', 'DESC']]
    });

    console.log(`✅ Found ${purchaseRequests.length} purchase requests`);
    res.json({ purchase_requests: purchaseRequests });
  } catch (error) {
    console.error('❌ Error fetching purchase requests:', error);
    res.status(500).json({ message: 'Failed to fetch purchase requests', error: error.message });
  }
});

// ✅ GET CUSTOMER BILLING REPORTS - GET /customer/billing_reports
router.get('/billing_reports', authenticate, authorizeRole('customer'), async (req, res) => {
  try {
    console.log('📋 Fetching billing reports for customer:', req.user.id);
    
    const orders = await Order.findAll({
      where: { customer_id: req.user.id },
      attributes: ['id']
    });

    const orderIds = orders.map(o => o.id);

    const billingReports = await BillingReport.findAll({
      where: { order_id: orderIds },
      order: [['id', 'DESC']]
    });

    console.log(`✅ Found ${billingReports.length} billing reports`);
    res.json({ billing_reports: billingReports });
  } catch (error) {
    console.error('❌ Error fetching billing reports:', error);
    res.status(500).json({ message: 'Failed to fetch billing reports', error: error.message });
  }
});

module.exports = router;