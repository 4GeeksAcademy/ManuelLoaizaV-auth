"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import re
import secrets

from datetime import timedelta

from flask import Flask, request, jsonify, send_from_directory
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
from flask_migrate import Migrate
from api.utils import InvalidAPIUsage, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')

app = Flask(__name__)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

app.url_map.strict_slashes = False

db_url = os.getenv("DATABASE_URL")

if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

setup_admin(app)
setup_commands(app)

app.register_blueprint(api, url_prefix='/api')

@app.errorhandler(InvalidAPIUsage)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

@app.route("/auth/login", methods=["POST"])
def login():
    credentials = request.json

    email = credentials.get("email")
    if email is None:
        raise InvalidAPIUsage("Missing email", 400)
    if not isinstance(email, str):
        raise InvalidAPIUsage("Email should be a string", 400)
    if re.fullmatch("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email) is None:
        raise InvalidAPIUsage("Invalid email", 400)
    
    candidate_password = credentials.get("password")
    if candidate_password is None:
        raise InvalidAPIUsage("Missing password", 400)
    if not isinstance(candidate_password, str):
        raise InvalidAPIUsage("Password should be a string", 400)
    if len(candidate_password) < 8:
        raise InvalidAPIUsage("Password should have at least 8 characters", 400)

    user = User.query.filter_by(email=email).one_or_none()
    if user is None:
        raise InvalidAPIUsage("User not found", 404)
    
    try:
        hashed_salted_password, salt = user.hashed_salted_password, user.salt
        salted_candidate_password = candidate_password + salt
        match = bcrypt.check_password_hash(
            hashed_salted_password,
            salted_candidate_password
        )
    except Exception as e:
        return { "message": str(e) }, 500

    if not match:
        raise InvalidAPIUsage("Unauthorized", status_code=401)
    
    access_token = create_access_token(
        identity=user.serialize(),
        fresh=False,
        expires_delta=timedelta(minutes=1)
    )
    return { "access_token": access_token }, 200

@app.route("/auth/signup", methods=["POST"])
def signup():
    signupForm = request.json

    email = signupForm.get("email")
    if email is None:
        raise InvalidAPIUsage("Missing email", 400)
    if not isinstance(email, str):
        raise InvalidAPIUsage("Email should be a string", 400)
    if re.fullmatch("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email) is None:
        raise InvalidAPIUsage("Invalid email", 400)
    
    candidate_password = signupForm.get("password")
    if candidate_password is None:
        raise InvalidAPIUsage("Missing password", 400)
    if not isinstance(candidate_password, str):
        raise InvalidAPIUsage("Password should be a string", 400)
    if len(candidate_password) < 8:
        raise InvalidAPIUsage("Password should have at least 8 characters", 400)

    first_name = signupForm.get("first_name")
    if first_name is None:
        raise InvalidAPIUsage("Missing first name", 400)
    if not isinstance(first_name, str):
        raise InvalidAPIUsage("First name should be a string", 400)
    first_name = first_name.strip()
    if len(first_name) == 0:
        raise InvalidAPIUsage("First name should be non-empty", 400)
    
    last_name = signupForm.get("last_name")
    if last_name is None:
        raise InvalidAPIUsage("Missing last name", 400)
    if not isinstance(last_name, str):
        raise InvalidAPIUsage("Last name should be a string", 400)
    last_name = last_name.strip()
    if len(last_name) == 0:
        raise InvalidAPIUsage("Last name should be non-empty", 400)

    existing_user = User.query.filter_by(email=email).one_or_none()
    if existing_user is not None:
        raise InvalidAPIUsage("User already exists", 409)
    
    salt = secrets.token_hex(16)
    salted_password = candidate_password + salt
    hashed_salted_password = bcrypt.generate_password_hash(salted_password).decode("utf-8")

    try:
        new_user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            hashed_salted_password=hashed_salted_password,
            salt=salt
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user.serialize(), 201
    except Exception as e:
        return { "message": str(e) }, 500

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
