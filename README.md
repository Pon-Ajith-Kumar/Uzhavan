# 🌾 உழவன் (Uzhavan)

> A comprehensive PERN-stack web application connecting farmers directly with customers, eliminating middlemen and ensuring fair prices for agricultural products.

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Backend Architecture](#-backend-architecture)
- [Frontend Architecture](#-frontend-architecture)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [User Roles & Permissions](#-user-roles--permissions)
- [Workflow](#-workflow)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Future Enhancements](#-future-enhancements)

---

## 🌟 Overview

**Uzhavan** (உழவன் - meaning "Farmer" in Tamil) is a modern agricultural marketplace platform that creates a direct bridge between farmers and customers. The platform enables farmers to list their products, manage inventory, and process orders while providing customers with fresh agricultural products at fair prices.

### Key Objectives:
- 🚜 Empower farmers with direct market access
- 🛒 Provide customers with quality products at reasonable prices
- 📊 Enable transparent pricing and inventory management
- 🔄 Streamline the order fulfillment process
- 💼 Offer comprehensive administrative oversight

---

## ✨ Features

### For Farmers
- ✅ Create and manage product listings with images
- ✅ Real-time inventory management
- ✅ Order processing workflow (Accept/Reject/Ship/Deliver)
- ✅ View order history and status
- ✅ Profile management with bank details

### For Customers
- ✅ Browse available agricultural products
- ✅ Place orders for products
- ✅ Track order status in real-time
- ✅ Cancel pending orders
- ✅ View purchase requests and billing reports
- ✅ Manage personal profile

### For Administrators
- ✅ User management (view/delete users)
- ✅ Monitor all products and orders
- ✅ View purchase requests and billing reports
- ✅ System-wide analytics and oversight
- ✅ Complete platform management

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database management
- **JWT** - Authentication & authorization
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Modal** - Modal dialogs
- **React Select** - Enhanced dropdowns
- **Country-State-City** - Location data
- **Font Awesome & React Icons** - Icons

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Check Installation

```bash
node --version    # Should show v14.x.x or higher
npm --version     # Should show 6.x.x or higher
psql --version    # Should show PostgreSQL 12.x or higher
git --version     # Should show git version 2.x.x or higher
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/uzhavan-marketplace.git

# Navigate to project directory
cd uzhavan-marketplace
```

### Step 2: Database Setup

#### 2.1 Start PostgreSQL Service

**On Ubuntu/Debian:**
```bash
sudo service postgresql start
```

**On macOS (with Homebrew):**
```bash
brew services start postgresql
```

**On Windows:**
- Start PostgreSQL from Services or pgAdmin

#### 2.2 Create Database

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE uzhavan_db;

# Exit psql
\q
```

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

#### 3.1 Configure Environment Variables

Edit the `.env` file with your configuration:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uzhavan_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
NODE_ENV=development
```

⚠️ **Important:** Replace `your_postgres_password` with your actual PostgreSQL password and create a strong `JWT_SECRET` key.

#### 3.2 Create Uploads Directory

```bash
# Still in backend directory
mkdir uploads
```

### Step 4: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional)
touch .env
```

#### 4.1 Configure Frontend Environment (Optional)

Edit the `.env` file:

```env
PORT=3000
REACT_APP_API_URL=http://localhost:5000
```

---

## 🎯 Running the Application

### Method 1: Run Backend and Frontend Separately

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Database connected successfully
✅ Database synced
🚀 Server running on http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view uzhavan-frontend in the browser.
  Local:            http://localhost:3000
```

Then run:
```bash
npm install
npm run dev
```

---

## 📁 Project Structure

```
uzhavan-marketplace/
├── backend/                      # Backend server
│   │
│   ├── config/                   # Configuration files
│   │   └── database.js          # Database configuration
│   │
│   ├── middleware/               # Custom middleware
│   │   └── auth.js              # Authentication middleware
│   │
│   ├── models/                   # Database models
│   │   ├── User.js              # User model
│   │   ├── Product.js           # Product model
│   │   ├── Order.js             # Order model
│   │   ├── PurchaseRequest.js   # Purchase request model
│   │   └── BillingReport.js     # Billing report model
│   │
│   ├── routes/                   # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── products.js          # Product routes
│   │   ├── orders.js            # Order routes
│   │   ├── farmer.js            # Farmer-specific routes
│   │   ├── customer.js          # Customer-specific routes
│   │   └── admin.js             # Admin routes
│   │
│   ├── uploads/                  # Uploaded product images
│   │
│   ├── .env                      # Environment variables
│   │
│   ├── package.json             # Backend dependencies
│   │
│   └── server.js                # Entry point
│
├── frontend/                     # React frontend
│   │
│   ├── public/                   # Public assets
│   │   ├── images/              # Static images
│   │   └── index.html           # HTML template
│   │
│   ├── src/                      # Source code
│   │   ├── assets/              # Images, fonts, etc.
│   │   │   └── images/          # App images (logo, hero, etc.)
│   │   │
│   │   ├── components/          # React components
│   │   │   ├── Admin/           # Admin components
│   │   │   │   ├── AdminLayout.js
│   │   │   │   ├── AdminNavbar.js
│   │   │   │   ├── AdminVerticalNavbar.js
│   │   │   │   ├── ViewProfile.js
│   │   │   │   ├── ViewUsers.js
│   │   │   │   ├── ProductList.js
│   │   │   │   ├── ViewOrders.js
│   │   │   │   ├── ViewPurchaseRequests.js
│   │   │   │   ├── ViewBillingReports.js
│   │   │   │   └── DeleteUsers.js
│   │   │   │
│   │   │   ├── Farmer/          # Farmer components
│   │   │   │   ├── FarmerLayout.js
│   │   │   │   ├── FarmerNavbar.js
│   │   │   │   ├── FarmerVerticalNavbar.js
│   │   │   │   ├── FarmerViewProfile.js
│   │   │   │   ├── CreateProduct.js
│   │   │   │   ├── FarmerProductList.js
│   │   │   │   └── FarmerOrders.js
│   │   │   │
│   │   │   ├── Customer/        # Customer components
│   │   │   │   ├── CustomerLayout.js
│   │   │   │   ├── CustomerNavbar.js
│   │   │   │   ├── CustomerVerticalNavbar.js
│   │   │   │   ├── CustomerViewProfile.js
│   │   │   │   ├── CustomerProductList.js
│   │   │   │   ├── CreateOrder.js
│   │   │   │   ├── ViewOrdersCustomer.js
│   │   │   │   ├── ViewPurchaseRequestsCustomer.js
│   │   │   │   ├── ViewBillingReportsCustomer.js
│   │   │   │   ├── TrackOrderStatus.js
│   │   │   │   └── CancelOrder.js
│   │   │   │
│   │   │   ├── Home.js          # Landing page
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Register.js      # Registration page
│   │   │   ├── Navbar.js        # Main navigation
│   │   │   └── Footer.js        # Footer component
│   │   │   
│   │   ├── App.js               # Main app component
│   │   ├── App.css              # App styles
│   │   ├── index.js             # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json             # Frontend dependencies
│   └── .env                      # Frontend environment variables
│
└── README.md                     # This file
```

---

## 🔧 Backend Architecture

### Database Models

#### 1. **User Model** (`models/User.js`)
Stores user information for all three roles (Admin, Farmer, Customer).

**Fields:**
- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password
- `email` - User email
- `contact` - Phone number
- `country`, `state`, `district`, `taluk` - Location
- `address`, `pincode` - Address details
- `account_no`, `account_holder_name`, `bank_name`, `branch_name`, `ifsc_code` - Bank details
- `role` - User role (farmer/customer/admin)

#### 2. **Product Model** (`models/Product.js`)
Stores product information created by farmers.

**Fields:**
- `id` - Primary key
- `name` - Product name
- `description` - Product description
- `price` - Product price per unit
- `available` - Availability status (boolean)
- `farmer_id` - Foreign key to User (farmer)
- `num_available` - Number of countable items (e.g., 5 coconuts)
- `quantity_available` - Quantity in weight/volume (e.g., 3 kg)
- `unit` - Unit of measurement (kg, liters, etc.)
- `image_path` - Path to product image

#### 3. **Order Model** (`models/Order.js`)
Stores order information.

**Fields:**
- `id` - Primary key
- `product_id` - Foreign key to Product
- `customer_id` - Foreign key to User (customer)
- `quantity` - Ordered quantity
- `status` - Order status (pending/accepted/shipped/delivered/cancelled/rejected)

#### 4. **PurchaseRequest Model** (`models/PurchaseRequest.js`)
Tracks purchase requests generated from orders.

**Fields:**
- `id` - Primary key
- `order_id` - Foreign key to Order
- `status` - Request status
- `product_name` - Product name
- `price` - Product price
- `customer_name` - Customer name

#### 5. **BillingReport Model** (`models/BillingReport.js`)
Stores billing information after order delivery.

**Fields:**
- `id` - Primary key
- `order_id` - Foreign key to Order
- `status` - Billing status
- `product_name` - Product name
- `price` - Total price
- `customer_name` - Customer name
- `details` - Additional details

### Middleware

#### Authentication Middleware (`middleware/auth.js`)

**Functions:**
- `authenticate()` - Verifies JWT token and attaches user to request
- `authorizeRole(...roles)` - Checks if user has required role

**Usage:**
```javascript
router.get('/farmer/orders', authenticate, authorizeRole('farmer'), handler);
```

### API Routes

#### Authentication Routes (`routes/auth.js`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)
- `PUT /change_password` - Change password (protected)

#### Product Routes (`routes/products.js`)
- `POST /create_product` - Create product (farmer only)
- `GET /products/list` - Get all available products (public)
- `GET /products/farmer` - Get farmer's products (farmer only)
- `PUT /products/update` - Update product (farmer only)
- `DELETE /products/:id` - Delete product (farmer only)

#### Order Routes (`routes/orders.js`)
- `POST /create_order` - Create order (customer only)
- `GET /orders/customer` - Get customer orders (customer only)
- `POST /orders/cancel` - Cancel order (customer only)
- `POST /orders/status` - Get order status (protected)

#### Farmer Routes (`routes/farmer.js`)
- `GET /farmer/orders` - Get farmer's orders
- `PUT /farmer/accept_order` - Accept order
- `PUT /farmer/reject_order` - Reject order
- `PUT /farmer/ship_order` - Ship order
- `PUT /farmer/deliver_order` - Deliver order

#### Customer Routes (`routes/customer.js`)
- `GET /customer/purchase_requests` - Get purchase requests
- `GET /customer/billing_reports` - Get billing reports

#### Admin Routes (`routes/admin.js`)
- `GET /admin/users` - Get all users
- `DELETE /admin/users/:id` - Delete specific user
- `DELETE /admin/users` - Delete all users
- `GET /admin/orders` - Get all orders
- `GET /admin/purchase_requests` - Get all purchase requests
- `GET /admin/billing_report` - Get all billing reports

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
App.js
├── Home.js (Landing Page)
├── Login.js
├── Register.js
└── Role-based Layouts
    │
    ├── AdminLayout
    │   ├── AdminNavbar
    │   ├── AdminVerticalNavbar
    │   └── Admin Pages
    │       ├── ViewProfile
    │       ├── ViewUsers
    │       ├── ProductList
    │       ├── ViewOrders
    │       ├── ViewPurchaseRequests
    │       └── ViewBillingReports
    │
    ├── FarmerLayout
    │   ├── FarmerNavbar
    │   ├── FarmerVerticalNavbar
    │   └── Farmer Pages
    │       ├── FarmerViewProfile
    │       ├── CreateProduct
    │       ├── FarmerProductList
    │       └── FarmerOrders
    │
    └── CustomerLayout
        ├── CustomerNavbar
        ├── CustomerVerticalNavbar
        └── Customer Pages
            ├── CustomerViewProfile
            ├── CustomerProductList
            ├── ViewOrdersCustomer
            ├── ViewPurchaseRequestsCustomer
            ├── ViewBillingReportsCustomer
            ├── TrackOrderStatus
            └── CancelOrder
```

### Shared Components

#### 1. **Navbar** (`components/Navbar.js`)
- Main navigation bar for public pages
- Displays logo and app name
- Links to Home, Login, Register

#### 2. **Footer** (`components/Footer.js`)
- Contains quick links
- Contact information
- Social media links

### Admin Components

#### 1. **AdminLayout** (`components/Admin/AdminLayout.js`)
- Main layout wrapper for admin pages
- Includes navbar and vertical navigation
- Manages admin routes using React Router Outlet

#### 2. **ViewUsers** (`components/Admin/ViewUsers.js`)
- Displays all users categorized by role
- Delete individual users
- Delete all users functionality

#### 3. **ViewOrders** (`components/Admin/ViewOrders.js`)
- View all orders in the system
- Display order status and details

#### 4. **ProductList** (`components/Admin/ProductList.js`)
- View all products (admin view)
- Public product listing page

### Farmer Components

#### 1. **CreateProduct** (`components/Farmer/CreateProduct.js`)
- Form to create new products
- Image upload functionality
- Supports two quantity types:
  - Countable items (e.g., 5 coconuts)
  - Measurable quantities (e.g., 3 kg rice)
- Form validation

#### 2. **FarmerProductList** (`components/Farmer/FarmerProductList.js`)
- View farmer's own products
- Shows availability status
- Update product details
- Real-time stock display

#### 3. **FarmerOrders** (`components/Farmer/FarmerOrders.js`)
- View incoming orders
- Order workflow buttons:
  - Accept/Reject (for pending orders)
  - Ship (for accepted orders)
  - Deliver (for shipped orders)
- Display order details and customer info

### Customer Components

#### 1. **CustomerProductList** (`components/Customer/CustomerProductList.js`)
- Browse available products
- View product details and images
- Create orders with one click
- Real-time stock information

#### 2. **ViewOrdersCustomer** (`components/Customer/ViewOrdersCustomer.js`)
- View all customer orders
- Orders grouped by status:
  - Pending
  - Accepted
  - Shipped
  - Delivered
  - Cancelled
  - Rejected
- Cancel pending orders

#### 3. **ViewPurchaseRequestsCustomer** (`components/Customer/ViewPurchaseRequestsCustomer.js`)
- View purchase request history
- Track request status

#### 4. **ViewBillingReportsCustomer** (`components/Customer/ViewBillingReportsCustomer.js`)
- View billing reports for delivered orders
- See total costs

---

## 📊 Database Schema

```sql
-- Users Table
users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(120) NOT NULL,
  contact VARCHAR(20),
  country VARCHAR(100),
  state VARCHAR(100),
  district VARCHAR(100),
  taluk VARCHAR(100),
  address VARCHAR(200),
  pincode VARCHAR(10),
  account_no VARCHAR(20),
  account_holder_name VARCHAR(100),
  bank_name VARCHAR(100),
  branch_name VARCHAR(100),
  ifsc_code VARCHAR(20),
  role ENUM('farmer', 'customer', 'admin') NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)

-- Products Table
products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(200),
  price FLOAT NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  farmer_id INTEGER REFERENCES users(id),
  num_available INTEGER,
  quantity_available FLOAT,
  unit VARCHAR(10),
  image_path VARCHAR(500),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)

-- Orders Table
orders (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  customer_id INTEGER REFERENCES users(id),
  quantity INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)

-- Purchase Requests Table
purchase_requests (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  status VARCHAR(20) NOT NULL,
  product_name VARCHAR(80) NOT NULL,
  price FLOAT NOT NULL,
  customer_name VARCHAR(80) NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)

-- Billing Reports Table
billing_reports (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  status VARCHAR(20) NOT NULL,
  product_name VARCHAR(80) NOT NULL,
  price FLOAT NOT NULL,
  customer_name VARCHAR(80) NOT NULL,
  details VARCHAR(200),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)
```

---

## 👥 User Roles & Permissions

### 🔴 Admin
**Capabilities:**
- View all users, products, orders
- Delete users
- Monitor purchase requests
- View billing reports
- Full system oversight

**Cannot:**
- Create products
- Place orders
- Process orders

### 🟢 Farmer
**Capabilities:**
- Create and manage products
- View and process orders
- Accept/Reject/Ship/Deliver orders
- View order history
- Manage profile details

**Cannot:**
- Place orders
- Access admin features
- View other farmers' products

### 🔵 Customer
**Capabilities:**
- Browse products
- Place orders
- Cancel pending orders
- Track order status
- View purchase requests
- View billing reports
- Manage profile

**Cannot:**
- Create products
- Access farmer/admin features
- Process orders

---

## 🔄 Workflow

### Order Lifecycle

```
1. PRODUCT CREATION (Farmer)
   └─> Product listed with quantity (e.g., 5 kg)
       └─> Available in customer store

2. ORDER PLACEMENT (Customer)
   └─> Customer creates order
       └─> Product quantity set to 0
       └─> Product marked unavailable
       └─> Purchase request generated
       └─> Order status: PENDING

3. ORDER PROCESSING (Farmer)
   ├─> ACCEPT
   │   └─> Order status: ACCEPTED
   │       └─> Can proceed to ship
   │
   └─> REJECT
       └─> Order status: REJECTED
       └─> Product quantity restored
       └─> Product becomes available again

4. SHIPPING (Farmer)
   └─> Order status: SHIPPED
       └─> Can proceed to deliver

5. DELIVERY (Farmer)
   └─> Order status: DELIVERED
       └─> Billing report generated
       └─> Transaction complete
       └─> Product remains at 0 quantity

6. CANCELLATION (Customer - only if PENDING)
   └─> Order status: CANCELLED
       └─> Product quantity restored
       └─> Product becomes available again
```
## 🤝 Contributing

We welcome contributions to Uzhavan! Here's how you can help:

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/uzhavan-marketplace.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add comments where necessary

4. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**

7. **Kindly notify me through a mail too.**

### Contribution Guidelines

- Follow the existing code structure
- Write meaningful commit messages
- Update documentation for new features
- Test your changes thoroughly
- Ensure no breaking changes

---

## 📧 Contact

**Project Maintainer:** Pon Ajith Kumar P

- Email: ponajithkumar2005@gmail.com
- LinkedIn: [Pon Ajith Kumar P](www.linkedin.com/in/ponajithkumar2005/)

**Project Link:** [https://github.com/yourusername/uzhavan-marketplace](https://github.com/yourusername/uzhavan-marketplace)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: Unable to connect to database
```
**Solution:**
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

#### 2. Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:**
```bash
# Find process using port
lsof -ti:5000

# Kill process
kill -9 <PID>
```

#### 3. CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure backend is running on port 5000
- Frontend should be on port 3000
- Check CORS configuration in `server.js`

#### 4. JWT Token Error
```
Error: JWT token is invalid
```
**Solution:**
- Clear browser localStorage
- Login again
- Check JWT_SECRET is set in `.env`

#### 5. File Upload Fails
```
Error: ENOENT: no such file or directory
```
**Solution:**
```bash
cd backend
mkdir uploads
```

---

## 📈 Future Enhancements

- [ ] Payment gateway integration
- [ ] Real-time chat between farmers and customers
- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Rating and review system
- [ ] Delivery tracking with maps
- [ ] Email notifications
- [ ] SMS alerts for orders
- [ ] Export reports to PDF/Excel

---

**Made with ❤️ for Farmers**

*Empowering agriculture, one connection at a time.*
