from flask import Flask, Blueprint, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from .db_config import db
from .models import User, Product, Order, PurchaseRequest, BillingReport
from .routes import bp as main_bp
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

    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    # Enable CORS for all routes with specific origin
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    @app.after_request
    def after_request(response):
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        return response

    with app.app_context():
        db.create_all()

    app.register_blueprint(main_bp)

    return app
