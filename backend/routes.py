from flask import request, jsonify
from flask_mail import Mail, Message
from models import db, User, Product, Order, create_user, get_user_by_username, create_product, get_products_by_farmer, get_all_products, create_order, get_orders_by_customer, get_orders_by_farmer, update_order_status, delete_all_users, get_all_users, get_user_by_id, update_user, get_user_profile, delete_user, get_all_orders, get_billing_report, get_purchase_requests, accept_order, reject_order, ship_order, deliver_order, get_users_by_role, is_password_unique, user_exists, is_username_role_unique, is_admin_username, get_order_by_id
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from db_config import get_db_connection 
import config
from app import app, db
from utils import send_email
    
@app.route('/')
def home():
    return 'Welcome to Uzhavan Agri Sales Management API!'

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    dob = data.get('dob')
    gender = data.get('gender')
    email = data.get('email')
    contact = data.get('contact')
    country = data.get('country')
    state = data.get('state')
    district = data.get('district')
    taluk = data.get('taluk')
    address = data.get('address')
    pincode = data.get('pincode')
    bank_name = data.get('bank_name')
    branch_name = data.get('branch_name')
    account_holder_name = data.get('account_holder_name')
    ifsc_code = data.get('ifsc_code')

    if not username or not password or not role or not dob or not gender or not email or not contact or not country or not state or not district or not address or not pincode or not bank_name or not branch_name or not account_holder_name or not ifsc_code:
        return jsonify({'message': 'All fields except taluk are required'}), 400

    if not is_username_role_unique(username, role):
        return jsonify({'message': 'Username already exists for this role. Please log in.'}), 400

    if role != 'admin' and is_admin_username(username):
        return jsonify({'message': 'Username already used by an admin. Please choose a different username.'}), 400

    if not is_password_unique(username, password):
        return jsonify({'message': 'Password already used for this username. Please choose a different password.'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(
        username=username,
        password=hashed_password,
        role=role,
        dob=dob,
        gender=gender,
        email=email,
        contact=contact,
        country=country,
        state=state,
        district=district,
        taluk=taluk,
        address=address,
        pincode=pincode,
        bank_name=bank_name,
        branch_name=branch_name,
        account_holder_name=account_holder_name,
        ifsc_code=ifsc_code
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({'message': 'Username, password, and role are required'}), 400

    user = get_user_by_username(username, role)
    if user and check_password_hash(user['password'], password):
        access_token = create_access_token(identity={'id': user['id'], 'username': user['username'], 'role': user['role']})
        return jsonify(access_token=access_token), 200

    return jsonify({'message': 'Invalid Credentials'}), 401

@app.route('/profile', methods=['GET'])
@jwt_required()
def view_profile():
    current_user = get_jwt_identity()
    user = get_user_by_id(current_user['id'])
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user.as_dict())

@app.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    data = request.get_json()
    user = get_user_by_id(current_user['id'])
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

@app.route('/change_password', methods=['PUT'])
@jwt_required()
def change_password():
    current_user = get_jwt_identity()
    data = request.get_json()
    user = get_user_by_id(current_user['id'])
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
@app.route('/admin/account', methods=['GET', 'PUT'])
@jwt_required()
def admin_account():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    if request.method == 'GET':
        user = get_user_by_id(current_user['id'])
        return jsonify({'user': user}), 200
    if request.method == 'PUT':
        data = request.get_json()
        update_user(current_user['id'], data)
        return jsonify({'message': 'Account updated successfully'}), 200

@app.route('/admin/users', methods=['GET'])
@jwt_required()
def view_all_users():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    users = get_all_users()
    return jsonify({'users': users}), 200

@app.route('/admin/users', methods=['DELETE'])
@jwt_required()
def delete_all_users_route():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    delete_all_users()
    return jsonify({'message': 'All users deleted and auto-increment reset successfully'}), 200

@app.route('/admin/delete_user', methods=['POST'])
@jwt_required()
def delete_user_route():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'message': 'User ID is required'}), 400
    delete_user(user_id)
    return jsonify({'message': f'User with id {user_id} deleted successfully'}), 200


@app.route('/admin/orders', methods=['GET'])
@jwt_required()
def view_all_orders():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    orders = get_all_orders()
    return jsonify({'orders': orders}), 200

@app.route('/admin/billing_report', methods=['GET'])
@jwt_required()
def billing_report():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    report = get_billing_report()
    return jsonify(report), 200

@app.route('/admin/purchase_requests', methods=['GET'])
@jwt_required()
def purchase_requests():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    requests = get_purchase_requests()
    return jsonify(requests), 200

@app.route('/admin/list_farmers', methods=['GET'])
@jwt_required()
def list_farmers():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    farmers = get_users_by_role('farmer')
    return jsonify(farmers), 200

@app.route('/admin/list_customers', methods=['GET'])
@jwt_required()
def list_customers():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    customers = get_users_by_role('customer')
    return jsonify(customers), 200

@app.route('/admin/list_admins', methods=['GET'])
@jwt_required()
def list_admins():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    admins = get_users_by_role('admin')
    return jsonify(admins), 200







# Farmer/Seller Routes
@app.route('/farmer/account', methods=['GET', 'PUT'])
@jwt_required()
def farmer_account():
    current_user = get_jwt_identity()
    if current_user['role'] != 'farmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    if request.method == 'GET':
        user = get_user_profile(current_user['id'])
        return jsonify({'user': user}), 200
    if request.method == 'PUT':
        data = request.get_json()
        update_user(current_user['id'], data)
        return jsonify({'message': 'Account updated successfully'}), 200

@app.route('/create_product', methods=['POST'])
@jwt_required()
def create_product_route():
    data = request.get_json()
    current_user = get_jwt_identity()

    farmer_id = current_user['id']

    name = data.get('name')
    price = data.get('price')
    description = data.get('description')
    num_available = data.get('num_available')
    quantity_available = data.get('quantity_available')
    unit = data.get('unit')

    if not num_available and not quantity_available:
        return jsonify({'message': 'You must provide either the number of products available or the quantity of products available.'}), 400

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

@app.route('/products/farmer', methods=['GET']) 
@jwt_required() 
def get_products_by_farmer_route(): 
	current_user = get_jwt_identity() 
	farmer_id = current_user['id'] 
	products = get_products_by_farmer(farmer_id) 
	return jsonify({'products': [product.as_dict() for product in products]}) 

@app.route('/products', methods=['GET']) 
@jwt_required() 
def get_all_products_route(): 
	products = get_all_products() 
	return jsonify({'products': [product.as_dict() for product in products]})

@app.route('/farmer/orders', methods=['GET'])
@jwt_required()
def view_orders_by_farmer():
    current_user = get_jwt_identity()
    if current_user['role'] != 'farmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    farmer_id = current_user['id']
    orders = get_orders_by_farmer(farmer_id)
    return jsonify({'orders': orders}), 200

@app.route('/farmer/accept_order', methods=['PUT'])
@jwt_required()
def accept_order_route():
    current_user = get_jwt_identity()
    if current_user['role'] != 'farmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    data = request.get_json()
    order_id = data.get('order_id')
    if not order_id:
        return jsonify({'message': 'Order ID is required'}), 400
    accept_order(order_id)
    return jsonify({'message': f'Order with ID {order_id} has been accepted'}), 200

@app.route('/farmer/reject_order', methods=['PUT'])
@jwt_required()
def reject_order_route():
    current_user = get_jwt_identity()
    if current_user['role'] != 'farmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    data = request.get_json()
    order_id = data.get('order_id')
    if not order_id:
        return jsonify({'message': 'Order ID is required'}), 400
    reject_order(order_id)
    return jsonify({'message': f'Order with ID {order_id} has been rejected'}), 200

@app.route('/farmer/ship_order', methods=['PUT']) 
@jwt_required() 
def ship_order_route(): 
    current_user = get_jwt_identity() 
    if current_user['role'] != 'farmer': 
        return jsonify({'message': 'Unauthorized access'}), 403 
    data = request.get_json() 
    order_id = data.get('order_id') 
    if not order_id: 
        return jsonify({'message': 'Order ID is required'}), 400 
    ship_order(order_id) 
    return jsonify({'message': f'Order with ID {order_id} has been shipped'}), 200

@app.route('/farmer/deliver_order', methods=['PUT'])
@jwt_required()
def deliver_order_route():
    current_user = get_jwt_identity()
    if current_user['role'] != 'farmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    data = request.get_json()
    order_id = data.get('order_id')
    if not order_id:
        return jsonify({'message': 'Order ID is required'}), 400
    deliver_order(order_id)
    return jsonify({'message': f'Order with ID {order_id} has been marked as delivered'}), 200


@app.route('/products/update', methods=['PUT'])
@jwt_required()
def update_product():
    data = request.get_json()
    product_id = data.get('id')
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # Exclude product_id from being updated 
    if 'id' in data and data['id'] != product_id: 
        return jsonify({'message': 'Product ID cannot be changed'}), 400

    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.available = data.get('available', product.available)
    db.session.commit()

    return jsonify({'message': 'Product updated successfully'})

@app.route('/products/delete', methods=['DELETE'])
@jwt_required()
def delete_product():
    data = request.get_json()
    product_id = data.get('id')
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'})

@app.route('/update_order_status', methods=['PUT'])
@jwt_required()
def update_order_status_route():
    data = request.get_json()
    order_id = data.get('order_id')
    new_status = data.get('new_status')

    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    order.status = new_status
    db.session.commit()

    customer = User.query.get(order.customer_id)
    Order.notify_order_status(order, customer)

    # Send email to customer
    send_email(
        subject="Order Status Updated",
        recipients=[customer.email],
        body=f"Your order with ID: {order.id} has been updated to {new_status}"
    )

    return jsonify({'message': 'Order status updated successfully'})




# Customer Routes
@app.route('/customer/account', methods=['GET', 'PUT'])
@jwt_required()
def customer_account():
    current_user = get_jwt_identity()
    if current_user['role'] != 'customer':
        return jsonify({'message': 'Unauthorized access'}), 403
    if request.method == 'GET':
        user = get_user_profile(current_user['id'])
        return jsonify({'user': user}), 200
    if request.method == 'PUT':
        data = request.get_json()
        update_user(current_user['id'], data)
        return jsonify({'message': 'Account updated successfully'}), 200

@app.route('/create_order', methods=['POST'])
@jwt_required()
def create_order_route():
    data = request.get_json()
    current_user = get_jwt_identity()
    customer_id = int(current_user['id'])
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    new_order = Order(
        product_id=product_id,
        customer_id=customer_id,
        quantity=quantity,
        status='pending'
    )
    db.session.add(new_order)
    db.session.commit()

    farmer = User.query.get(product_id)
    Order.notify_new_order(new_order, farmer)

    # Send email to farmer
    send_email(
        subject="New Order Created",
        recipients=[farmer.email],
        body=f"A new order has been created with ID: {new_order.id}"
    )

    return jsonify({'id': new_order.id, 'message': 'Order created successfully'}), 201




@app.route('/orders/status', methods=['POST'])
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

@app.route('/orders/cancel', methods=['POST'])
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

    if order.status in ['shipped', 'delivered']:
        return jsonify({'message': 'Cannot cancel an order that has been shipped or delivered'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE orders SET status = %s WHERE id = %s', ('cancelled', order_id))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

    return jsonify({'message': 'Order cancelled successfully'})

@app.route('/orders/customer', methods=['GET'])
@jwt_required()
def get_orders_by_customer_route():
    current_user = get_jwt_identity()
    customer_id = current_user['id']
    orders = get_orders_by_customer(customer_id)
    return jsonify({'orders': [order.as_dict() for order in orders]})

if __name__ == '__main__':
    app.run(debug=True)