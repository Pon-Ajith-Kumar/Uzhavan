// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Layout from './components/Layout';
// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';
import UsersList from './components/Admin/UsersList';
import ProductsList from './components/Admin/ProductsList';
import OrdersList from './components/Admin/OrdersList';
import PurchaseRequests from './components/Admin/PurchaseRequests';
import BillingReports from './components/Admin/BillingReports';
// Farmer Components
import CreateProduct from './components/Farmer/CreateProduct';
import FarmerProducts from './components/Farmer/FarmerProducts';
import FarmerOrders from './components/Farmer/FarmerOrders';
// Customer Components
import CreateOrder from './components/Customer/CreateOrder';
import CustomerOrders from './components/Customer/CustomerOrders';
import CustomerPurchaseRequests from './components/Customer/CustomerPurchaseRequests';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/products" element={<ProductsList />} />
          <Route path="/admin/orders" element={<OrdersList />} />
          <Route path="/admin/purchase_requests" element={<PurchaseRequests />} />
          <Route path="/admin/billing_report" element={<BillingReports />} />
          <Route path="/create_product" element={<CreateProduct />} />
          <Route path="/products/farmer" element={<FarmerProducts />} />
          <Route path="/farmer/orders" element={<FarmerOrders />} />
          <Route path="/create_order" element={<CreateOrder />} />
          <Route path="/orders/customer" element={<CustomerOrders />} />
          <Route path="/customer/purchase_requests" element={<CustomerPurchaseRequests />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
