from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, unset_jwt_cookies, get_jwt_identity
from flask_cors import CORS, cross_origin
from .models import db, User, Product, Order, PurchaseRequest, BillingReport
from .db_config import get_db_connection
import mysql.connector
import jwt

bp = Blueprint('main', __name__)

# General Routes
#Home
@bp.route('/')
def home():
    return 'Welcome to Uzhavu Agri Sales Management API!'

#Register
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

def create_user(username, hashed_password, role, email, contact, country, state, district, taluk, address, pincode, account_no, bank_name, branch_name, ifsc_code):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO users (username, password, role, email, contact, country, state, district, taluk, address, pincode, account_no, bank_name, branch_name, ifsc_code) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (username, hashed_password, role, email, contact, country, state, district, taluk, address, pincode, account_no, bank_name, branch_name, ifsc_code))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

@bp.route('/register', methods=['POST'])
@cross_origin(origins='http://localhost:3000')
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    contact = data.get('contact')
    country = data.get('country')
    state = data.get('state')
    district = data.get('district')
    taluk = data.get('taluk')
    address = data.get('address')
    pincode = data.get('pincode')
    account_no = data.get('account_no')
    bank_name = data.get('bank_name')
    branch_name = data.get('branch_name')
    ifsc_code = data.get('ifsc_code')
    role = data.get('role')

    if not all([username, password, email, role]):
        return jsonify({'message': 'Username, password, email, and role are required'}), 400

    # Check if the username is unique for the given role
    if not is_username_role_unique(username, role):
        return jsonify({'message': 'Username already exists for this role. Please log in.'}), 400

    # Check if the username is already used by an admin
    if role != 'admin' and is_admin_username(username):
        return jsonify({'message': 'Username already used by an admin. Please choose a different username.'}), 400

    # Check if the password is unique for the given username
    if not is_password_unique(username, password):
        return jsonify({'message': 'Password already used for this username. Please choose a different password.'}), 400

    # Hash the password before saving it
    hashed_password = generate_password_hash(password)
    create_user(username, hashed_password, role, email, contact, country, state, district, taluk, address, pincode, account_no, bank_name, branch_name, ifsc_code)

    return jsonify({'message': 'User registered successfully'}), 201

#Login
@bp.route('/login', methods=['POST'])
@cross_origin(origins='http://localhost:3000')
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')  # Get role from the request data
    
    # Fetch the user based on username and role
    user = User.query.filter_by(username=username, role=role).first()
    
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid Credentials'}), 401

    access_token = create_access_token(identity={'id': user.id, 'username': user.username, 'role': user.role})
    return jsonify(access_token=access_token, user={'role': user.role}), 200


# Logout route
@bp.route('/logout', methods=['POST'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def logout():
    response = jsonify({'message': 'Logged out successfully'})
    unset_jwt_cookies(response)
    return response, 200

# Profile and Password Management Routes
#View Profile
@bp.route('/profile', methods=['GET'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def view_profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user.as_dict())

#Update Profile 
@bp.route('/profile', methods=['PUT'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    data = request.get_json()
    user = User.query.get(current_user['id'])
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.username = data.get('username', user.username)
    user.contact = data.get('contact', user.contact)
    user.country = data.get('country', user.country)
    user.state = data.get('state', user.state)
    user.district = data.get('district', user.district)
    user.taluk = data.get('taluk', user.taluk)
    user.address = data.get('address', user.address)
    user.pincode = data.get('pincode', user.pincode)
    user.bank_name = data.get('bank_name', user.bank_name)
    user.branch_name = data.get('branch_name', user.branch_name)
    user.account_holder_name = data.get('account_holder_name', user.account_holder_name)
    user.ifsc_code = data.get('ifsc_code', user.ifsc_code)
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'})

#Change Password
@bp.route('/change_password', methods=['PUT'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def change_password():
    current_user = get_jwt_identity()
    data = request.get_json()

    user = User.query.get(current_user['id'])
    if not user:
        return jsonify({'message': 'User not found'}), 404

    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not check_password_hash(user.password, old_password):
        return jsonify({'message': 'Old password is incorrect'}), 400

    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({'message': 'Password changed successfully'})


# Admin Routes
#View all users / Delete all users
def get_all_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users

def delete_all_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM orders')
        cursor.execute('DELETE FROM products')
        cursor.execute('DELETE FROM users')
        cursor.execute('ALTER TABLE users AUTO_INCREMENT = 1')
        cursor.execute('ALTER TABLE products AUTO_INCREMENT = 1')
        cursor.execute('ALTER TABLE orders AUTO_INCREMENT = 1')
        conn.commit()
    except mysql.connector.errors.DatabaseError as e:
        if e.errno == 1205:
            print("Lock wait timeout exceeded; retrying transaction")
            delete_all_users()
        else:
            raise
    finally:
        cursor.close()
        conn.close()

@bp.route('/admin/users', methods=['GET', 'DELETE'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def manage_users():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    if request.method == 'GET':
        users = get_all_users()
        return jsonify({'users': users}), 200
    if request.method == 'DELETE':
        delete_all_users()
        return jsonify({'message': 'All users deleted and auto-increment reset successfully'}), 200

#Viewing and Deleting a Specific User
def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

def delete_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    user = get_user_by_id(user_id)
    if user['role'] == 'farmer':
        cursor.execute('SELECT id FROM products WHERE farmer_id = %s', (user_id,))
        products = cursor.fetchall()
        for product in products:
            cursor.execute('DELETE FROM orders WHERE product_id = %s', (product['id'],))
        cursor.execute('DELETE FROM products WHERE farmer_id = %s', (user_id,))
    elif user['role'] == 'customer':
        cursor.execute('DELETE FROM orders WHERE customer_id = %s', (user_id,))
    cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
    conn.commit()
    cursor.close()
    conn.close()

@bp.route('/admin/users/<int:user_id>', methods=['POST', 'DELETE'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def manage_user(user_id):
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403

    if request.method == 'POST':
        try:
            user = get_user_by_id(user_id)
            if not user:
                return jsonify({'message': 'User not found'}), 404
            return jsonify({'user': user}), 200
        except Exception as e:
            return jsonify({'message': 'Failed to fetch user details', 'error': str(e)}), 500

    if request.method == 'DELETE':
        try:
            delete_user(user_id)
            return jsonify({'message': f'User with id {user_id} deleted successfully'}), 200
        except Exception as e:
            return jsonify({'message': 'Failed to delete user', 'error': str(e)}), 500

#List Users by Role

def get_users_by_role(role):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, username, role FROM users WHERE role = %s', (role,))
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users

@bp.route('/admin/list/<string:role>', methods=['GET'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def list_users_by_role(role):
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    users = get_users_by_role(role)
    return jsonify(users), 200

#List All Products
def get_all_products():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM products')
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return products

@bp.route('/products/list', methods=['OPTIONS', 'GET'])
@cross_origin(origins='http://localhost:3000')
def get_all_products_route():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight request handled'})
        response.status_code = 204
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'GET,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        return response

    try:
        auth_header = request.headers.get('Authorization')
        if auth_header:
            token = auth_header.split(" ")[1]
            try:
                jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
                print("Valid token provided")
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired!'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid token!'}), 403
        else:
            print("No token provided, allowing public access")

        print("Fetching products from database...")
        products = get_all_products()
        print(f"Products fetched: {products}")

        return jsonify({'products': products}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 422

#List All Orders
def get_all_orders():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT o.*, p.name as product_name FROM orders o JOIN products p ON o.product_id = p.id')
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return orders

@bp.route('/admin/orders', methods=['GET'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def view_all_orders():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    orders = get_all_orders()
    return jsonify({'orders': orders}), 200

#List All Purchase Requestsq
def get_purchase_requests():
    requests = PurchaseRequest.query.all()
    return [request.as_dict() for request in requests]

@bp.route('/admin/purchase_requests', methods=['GET'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def purchase_requests():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    requests = get_purchase_requests()
    return jsonify(requests), 200

#List All Billing Reports
def get_billing_report():
    report = BillingReport.query.all()
    return [r.as_dict() for r in report]

@bp.route('/admin/billing_report', methods=['GET'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def billing_report():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    report = get_billing_report()
    return jsonify(report), 200


#Functionality has been integrated into the stored procedure
def update_related_status(order_id, new_status):
    # Update status in PurchaseRequest and BillingReport tables
    PurchaseRequest.query.filter_by(order_id=order_id).update({'status': new_status})
    BillingReport.query.filter_by(order_id=order_id).update({'status': new_status})
    db.session.commit()


# Farmer/Seller Routes
@bp.route('/create_product', methods=['OPTIONS', 'POST'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def create_product_route():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight request handled'})
        response.status_code = 204
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'POST,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        return response

    try:
        data = request.get_json()
        print("Received data:", data)

        current_user = get_jwt_identity()
        farmer_id = current_user['id']
        name = data.get('name')
        price = data.get('price')
        description = data.get('description')
        num_available = data.get('num_available') or None  # Handle empty string as None
        quantity_available = data.get('quantity_available') or None  # Handle empty string as None
        unit = data.get('unit')

        # Additional validations
        if not name:
            return jsonify({'message': 'Product name is required'}), 400
        if not price:
            return jsonify({'message': 'Product price is required'}), 400
        if not description:
            return jsonify({'message': 'Product description is required'}), 400

        if not num_available and not quantity_available:
            return jsonify({'message': 'You must provide either the number of products available or the quantity of products available.'}), 400

        if num_available is not None and unit:
            return jsonify({'message': 'Unit for no. of products available is not accepted.'}), 400

        if quantity_available is not None and not unit:
            return jsonify({'message': 'Unit must be provided if quantity available is specified.'}), 400
        
        if quantity_available is None:
            unit = None

        new_product = Product(
            name=name,
            price=price,
            description=description,
            farmer_id=farmer_id,
            num_available=num_available,
            quantity_available=quantity_available,
            unit=unit
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({'id': new_product.id, 'message': 'Product created successfully'}), 201
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 422

#View Products by Farmer
def get_products_by_farmer(farmer_id):
    products = Product.query.filter_by(farmer_id=farmer_id).all()
    return [product.as_dict() for product in products]

@bp.route('/products/farmer', methods=['GET'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def get_products_by_farmer_route():
    current_user = get_jwt_identity()
    farmer_id = current_user['id']
    products = Product.query.filter_by(farmer_id=farmer_id).all()
    return jsonify({'products': [product.as_dict() for product in products]}), 200

#View Orders by Farmer
def get_orders_by_farmer(farmer_id):
    products = Product.query.filter_by(farmer_id=farmer_id).all()
    product_ids = [product.id for product in products]
    orders = Order.query.filter(Order.product_id.in_(product_ids)).all()
    
    order_list = []
    for order in orders:
        product = Product.query.get(order.product_id)
        order_dict = order.as_dict()
        order_dict['product'] = product.as_dict()
        order_list.append(order_dict)
        
    return order_list

@bp.route('/farmer/orders', methods=['GET'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def view_orders_by_farmer():
    current_user = get_jwt_identity()
    if current_user['role'] != 'farmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    farmer_id = current_user['id']
    orders = get_orders_by_farmer(farmer_id)
    return jsonify({'orders': orders}), 200

#Update Product
@bp.route('/products/update', methods=['PUT'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def update_product():
    data = request.get_json()
    product_id = data.get('id')
    product = Product.query.get(product_id)
    current_user = get_jwt_identity()

    if not product:
        return jsonify({'message': 'Product not found'}), 404

    if product.farmer_id != current_user['id']:
        return jsonify({'message': 'Unauthorized: You can only update products you created'}), 403

    if 'id' in data and data['id'] != product_id:
        return jsonify({'message': 'Product ID cannot be changed'}), 400

    # Update fields
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)

    # Update num_available and quantity_available, ensure no conflict with unit
    num_available = data.get('num_available')
    quantity_available = data.get('quantity_available')
    unit = data.get('unit')

    if num_available is not None and unit is not None:
        return jsonify({'message': 'Unit for no. of products available is not accepted.'}), 400

    if quantity_available is not None and unit is None:
        return jsonify({'message': 'Unit must be provided if quantity available is specified.'}), 400

    if quantity_available is None:
        unit = None

    product.num_available = num_available if num_available is not None else product.num_available
    product.quantity_available = quantity_available if quantity_available is not None else product.quantity_available
    product.unit = unit if unit is not None else product.unit

    db.session.commit()
    return jsonify({'message': 'Product updated successfully'})

@bp.route('/products/delete', methods=['DELETE'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def delete_product():
    data = request.get_json()
    product_id = data.get('id')
    product = Product.query.get(product_id)
    current_user = get_jwt_identity()

    if not product:
        return jsonify({'message': 'Product not found'}), 404

    if product.farmer_id != current_user['id']:
        return jsonify({'message': 'Unauthorized: You can only delete products you created'}), 403

    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'})

#Accept Order
def accept_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('CALL accept_order(%s)', (order_id,))
        conn.commit()
        update_related_status(order_id, 'accepted')
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

@bp.route('/farmer/accept_order', methods=['PUT'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def accept_order_route():
    current_user = get_jwt_identity()
    if current_user['role'] != 'farmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    data = request.get_json()
    order_id = data.get('order_id')
    if not order_id:
        return jsonify({'message': 'Order ID is required'}), 400

    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404
    
    if order.status in ['cancelled', 'rejected', 'shipped', 'delivered']:
        return jsonify({'message': f'Order has been {order.status} and cannot be accepted'}), 400

    product = Product.query.get(order.product_id)
    if product.farmer_id != current_user['id']:
        return jsonify({'message': 'Unauthorized: You can only accept orders for your products'}), 403

    # Update the status in the orders table
    order.status = 'accepted'

    # Update the status in the billing_reports table
    billing_report = BillingReport.query.filter_by(order_id=order_id).first()
    if billing_report:
        billing_report.status = 'accepted'

    # Delete the purchase request from the purchase_requests table
    purchase_request = PurchaseRequest.query.filter_by(order_id=order_id).first()
    if purchase_request:
        db.session.delete(purchase_request)

    db.session.commit()

    return jsonify({'message': f'Order with ID {order_id} has been accepted'}), 200

#Reject Order
def reject_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('CALL reject_order(%s)', (order_id,))
        conn.commit()
        update_related_status(order_id, 'rejected')
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

@bp.route('/farmer/reject_order', methods=['PUT'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def reject_order_route():
    current_user = get_jwt_identity()
    if current_user['role'] != 'farmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    data = request.get_json()
    order_id = data.get('order_id')
    if not order_id:
        return jsonify({'message': 'Order ID is required'}), 400

    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    if order.status in ['cancelled', 'shipped', 'delivered', 'accepted']:
        return jsonify({'message': 'Order has been cancelled or rejected and cannot be rejected again'}), 400

    product = Product.query.get(order.product_id)
    if product.farmer_id != current_user['id']:
        return jsonify({'message': 'Unauthorized: You can only reject orders for your products'}), 403

    # Update the status in the orders table
    order.status = 'rejected'

    # Update the status in the billing_reports table
    billing_report = BillingReport.query.filter_by(order_id=order_id).first()
    if billing_report:
        billing_report.status = 'rejected'

    # Delete the purchase request from the purchase_requests table
    purchase_request = PurchaseRequest.query.filter_by(order_id=order_id).first()
    if purchase_request:
        db.session.delete(purchase_request)

    db.session.commit()

    return jsonify({'message': f'Order with ID {order_id} has been rejected'}), 200

#Ship Order
def ship_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE orders SET status = %s WHERE id = %s', ('shipped', order_id))
        conn.commit()
        update_related_status(order_id, 'shipped')
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

@bp.route('/farmer/ship_order', methods=['PUT'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def ship_order_route():
    current_user = get_jwt_identity()
    if current_user['role'] != 'farmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    data = request.get_json()
    order_id = data.get('order_id')
    if not order_id:
        return jsonify({'message': 'Order ID is required'}), 400

    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    if order.status in ['cancelled', 'rejected', 'delivered']:
        return jsonify({'message': f'Order has been {order.status} and cannot be shipped'}), 400

    product = Product.query.get(order.product_id)
    if product.farmer_id != current_user['id']:
        return jsonify({'message': 'Unauthorized: You can only ship orders for your products'}), 403

    # Update the status in the orders table
    order.status = 'shipped'

    # Update the status in the billing_reports table
    billing_report = BillingReport.query.filter_by(order_id=order_id).first()
    if billing_report:
        billing_report.status = 'shipped'

    # Delete the purchase request from the purchase_requests table
    purchase_request = PurchaseRequest.query.filter_by(order_id=order_id).first()
    if purchase_request:
        db.session.delete(purchase_request)

    db.session.commit()

    return jsonify({'message': f'Order with ID {order_id} has been shipped'}), 200

#Deliver Order
def deliver_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE orders SET status = %s WHERE id = %s', ('delivered', order_id))
        conn.commit()
        update_related_status(order_id, 'delivered')
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

@bp.route('/farmer/deliver_order', methods=['PUT'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def deliver_order_route():
    current_user = get_jwt_identity()
    if current_user['role'] != 'farmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    data = request.get_json()
    order_id = data.get('order_id')
    if not order_id:
        return jsonify({'message': 'Order ID is required'}), 400

    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    if order.status in ['cancelled', 'rejected']:
        return jsonify({'message': f'Order has been {order.status} and cannot be shipped'}), 400

    product = Product.query.get(order.product_id)
    if product.farmer_id != current_user['id']:
        return jsonify({'message': 'Unauthorized: You can only deliver orders for your products'}), 403

    # Update the status in the orders table
    order.status = 'delivered'

    # Update the status in the billing_reports table
    billing_report = BillingReport.query.filter_by(order_id=order_id).first()
    if billing_report:
        billing_report.status = 'delivered'

    # Delete the purchase request from the purchase_requests table
    purchase_request = PurchaseRequest.query.filter_by(order_id=order_id).first()
    if purchase_request:
        db.session.delete(purchase_request)

    db.session.commit()

    return jsonify({'message': f'Order with ID {order_id} has been marked as delivered'}), 200


# Customer Routes
#Create Order
@bp.route('/create_order', methods=['POST'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def create_order_route():
    data = request.get_json()
    current_user = get_jwt_identity()
    customer_id = int(current_user['id'])
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    # Fetch product and customer details
    product = Product.query.get(product_id)
    customer = User.query.get(customer_id)

    if not product:
        return jsonify({'message': 'Product not found'}), 404

    if product.num_available is not None:
        if quantity > product.num_available:
            return jsonify({'message': 'Quantity ordered exceeds number of products available'}), 400
    elif product.quantity_available is not None:
        if quantity > product.quantity_available:
            return jsonify({'message': 'Quantity ordered exceeds quantity of products available'}), 400

    new_order = Order(
        product_id=product_id,
        customer_id=customer_id,
        quantity=quantity,
        status='pending'
    )
    db.session.add(new_order)
    db.session.commit()

    # Create corresponding entries in purchase_requests and billing_reports
    new_purchase_request = PurchaseRequest(
        order_id=new_order.id,
        status='pending',
        product_name=product.name,
        price=product.price,
        customer_name=customer.username
    )
    new_billing_report = BillingReport(
        order_id=new_order.id,
        status='pending',
        product_name=product.name,
        price=product.price,
        customer_name=customer.username
    )
    db.session.add(new_purchase_request)
    db.session.add(new_billing_report)
    db.session.commit()

    return jsonify({'id': new_order.id, 'message': 'Order created successfully'}), 201

#View Order Status
def get_order_by_id(order_id):
    return Order.query.get(order_id)

@bp.route('/orders/status', methods=['POST'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def track_order_status():
    data = request.get_json()
    current_user = get_jwt_identity()
    order_id = data.get('order_id')

    if not order_id:
        return jsonify({'message': 'Order ID is required'}), 400

    order = get_order_by_id(order_id)

    if not order:
        return jsonify({'message': 'Order not found'}), 404

    if order.customer_id != current_user['id']:
        return jsonify({'message': 'Access denied'}), 403

    return jsonify({'order_status': order.status})

#Cancel Order
def call_update_status_procedure(order_id, new_status):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('CALL update_order_status(%s, %s)', (order_id, new_status))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

@bp.route('/orders/cancel', methods=['POST'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def cancel_order():
    data = request.get_json()
    current_user = get_jwt_identity()
    order_id = data.get('order_id')

    if not order_id:
        return jsonify({'message': 'Order ID is required'}), 400

    order = get_order_by_id(order_id)

    if not order:
        return jsonify({'message': 'Order not found'}), 404

    if order.customer_id != current_user['id']:
        return jsonify({'message': 'Access denied'}), 403

    if order.status in ['shipped', 'delivered', 'rejected']:
        return jsonify({'message': f'Order has been {order.status} and cannot be cancelled'}), 400
    # Update the status in the purchase_requests table
    purchase_request = PurchaseRequest.query.filter_by(order_id=order_id).first()
    if purchase_request:
        purchase_request.status = 'cancelled'

    # Update the status in the orders table
    order.status = 'cancelled'

    # Update the status in the billing_reports table
    billing_report = BillingReport.query.filter_by(order_id=order_id).first()
    if billing_report:
        billing_report.status = 'cancelled'

    # Delete the purchase request from the purchase_requests table
    db.session.delete(purchase_request)

    db.session.commit()

    return jsonify({'message': 'Order cancelled successfully'}), 200

#View Orders by Customer
def get_orders_by_customer(customer_id):
    return Order.query.filter_by(customer_id=customer_id).all()

@bp.route('/orders/customer', methods=['GET'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def get_orders_by_customer_route():
    current_user = get_jwt_identity()
    customer_id = current_user['id']
    orders = get_orders_by_customer(customer_id)
    return jsonify({'orders': [order.as_dict() for order in orders]})

@bp.route('/customer/purchase_requests', methods=['GET'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def view_purchase_requests():
    current_user = get_jwt_identity()
    username = current_user.get('username')
    if not username:
        return jsonify({'message': 'Username not found in token'}), 400
    purchase_requests = PurchaseRequest.query.filter_by(customer_name=username).all()
    return jsonify({'purchase_requests': [request.as_dict() for request in purchase_requests]}), 200

@bp.route('/customer/billing_reports', methods=['GET'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def view_billing_reports():
    current_user = get_jwt_identity()
    username = current_user.get('username')
    if not username:
        return jsonify({'message': 'Username not found in token'}), 400
    billing_reports = BillingReport.query.filter_by(customer_name=username).all()
    return jsonify({'billing_reports': [report.as_dict() for report in billing_reports]}), 200
