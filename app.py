from flask import Flask, request, jsonify
from connection import GymDB, TrainerDB
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

db = GymDB()
trainer_db = TrainerDB()


# -------------------------------
# HEALTH CHECK
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Gym API is running 🚀"})

# ------------------------------------------------ GYM Members Panel --------------------------
# -------------------------------
# CREATE USER
# -------------------------------
@app.route("/users", methods=["POST"])
def create_user():
    try:
        data = request.json

        required_fields = ["UserId", "Name", "Package_Period", "Start_Date", "Amount_Paid", "Phone_Number"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400

        db.create_user(data)
        return jsonify({"message": "✅ User created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# GET ALL USERS
# -------------------------------
@app.route("/users", methods=["GET"])
def get_all_users():
    try:
        users = db.get_all_users()
        return jsonify(users), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# GET SINGLE USER
# -------------------------------
@app.route("/users/<name>", methods=["GET"])
def get_user(name):
    try:
        user = db.get_user_by_name(name)

        if isinstance(user, str):
            return jsonify({"error": user}), 404

        return jsonify(user), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# UPDATE USER
# -------------------------------
@app.route("/users/<name>", methods=["PUT"])
def update_user(name):
    try:
        data = request.json

        db.update_user(name, data)
        return jsonify({"message": "✅ User updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# DELETE USER
# -------------------------------
@app.route("/users/<name>", methods=["DELETE"])
def delete_user(name):
    try:
        db.delete_user(name)
        return jsonify({"message": "✅ User deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# -------------------------------------------------- Trainers Panel ----------------

# ---------------- CREATE CLIENT ----------------
@app.route("/clients", methods=["POST"])
def create_client():
    try:
        data = request.json

        required = ["Name", "Age", "Package_Period", "Fitness_Goal", "Start_Date"]
        for field in required:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400

        trainer_db.create_client(data)
        return jsonify({"message": "✅ Client created"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- GET ALL CLIENTS ----------------
@app.route("/clients", methods=["GET"])
def get_clients():
    try:
        data = trainer_db.get_all_clients()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- GET SINGLE CLIENT ----------------
@app.route("/clients/<name>", methods=["GET"])
def get_client(name):
    try:
        data = trainer_db.get_client(name)

        if not data:
            return jsonify({"error": "Client not found"}), 404

        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- ADD WORKOUT PLAN ----------------
@app.route("/clients/<name>/plan", methods=["POST"])
def add_plan(name):
    try:
        data = request.json
        trainer_db.add_workout_plan(name, data)
        return jsonify({"message": "✅ Plan added"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- GET EXERCISES ----------------
@app.route("/clients/<name>/exercises", methods=["GET"])
def get_exercises(name):
    try:
        data = trainer_db.get_exercises(name)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- ADD WORKOUT LOG ----------------
@app.route("/clients/<name>/workout", methods=["POST"])
def add_workout(name):
    try:
        data = request.json

        # ✅ NEW VALIDATION
        if "date" not in data or "body_parts" not in data:
            return jsonify({"error": "date and body_parts are required"}), 400

        trainer_db.add_workout_log(name, data)

        return jsonify({"message": "✅ Workout added"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# RUN APP
# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)