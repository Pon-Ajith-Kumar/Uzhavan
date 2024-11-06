from flask_sqlalchemy import SQLAlchemy
import mysql.connector

db = SQLAlchemy()

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='PONajith#2005',  # Use your actual password
        database='uzhavu_db'
    )
