const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create Product (Farmer only)
router.post('/create_product', authenticate, authorizeRole('farmer'), upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, num_available, quantity_available, unit } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      num_available: num_available || null,
      quantity_available: quantity_available || null,
      unit: unit || null,
      farmer_id: req.user.id,
      image_path: req.file ? req.file.filename : null
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// Get all products (public)
router.get('/list', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { available: true },
      order: [['id', 'DESC']]
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get farmer's products
router.get('/farmer', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { farmer_id: req.user.id },
      order: [['id', 'DESC']]
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Update Product
router.put('/update', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    const { id, name, description, price, num_available, quantity_available, unit } = req.body;
    
    const product = await Product.findOne({
      where: { id, farmer_id: req.user.id }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update({
      name,
      description,
      price,
      num_available: num_available || null,
      quantity_available: quantity_available || null,
      unit: unit || null
    });

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

module.exports = router;
