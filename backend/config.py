import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:PONajith#2005@localhost/uzhavu_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = '5180db6812cb8827379272f2c7014b1b4fd90c4d533b2d95ee3ef43a062b0895'
