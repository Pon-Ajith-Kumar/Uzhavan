from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS # Import Flask-CORS
from .db_config import db
from .models import User, Product, Order, PurchaseRequest, BillingReport
from .routes import bp as main_bp  # Import the blueprint
import os 
from dotenv import load_dotenv

def create_app():
    app = Flask(__name__)

    # Load environment variables 
    load_dotenv()

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:PONajith#2005@localhost/uzhavu_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'e755bd96d6b556aff47002b6b95beeb3fe5ca114dfc71d88')

    db.init_app(app) 
    migrate = Migrate(app, db)
    jwt = JWTManager(app)
    # Enable CORS 
    CORS(app, resources={r"/register": {"origins": "http://localhost:3000"}})
    with app.app_context():
        db.create_all()  # Create database tables for our data models

    # Register the blueprint
    app.register_blueprint(main_bp)

    return app
