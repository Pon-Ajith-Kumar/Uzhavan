from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:PONajith#2005@localhost/uzhavan_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = '5180db6812cb8827379272f2c7014b1b4fd90c4d533b2d95ee3ef43a062b0895'
app.config.from_object('config')

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
mail = Mail(app)

# Create tables
with app.app_context():
    db.create_all()

# Import routes after creating tables
from routes import *

if __name__ == '__main__':
    app.run(debug=True)
