from db_config import get_db_connection
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import smtplib
from email.mime.text import MIMEText
import uuid
import secrets

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'  # Ensure correct table name
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    price = db.Column(db.Float, nullable=False)
    available = db.Column(db.Boolean, default=True)  # Include the available field
    farmer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    num_available = db.Column(db.Integer, nullable=True)
    quantity_available = db.Column(db.Float, nullable=True)
    unit = db.Column(db.String(10), nullable=True)

    def __repr__(self):
        return f'<Product {self.name}>'
class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)  # Include the quantity field
    status = db.Column(db.String(20), nullable=False, default='pending')

    def __repr__(self):
        return f'<Order {self.id}>'

def is_id_unique(user_id):
    """Check if the generated ID is unique."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM users WHERE id = %s', (user_id,))
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return count == 0

def user_exists(username, role):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM users WHERE username = %s AND role = %s', (username, role))
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return count > 0

def is_password_unique(username, password):
    """Check if the password is unique for the given username."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT password FROM users WHERE username = %s', (username,))
    passwords = cursor.fetchall()
    cursor.close()
    conn.close()

    for pw in passwords:
        if check_password_hash(pw[0], password):
            return False
    return True

def is_username_role_unique(username, role):
    """Check if the username is unique for the given role."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM users WHERE username = %s AND role = %s', (username, role))
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return count == 0

def is_admin_username(username):
    """Check if the username is already used by an admin."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM users WHERE username = %s AND role = %s', (username, 'admin'))
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return count > 0

def create_user(username, password, role):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO users (username, password, role) VALUES (%s, %s, %s)', (username, password, role))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def get_user_by_username(username, role):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE username = %s AND role = %s', (username, role))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

def get_users_by_role(role):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, username, role FROM users WHERE role = %s', (role,))
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users


def update_user(user_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET username = %s, password = %s, role = %s WHERE id = %s', (data['username'], generate_password_hash(data['password']), data['role'], user_id))
    conn.commit()
    cursor.close()
    conn.close()

def get_user_profile(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

def create_product(name, price, description, farmer_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO products (name, price, description, farmer_id) VALUES (%s, %s, %s, %s)', (name, price, description, farmer_id))
    conn.commit()
    cursor.close()
    conn.close()

def get_products_by_farmer(farmer_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM products WHERE farmer_id = %s', (farmer_id,))
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return products

def get_all_products():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM products')
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return products

def get_all_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users

def delete_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Check the user's role
    user = get_user_by_id(user_id)
    if user['role'] == 'farmer':
        # Delete all orders associated with the farmer's products
        cursor.execute('SELECT id FROM products WHERE farmer_id = %s', (user_id,))
        products = cursor.fetchall()
        for product in products:
            cursor.execute('DELETE FROM orders WHERE product_id = %s', (product['id'],))
        # Delete all products by the farmer
        cursor.execute('DELETE FROM products WHERE farmer_id = %s', (user_id,))
    elif user['role'] == 'customer':
        # Delete all orders by the customer
        cursor.execute('DELETE FROM orders WHERE customer_id = %s', (user_id,))

    # Then delete the user
    cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
    conn.commit()
    cursor.close()
    conn.close()


def delete_product(product_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM products WHERE id = %s', (product_id,))
    conn.commit()
    cursor.close()
    conn.close()

def delete_all_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Delete all related orders first to avoid foreign key constraint issues
        cursor.execute('DELETE FROM orders')
        # Delete all related products next
        cursor.execute('DELETE FROM products')
        # Then delete all users
        cursor.execute('DELETE FROM users')
        # Reset the ID sequence for users, products, and orders
        cursor.execute('ALTER TABLE users AUTO_INCREMENT = 1')
        cursor.execute('ALTER TABLE products AUTO_INCREMENT = 1')
        cursor.execute('ALTER TABLE orders AUTO_INCREMENT = 1')
        conn.commit()
    except mysql.connector.errors.DatabaseError as e:
        if e.errno == 1205:  # Lock wait timeout exceeded
            print("Lock wait timeout exceeded; retrying transaction")
            delete_all_users()  # Retry the transaction
        else:
            raise
    finally:
        cursor.close()
        conn.close()

def create_order(product_id, customer_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO orders (product_id, customer_id, status) VALUES (%s, %s, %s)', (product_id, customer_id, 'pending'))
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.errors.DatabaseError as e:
        if e.errno == 1205:  # Lock wait timeout exceeded
            print("Lock wait timeout exceeded; retrying transaction")
            create_order(product_id, customer_id)  # Retry the transaction
        else:
            raise

def get_orders_by_customer(customer_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM orders WHERE customer_id = %s', (customer_id,))
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return orders

def get_orders_by_farmer(farmer_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT o.*, p.name as product_name FROM orders o JOIN products p ON o.product_id = p.id WHERE p.farmer_id = %s', (farmer_id,))
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return orders

def get_all_orders():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT o.*, p.name as product_name FROM orders o JOIN products p ON o.product_id = p.id')
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return orders

def update_order_status(order_id, status):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE orders SET status = %s WHERE id = %s', (status, order_id))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def get_billing_report():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT o.id AS order_id, o.status, p.name AS product_name, p.price, u.username AS customer_name 
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.customer_id = u.id
    ''')
    report = cursor.fetchall()
    cursor.close()
    conn.close()
    return report

def send_email_notification(to_email, subject, message):
    from_email = 'your-email@example.com'
    password = 'your-email-password'

    msg = MIMEText(message)
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email

    with smtplib.SMTP('smtp.example.com', 587) as server:
        server.starttls()
        server.login(from_email, password)
        server.sendmail(from_email, to_email, msg.as_string())

def notify_order_status_change(order_id, status):
    order = get_orders_by_customer(order_id)
    customer_email = get_user_by_id(order['customer_id'])['email']
    subject = f"Order #{order_id} Status Update"
    message = f"Your order status has been updated to '{status}'."
    send_email_notification(customer_email, subject, message)

def update_order_status(order_id, status):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE orders SET status = %s WHERE id = %s', (status, order_id))
        conn.commit()
        notify_order_status_change(order_id, status)
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def get_purchase_requests():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT o.id AS order_id, o.status, p.name AS product_name, p.price, u.username AS customer_name 
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.customer_id = u.id
        WHERE o.status = 'pending'
    ''')
    requests = cursor.fetchall()
    cursor.close()
    conn.close()
    return requests

def get_order_by_id(order_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM orders WHERE id = %s', (order_id,))
    order = cursor.fetchone()
    cursor.close()
    conn.close()
    return order

def accept_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE orders SET status = %s WHERE id = %s', ('accepted', order_id))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def reject_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE orders SET status = %s WHERE id = %s', ('rejected', order_id))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def get_products_by_farmer(farmer_id):
    return Product.query.filter_by(farmer_id=farmer_id).all()

def get_all_products():
    return Product.query.all()

def get_orders_by_customer(customer_id):
    return Order.query.filter_by(customer_id=customer_id).all()

def get_order_by_id(order_id):
    return Order.query.get(order_id)

def get_orders_by_farmer(farmer_id):
    products = Product.query.filter_by(farmer_id=farmer_id).all()
    product_ids = [product.id for product in products]
    return Order.query.filter(Order.product_id.in_(product_ids)).all()

def ship_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE orders SET status = %s WHERE id = %s', ('shipped', order_id))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def deliver_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE orders SET status = %s WHERE id = %s', ('delivered', order_id))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()