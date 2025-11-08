const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  farmer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  num_available: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  quantity_available: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  unit: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  image_path: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: true
});

Product.belongsTo(User, { foreignKey: 'farmer_id', as: 'farmer' });

module.exports = Product;
