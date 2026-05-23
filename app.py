from flask import Flask, request, jsonify
from connection import GymDB, TrainerDB, AuthDB
from flask_cors import CORS
import datetime
from datetime import datetime, timedelta
from email_service import send_member_email
from dotenv import load_dotenv



app = Flask(__name__)
CORS(app)

db = GymDB()
trainer_db = TrainerDB()
auth_db = AuthDB()

load_dotenv()



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

        required_fields = [
        "Name",
        "Package_Period",
        "Start_Date",
        "Amount_Paid",
        "Phone_Number",
        "Gender",
        "Email"
        ]

        valid_genders = ["Male", "Female", "Rather Not Say"]

        if data["Gender"] not in valid_genders:
            return jsonify({"error": "Invalid gender value"}), 400
        
        for field in required_fields:
            if field not in data or data[field] == "":
                return jsonify({"error": f"{field} is required"}), 400

        # ✅ CHECK DUPLICATE PHONE
        existing_user = db.get_user_by_phone(data["Phone_Number"])
        if existing_user:
            return jsonify({"error": "Phone number already exists"}), 400

        db.create_user(data)

        if data.get("Email"):

            end_date = db.calculate_end_date(
                data["Start_Date"],
                data["Package_Period"]
            )

            print("Sending email to:", data["Email"])

            send_member_email(
                data["Email"],
                data["Name"],
                end_date
            )

            print("Email function executed")

        return jsonify({"message": "✅ User created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# @app.route("/payments/monthly", methods=["GET"])
# def get_monthly_revenue():
#     try:
#         year = int(request.args.get("year"))
#         month = int(request.args.get("month"))

#         total = sum(p.get("Amount_Paid", 0) for p in db.payments.find({
#             "Year": year,
#             "Month": month
#         }))

#         return jsonify({
#             "total_revenue": total,
#             "count": db.payments.count_documents({
#                 "Year": year,
#                 "Month": month
#             })
#         }), 200

#     except Exception as e:
#         print("❌ Monthly Error:", str(e))
#         return jsonify({"error": str(e)}), 500
    
# @app.route("/payments/yearly", methods=["GET"])
# def get_yearly_revenue():
#     try:
#         year = int(request.args.get("year"))

#         total = sum(p.get("Amount_Paid", 0) for p in db.payments.find({
#             "Year": year
#         }))

#         return jsonify({
#             "total_revenue": total,
#             "count": db.payments.count_documents({
#                 "Year": year
#             })
#         }), 200

#     except Exception as e:
#         print("❌ Yearly Error:", str(e))
#         return jsonify({"error": str(e)}), 500
    
# @app.route("/payments/trend", methods=["GET"])
# def get_trend():
#     try:
#         now = datetime.now()
#         data = []

#         for i in range(5, -1, -1):
#             month = now.month - i
#             year = now.year

#             if month <= 0:
#                 month += 12
#                 year -= 1

#             total = sum(p.get("Amount_Paid", 0) for p in db.payments.find({
#                 "Year": year,
#                 "Month": month
#             }))

#             data.append({
#                 "month": f"{month}/{year}",
#                 "revenue": total
#             })

#         return jsonify(data), 200

#     except Exception as e:
#         print("❌ Trend Error:", str(e))
#         return jsonify({"error": str(e)}), 500

@app.route("/payments", methods=["GET"])
def get_payments():
    try:
        year = request.args.get("year")
        month = request.args.get("month")
        name = request.args.get("name")

        query = {}

        if year:
            query["Year"] = int(year)

        if month:
            query["Month"] = int(month)

        if name:
            query["Name"] = {"$regex": name, "$options": "i"}

        payments = list(db.payments.find(query, {"_id": 0}))

        return jsonify(payments), 200

    except Exception as e:
        print("❌ Payments API Error:", str(e))
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
@app.route("/users/<phone>", methods=["GET"])
def get_user(phone):
    user = db.get_user_by_phone_full(phone)

    if isinstance(user, str):
        return jsonify({"error": user}), 404

    return jsonify(user), 200


# -------------------------------
# UPDATE USER
# -------------------------------
# @app.route("/users/<name>", methods=["PUT"])
# def update_user(name):
#     try:
#         data = request.json

#         db.update_user(name, data)
#         return jsonify({"message": "✅ User updated successfully"}), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    
@app.route("/users/<phone>", methods=["PUT"])
def update_user(phone):
    data = request.json
    db.update_user(phone, data)
    return jsonify({"message": "✅ User updated successfully"}), 200

@app.route("/users/<phone>/renew", methods=["POST"])
def renew_user(phone):
    try:
        data = request.json

        required = ["Start_Date", "Package_Period", "Amount_Paid"]

        for field in required:
            if field not in data:
                return jsonify({"error": f"{field} required"}), 400

        db.renew_membership(phone, data)

        return jsonify({"message": "✅ Membership renewed"}), 200

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
    


@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json

        required = ["name", "email", "password", "role"]
        for field in required:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400

        result = auth_db.create_user(data)

        if "error" in result:
            return jsonify(result), 400

        return jsonify(result), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        result = auth_db.login_user(email, password)

        if "error" in result:
            return jsonify(result), 401

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# RUN APP
# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)