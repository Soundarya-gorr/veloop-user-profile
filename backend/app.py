
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import URL, text
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()
CORS(app)

# Aiven MySQL database connection
database_url = URL.create(
    drivername="mysql+pymysql",
    username=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT")),
    database=os.getenv("DB_NAME")
)

ssl_ca = os.path.join(
    os.path.dirname(__file__),
    os.getenv("DB_SSL_CA", "aiven-ca.pem")
)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "connect_args": {
        "ssl": {
            "ca": ssl_ca
        }
    }
}

db = SQLAlchemy(app)


# User database model
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)


# Home API
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to VELoop User Profile API!",
        "status": "Backend is running successfully"
    }), 200


# Test database connection
@app.route("/test-db", methods=["GET"])
def test_db():
    try:
        db.session.execute(text("SELECT 1"))

        return jsonify({
            "message": "MySQL connected successfully!",
            "database": "veloop_db"
        }), 200

    except Exception:
        db.session.rollback()
        return jsonify({
            "error": "Database connection failed"
        }), 500


# User registration API
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({
            "error": "Name, email and password are required"
        }), 400

    if len(name) > 100 or len(email) > 120:
        return jsonify({"error": "Name or email is too long"}), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must contain at least 8 characters"
        }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    new_user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password)
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "User registered successfully!",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email
            }
        }), 201

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Registration failed"}), 500


# User login API
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    return jsonify({
        "message": "Login successful!",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }), 200


# Get user profile API
@app.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "message": "Profile retrieved successfully!",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }), 200


# Update user profile API
@app.route("/profile/<int:user_id>", methods=["PUT"])
def update_profile(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()

    if not name or not email:
        return jsonify({
            "error": "Name and email are required"
        }), 400

    if len(name) > 100 or len(email) > 120:
        return jsonify({"error": "Name or email is too long"}), 400

    existing_user = User.query.filter(
        User.email == email,
        User.id != user_id
    ).first()

    if existing_user:
        return jsonify({
            "error": "Email already registered"
        }), 409

    try:
        user.name = name
        user.email = email

        db.session.commit()

        return jsonify({
            "message": "Profile updated successfully!",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200

    except Exception:
        db.session.rollback()
        return jsonify({
            "error": "Profile update failed"
        }), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
