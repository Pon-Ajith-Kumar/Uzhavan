const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// ============================================
// PRODUCT ROUTES
// ============================================

// ✅ CREATE PRODUCT - POST /create_product
router.post('/create_product', authenticate, authorizeRole('farmer'), upload.single('image'), async (req, res) => {
  try {
    console.log('📝 Creating product...');
    console.log('User:', req.user.id);
    console.log('Body:', req.body);
    console.log('File:', req.file ? req.file.filename : 'No file');

    const { name, description, price, num_available, quantity_available, unit } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    if (num_available && (quantity_available || unit)) {
      return res.status(400).json({
        message: 'Specify either Number Available OR Quantity Available with Unit, not both'
      });
    }

    const product = await Product.create({
      name,
      description: description || '',
      price: parseFloat(price),
      num_available: num_available ? parseInt(num_available) : null,
      quantity_available: quantity_available ? parseFloat(quantity_available) : null,
      unit: unit || null,
      farmer_id: req.user.id,
      image_path: req.file ? req.file.filename : null,
      available: true
    });

    console.log('✅ Product created with ID:', product.id);

    res.status(201).json({ 
      message: 'Product created successfully', 
      product: product.toJSON()
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create product', 
      error: error.message 
    });
  }
});

// ✅ GET ALL PRODUCTS (PUBLIC) - GET /products/list
router.get('/products/list', async (req, res) => {
  try {
    console.log('📋 Fetching all products...');
    const { Op } = require('sequelize');
    
    const products = await Product.findAll({
      where: { 
        available: true,
        [Op.or]: [
          { num_available: { [Op.gt]: 0 } },
          { quantity_available: { [Op.gt]: 0 } }
        ]
      },
      order: [['id', 'DESC']]
    });
    console.log(`✅ Found ${products.length} available products`);
    res.json({ products });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// ✅ GET FARMER'S PRODUCTS - GET /products/farmer
router.get('/products/farmer', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    console.log('📋 Fetching farmer products for user:', req.user.id);
    const products = await Product.findAll({
      where: { farmer_id: req.user.id },
      order: [['id', 'DESC']]
    });
    console.log(`✅ Found ${products.length} products for farmer`);
    res.json({ products });
  } catch (error) {
    console.error('❌ Error fetching farmer products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// ✅ UPDATE PRODUCT - PUT /products/update
router.put('/products/update', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    console.log('📝 Updating product:', req.body);
    const { id, name, description, price, num_available, quantity_available, unit } = req.body;
    
    const product = await Product.findOne({
      where: { id, farmer_id: req.user.id }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    if (num_available && (quantity_available || unit)) {
      return res.status(400).json({
        message: 'Specify either Number Available OR Quantity Available with Unit'
      });
    }

    await product.update({
      name,
      description,
      price: parseFloat(price),
      num_available: num_available ? parseInt(num_available) : null,
      quantity_available: quantity_available ? parseFloat(quantity_available) : null,
      unit: unit || null
    });

    console.log('✅ Product updated:', product.id);

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// ✅ DELETE PRODUCT - DELETE /products/:id
router.delete('/products/:id', authenticate, authorizeRole('farmer'), async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting product:', id);
    
    const product = await Product.findOne({
      where: { id, farmer_id: req.user.id }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    // Delete image file if exists
    if (product.image_path) {
      const imagePath = path.join(uploadsDir, product.image_path);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    await product.destroy();
    console.log('✅ Product deleted:', id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;