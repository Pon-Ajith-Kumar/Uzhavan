import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AdminLayout from './components/Admin/AdminLayout';
import ViewUsers from './components/Admin/ViewUsers';
import DeleteUsers from './components/Admin/DeleteUsers';
import ProductList from './components/Admin/ProductList';
import ViewOrders from './components/Admin/ViewOrders';
import ViewPurchaseRequests from './components/Admin/ViewPurchaseRequests';
import ViewBillingReports from './components/Admin/ViewBillingReports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users" element={<ViewUsers />} />
          <Route path="users/delete" element={<DeleteUsers />} />
          <Route path="products" element={<ProductList />} />
          <Route path="orders" element={<ViewOrders />} />
          <Route path="purchase-requests" element={<ViewPurchaseRequests />} />
          <Route path="billing-report" element={<ViewBillingReports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
