const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');

const PurchaseRequest = sequelize.define('PurchaseRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  product_name: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  customer_name: {
    type: DataTypes.STRING(80),
    allowNull: false
  }
}, {
  tableName: 'purchase_requests',
  timestamps: true
});

PurchaseRequest.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = PurchaseRequest;
