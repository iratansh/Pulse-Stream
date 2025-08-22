from flask import Blueprint, request, jsonify
from supaBase.auth import login_user, register_user, logout_user
from flask_cors import CORS

auth_bp = Blueprint("auth_bp", __name__)
CORS(auth_bp)

@auth_bp.post('/login')
def login():
    data = request.json
    email_name = data.get("email")
    password = data.get("password")
    if not email_name or not password:
        return jsonify({"error": "Email and password are required"}), 400
    try:
        response = login_user(email_name, password)
        if "error" in response:
            return jsonify({"error": response["error"]}), 400
        return jsonify({"success": response["success"], "session": response["session"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.post('/register')
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("first_name")
    if not email or not password or not first_name:
        return jsonify({"error": "All fields are required"}), 400
    try:
        response = register_user(email, password, first_name)
        if "error" in response:
            return jsonify({"error": response["error"]}), 400
        return jsonify({"success": response["success"], "session": response["session"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.post('/logout')
def logout():
    try:
        response = logout_user()
        if "error" in response:
            return jsonify({"error": response["error"]}), 400
        return jsonify({"success": True, "message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500