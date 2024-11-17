import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AdminLayout from './components/Admin/AdminLayout';
import ViewUsers from './components/Admin/ViewUsers';
import DeleteUsers from './components/Admin/DeleteUsers';
import AdminProductList from './components/Admin/ProductList'; // Admin-specific product list
import ViewOrders from './components/Admin/ViewOrders';
import ViewPurchaseRequests from './components/Admin/ViewPurchaseRequests';
import ViewBillingReports from './components/Admin/ViewBillingReports';
import FarmerLayout from './components/Farmer/FarmerLayout';
import CreateProduct from './components/Farmer/CreateProduct';
import FarmerProductList from './components/Farmer/FarmerProductList';
import FarmerOrders from './components/Farmer/FarmerOrders';
import GeneralProductList from './components/Admin/ProductList'; // General product list for Uzhavan Store

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<GeneralProductList />} /> {/* General product list for Uzhavan Store */}
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users" element={<ViewUsers />} />
          <Route path="users/delete" element={<DeleteUsers />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="orders" element={<ViewOrders />} />
          <Route path="purchase-requests" element={<ViewPurchaseRequests />} />
          <Route path="billing-report" element={<ViewBillingReports />} />
        </Route>
        {/* Farmer Routes */}
        <Route path="/farmer" element={<FarmerLayout />}>
          <Route path="create_product" element={<CreateProduct />} />
          <Route path="products" element={<FarmerProductList />} />
          <Route path="orders" element={<FarmerOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
