
import os
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from dotenv import load_dotenv
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import URL, text
from werkzeug.security import generate_password_hash, check_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

app = Flask(__name__)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is missing from backend/.env")

TOKEN_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_MINUTES", "60"))

CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173"
    ]}}
)

database_url = URL.create(
    drivername="mysql+pymysql",
    username=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT", "3306")),
    database=os.getenv("DB_NAME")
)

ssl_ca = os.path.join(
    BASE_DIR,
    os.getenv("DB_SSL_CA", "aiven-ca.pem")
)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "connect_args": {"ssl": {"ca": ssl_ca}}
}

db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="user")

    def public_data(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role
        }


def create_token(user):
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.id),
        "iat": now,
        "exp": now + timedelta(minutes=TOKEN_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")


def token_required(admin_only=False):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            header = request.headers.get("Authorization", "")
            parts = header.split()

            if len(parts) != 2 or parts[0].lower() != "bearer":
                return jsonify({"error": "Authentication token required"}), 401

            try:
                payload = jwt.decode(
                    parts[1],
                    JWT_SECRET_KEY,
                    algorithms=["HS256"]
                )
                user_id = int(payload["sub"])
            except (jwt.InvalidTokenError, ValueError, KeyError, TypeError):
                return jsonify({"error": "Invalid or expired token"}), 401

            user = db.session.get(User, user_id)
            if not user:
                return jsonify({"error": "User account not found"}), 401

            if admin_only and user.role != "admin":
                return jsonify({"error": "Administrator access required"}), 403

            g.current_user = user
            return function(*args, **kwargs)

        return wrapper
    return decorator
class RewardBalance(db.Model):
    __tablename__ = "reward_balances"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    ve_balance = db.Column(db.Integer, nullable=False, default=2450)
    sve_balance = db.Column(db.Integer, nullable=False, default=850)
    gems = db.Column(db.Integer, nullable=False, default=1280)
    tokens = db.Column(db.Integer, nullable=False, default=560)

    def public_data(self):
        return {
            "ve_balance": self.ve_balance,
            "sve_balance": self.sve_balance,
            "gems": self.gems,
            "tokens": self.tokens
        }
class RewardActivity(db.Model):
    __tablename__ = "reward_activities"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    title = db.Column(db.String(150), nullable=False)
    detail = db.Column(db.String(150), nullable=False)
    amount = db.Column(db.String(50), nullable=False)
    icon = db.Column(db.String(30), nullable=False)
    status = db.Column(db.String(30), nullable=False, default="Completed")

    def public_data(self):
        return {
            "id": self.id,
            "title": self.title,
            "detail": self.detail,
            "amount": self.amount,
            "icon": self.icon,
            "status": self.status
        }
@app.route("/reward-activity", methods=["GET"])
@token_required()
def get_reward_activity():
    try:
        activities = RewardActivity.query.filter_by(
            user_id=g.current_user.id
        ).order_by(RewardActivity.id.asc()).all()

        # Add initial sample activities for a new user
        if not activities:
            sample_activities = [
                RewardActivity(
                    user_id=g.current_user.id,
                    title="Daily login reward",
                    detail="Today · 9:30 AM",
                    amount="+25 XP",
                    icon="zap",
                    status="Completed"
                ),
                RewardActivity(
                    user_id=g.current_user.id,
                    title="Achievement unlocked",
                    detail="Yesterday · 4:15 PM",
                    amount="+50 Gems",
                    icon="trophy",
                    status="Completed"
                ),
                RewardActivity(
                    user_id=g.current_user.id,
                    title="Referral joined",
                    detail="Yesterday · 11:20 AM",
                    amount="+100 XP",
                    icon="users",
                    status="Completed"
                )
            ]

            db.session.add_all(sample_activities)
            db.session.commit()

            activities = sample_activities

        return jsonify({
            "activities": [
                activity.public_data()
                for activity in activities
            ]
        }), 200

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to fetch reward activity")
        return jsonify({
            "error": "Could not fetch reward activity"
        }), 500
    
class Achievement(db.Model):
    __tablename__ = "achievements"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    progress = db.Column(db.Integer, nullable=False, default=0)
    target = db.Column(db.Integer, nullable=False, default=1)
    status = db.Column(db.String(30), nullable=False)
    icon = db.Column(db.String(30), nullable=False)

    def public_data(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "progress": self.progress,
            "target": self.target,
            "status": self.status,
            "icon": self.icon
        }

@app.route("/achievements", methods=["GET"])
@token_required()
def get_achievements():
    try:
        achievements = Achievement.query.filter_by(
            user_id=g.current_user.id
        ).order_by(Achievement.id.asc()).all()

        if not achievements:
            sample_achievements = [
                Achievement(
                    user_id=g.current_user.id,
                    title="Early Bird",
                    description="Logged in 7 days in a row",
                    progress=7,
                    target=7,
                    status="Completed",
                    icon="trophy"
                ),
                Achievement(
                    user_id=g.current_user.id,
                    title="Fast Learner",
                    description="Earned 500 XP",
                    progress=500,
                    target=500,
                    status="Completed",
                    icon="zap"
                ),
                Achievement(
                    user_id=g.current_user.id,
                    title="Team Player",
                    description="Invite 5 friends",
                    progress=3,
                    target=5,
                    status="In progress",
                    icon="users"
                ),
                Achievement(
                    user_id=g.current_user.id,
                    title="XP Champion",
                    description="Reach 2,000 XP",
                    progress=0,
                    target=2000,
                    status="In progress",
                    icon="star"
                )
            ]

            db.session.add_all(sample_achievements)
            db.session.commit()
            achievements = sample_achievements

        return jsonify({
            "achievements": [
                achievement.public_data()
                for achievement in achievements
            ]
        }), 200

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to fetch achievements")
        return jsonify({
            "error": "Could not fetch achievements"
        }), 500

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to VELoop User Profile API!",
        "status": "Backend is running successfully"
    }), 200


@app.route("/test-db", methods=["GET"])
def test_db():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"message": "MySQL connected successfully"}), 200
    except Exception:
        db.session.rollback()
        app.logger.exception("Database connection test failed")
        return jsonify({"error": "Database connection failed"}), 500


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "")
    email = data.get("email", "")
    password = data.get("password", "")

    if not all(isinstance(value, str) for value in (name, email, password)):
        return jsonify({"error": "Invalid input"}), 400

    name = name.strip()
    email = email.strip().lower()

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required"}), 400

    if len(name) > 100 or len(email) > 120:
        return jsonify({"error": "Name or email is too long"}), 400

    if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
        return jsonify({"error": "Enter a valid email address"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must contain at least 8 characters"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
        role="user"
    )

    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({
            "message": "Registration successful",
            "user": user.public_data()
        }), 201
    except Exception:
        db.session.rollback()
        app.logger.exception("Registration failed")
        return jsonify({"error": "Registration failed"}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email", "")
    password = data.get("password", "")

    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({"error": "Invalid input"}), 400

    user = User.query.filter_by(email=email.strip().lower()).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "token": create_token(user),
        "expires_in": TOKEN_MINUTES * 60,
        "user": user.public_data()
    }), 200


@app.route("/me", methods=["GET"])
@token_required()
def get_me():
    return jsonify({"user": g.current_user.public_data()}), 200


@app.route("/me", methods=["PUT"])
@token_required()
def update_me():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    email = data.get("email")

    if not isinstance(name, str) or not isinstance(email, str):
        return jsonify({"error": "Name and email are required"}), 400

    name = name.strip()
    email = email.strip().lower()

    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 400

    if len(name) > 100 or len(email) > 120:
        return jsonify({"error": "Name or email is too long"}), 400

    if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
        return jsonify({"error": "Enter a valid email address"}), 400

    existing = User.query.filter(
        User.email == email,
        User.id != g.current_user.id
    ).first()

    if existing:
        return jsonify({"error": "Email already registered"}), 409

    try:
        g.current_user.name = name
        g.current_user.email = email
        db.session.commit()
        return jsonify({
            "message": "Profile updated successfully",
            "user": g.current_user.public_data()
        }), 200
    except Exception:
        db.session.rollback()
        app.logger.exception("Profile update failed")
        return jsonify({"error": "Profile update failed"}), 500
@app.route("/rewards", methods=["GET"])
@token_required()
def get_rewards():
    try:
        rewards = RewardBalance.query.filter_by(
            user_id=g.current_user.id
        ).first()

        if not rewards:
            rewards = RewardBalance(user_id=g.current_user.id)
            db.session.add(rewards)
            db.session.commit()

        return jsonify({
            "rewards": rewards.public_data()
        }), 200

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to fetch rewards")
        return jsonify({"error": "Could not fetch rewards"}), 500

@app.route("/admin/check", methods=["GET"])
@token_required(admin_only=True)
def admin_check():
    return jsonify({
        "message": "Administrator access verified",
        "user": g.current_user.public_data()
    }), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(host="127.0.0.1", port=5000, debug=False)