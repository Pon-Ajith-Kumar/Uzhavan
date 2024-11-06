from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import db, User
from .db_config import get_db_connection

bp = Blueprint('main', __name__)

@bp.route('/')
def home():
    return 'Welcome to Uzhavu Agri Sales Management API!'

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

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role') # Get role from the request data
    
# Fetch the user based on username and role 
    user = User.query.filter_by(username=username, role=role).first()
    
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid Credentials'}), 401

    access_token = create_access_token(identity={'id': user.id, 'username': user.username, 'role': user.role})
    return jsonify(access_token=access_token), 200
