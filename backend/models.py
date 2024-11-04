from db_config import get_db_connection
import mysql.connector
from werkzeug.security import generate_password_hash

def create_user(username, password, role):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (username, password, role) VALUES (%s, %s, %s)', (username, password, role))
    conn.commit()
    cursor.close()
    conn.close()

def get_user_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
    user = cursor.fetchone()
    cursor.fetchall()  # Ensure all results are read (if any)
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
