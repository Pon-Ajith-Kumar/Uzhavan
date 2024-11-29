import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import CustomerLayout from './components/Customer/CustomerLayout'; // Import the customer layout
import CreateOrder from './components/Customer/CreateOrder';
import ViewOrdersCustomer from './components/Customer/ViewOrdersCustomer';
import ViewPurchaseRequestsCustomer from './components/Customer/ViewPurchaseRequestsCustomer';
import ViewBillingReportsCustomer from './components/Customer/ViewBillingReportsCustomer';
import TrackOrderStatus from './components/Customer/TrackOrderStatus';
import CancelOrder from './components/Customer/CancelOrder';
import ViewProfile from './components/Admin/ViewProfile'; // Import the ViewProfile component
import FarmerViewProfile from './components/Farmer/FarmerViewProfile'; // Import the FarmerViewProfile component
import CustomerViewProfile from './components/Customer/CustomerViewProfile'; // Import the CustomerViewProfile component
import CustomerProductList from './components/Customer/CustomerProductList'; // Import the CustomerProductList component

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
          <Route index element={<Navigate to="profile" replace />} /> {/* Redirect to profile by default */}
          <Route path="profile" element={<ViewProfile />} />
          <Route path="users" element={<ViewUsers />} />
          <Route path="users/delete" element={<DeleteUsers />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="orders" element={<ViewOrders />} />
          <Route path="purchase-requests" element={<ViewPurchaseRequests />} />
          <Route path="billing-report" element={<ViewBillingReports />} />
          {/* Redirect to /admin/profile by default */}
          <Route path="*" element={<Navigate to="profile" replace />} />
        </Route>
        
        {/* Farmer Routes */}
        <Route path="/farmer" element={<FarmerLayout />}>
          <Route index element={<Navigate to="profile" replace />} /> {/* Redirect to profile by default */}
          <Route path="profile" element={<FarmerViewProfile />} /> {/* Add Farmer profile route */}
          <Route path="create_product" element={<CreateProduct />} />
          <Route path="products" element={<FarmerProductList />} />
          <Route path="orders" element={<FarmerOrders />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="profile" replace />} /> {/* Redirect to profile by default */}
          <Route path="profile" element={<CustomerViewProfile />} /> {/* Add Customer profile route */}
          <Route path="create-order" element={<CreateOrder />} />
          <Route path="view-orders" element={<ViewOrdersCustomer />} />
          <Route path="view-purchase-requests" element={<ViewPurchaseRequestsCustomer />} />
          <Route path="view-billing-reports" element={<ViewBillingReportsCustomer />} />
          <Route path="track-order-status" element={<TrackOrderStatus />} />
          <Route path="cancel-order" element={<CancelOrder />} />
          <Route path="uzhavan-store-c" element={<CustomerProductList />} /> {/* Add route for Uzhavan Store C */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
