from .db_config import db
from sqlalchemy import Enum

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    contact = db.Column(db.String(20), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    district = db.Column(db.String(100), nullable=True)
    taluk = db.Column(db.String(100), nullable=True)
    address = db.Column(db.String(200), nullable=True)
    pincode = db.Column(db.String(10), nullable=True)
    account_no = db.Column(db.String(20), nullable=True)
    account_holder_name = db.Column(db.String(100), nullable=True)
    bank_name = db.Column(db.String(100), nullable=True)
    branch_name = db.Column(db.String(100), nullable=True)
    ifsc_code = db.Column(db.String(20), nullable=True)
    role = db.Column(Enum('farmer', 'customer', 'admin', name='user_roles'), nullable=False)

    def as_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'contact': self.contact,
            'country': self.country,
            'state': self.state,
            'district': self.district,
            'taluk': self.taluk,
            'address': self.address,
            'pincode': self.pincode,
            'account_no': self.account_no,
            'account_holder_name': self.account_holder_name,
            'bank_name': self.bank_name,
            'branch_name': self.branch_name,
            'ifsc_code': self.ifsc_code,
            'role': self.role
        }

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    price = db.Column(db.Float, nullable=False)
    available = db.Column(db.Boolean, default=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    num_available = db.Column(db.Integer, nullable=True)
    quantity_available = db.Column(db.Float, nullable=True)
    unit = db.Column(db.String(10), nullable=True)

    def __repr__(self):
        return f"<Product(id={self.id}, name='{self.name}', price={self.price}, description='{self.description}', num_available={self.num_available}, quantity_available={self.quantity_available}, unit='{self.unit}', farmer_id={self.farmer_id})>"

    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'available': self.available,
            'farmer_id': self.farmer_id,
            'num_available': self.num_available,
            'quantity_available': self.quantity_available,
            'unit': self.unit
        }

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')

    product = db.relationship('Product', backref=db.backref('orders', lazy=True))

    def as_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'customer_id': self.customer_id,
            'quantity': self.quantity,
            'status': self.status,
            'product': self.product.as_dict() if self.product else None
        }

    def __repr__(self):
        return f'<Order {self.id}>'

class PurchaseRequest(db.Model):
    __tablename__ = 'purchase_requests'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    product_name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    customer_name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<PurchaseRequest {self.id}>'

    def as_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'status': self.status,
            'product_name': self.product_name,
            'price': self.price,
            'customer_name': self.customer_name
        }

class BillingReport(db.Model):
    __tablename__ = 'billing_reports'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    product_name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    customer_name = db.Column(db.String(80), nullable=False)
    details = db.Column(db.String, nullable=True)  # Add details field

    def __repr__(self):
        return f'<BillingReport {self.id}>'
    
    def as_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'status': self.status,
            'product_name': self.product_name,
            'price': self.price,
            'customer_name': self.customer_name,
            'details': self.details  # Ensure details field is included
        }
