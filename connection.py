import os
import certifi
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash



class GymDB:
    def __init__(self):
        load_dotenv()
        ca = certifi.where()

        mongo_uri = os.getenv("MONGODB_URI")
        self.client = MongoClient(mongo_uri, tlsCAFile=ca)

        self.db = self.client["gym"]
        self.collection = self.db["gym_users"]

        self.payments = self.db["payments"]

    # ✅ Create User
    def create_user(self, user_data):
        try:
            # ✅ Type safety
            user_data["Package_Period"] = int(user_data["Package_Period"])
            user_data["Amount_Paid"] = int(user_data["Amount_Paid"])

            # ✅ End date
            user_data["End_Date"] = self.calculate_end_date(
                user_data["Start_Date"],
                user_data["Package_Period"]
            )

            now = datetime.now()
            user_data["Created_At"] = now

            # 🔥 TRANSACTION STARTS HERE
            with self.client.start_session() as session:
                with session.start_transaction():

                    # ✅ Insert user
                    self.collection.insert_one(user_data, session=session)

                    # ✅ Insert payment
                    self.add_payment(user_data, "New", session=session)

            print("User + Payment inserted safely")

        except Exception as e:
            print("Error:", str(e))
            raise

    # def add_payment(self, user_data, source="membership", session=None):
    #     now = datetime.now()

    #     payment = {
    #         "Name": user_data["Name"],
    #         "Phone_Number": user_data["Phone_Number"],
    #         "Gender": user_data["Gender"],
    #         "Amount_Paid": user_data["Amount_Paid"],

    #         "Payment_Date": now,
    #         "Year": now.year,
    #         "Month": now.month,
    #         "Day": now.day,

    #         "Package_Period": user_data["Package_Period"],
    #         "Source": source,
    #         "Created_At": now
    #     }

    #     if session:
    #         self.payments.insert_one(payment, session=session)
    #     else:
    #         self.payments.insert_one(payment)

    def add_payment(self, user_data, source="membership", session=None):
        now = datetime.now()

        payment = {
            "Name": user_data["Name"],
            "Phone_Number": user_data["Phone_Number"],
            "Gender": user_data.get("Gender", "Unknown"),
            "Amount_Paid": int(user_data["Amount_Paid"]),

            "Payment_Date": now,
            "Year": now.year,
            "Month": now.month,
            "Day": now.day,

            "Package_Period": int(user_data["Package_Period"]),
            "Source": source,  # "New" or "Renewal"
            "Created_At": now
        }

        if session:
            self.payments.insert_one(payment, session=session)
        else:
            self.payments.insert_one(payment)

    def get_user_by_phone(self, phone):
        return self.collection.find_one({"Phone_Number": phone}, {"_id": 0})

    # ✅ Calculate End Date
    def calculate_end_date(self, start_date, package_period):
        days_map = {
            1: 30,
            3: 90,
            6: 180,
            12: 365
        }

        package_period = int(package_period)  # 🔥 important

        start = datetime.strptime(start_date, "%Y-%m-%d")
        days = days_map.get(int(package_period), 30)

        return (start + timedelta(days=days)).strftime("%Y-%m-%d")

    # ✅ Calculate Remaining Days
    def calculate_remaining_days(self, end_date):
        today = datetime.today()
        end = datetime.strptime(end_date, "%Y-%m-%d")
        return (end - today).days

    # ✅ Get All Users
    def get_all_users(self):
        users = list(self.collection.find({}, {"_id": 0}))

        for user in users:
            user["Days_Remaining"] = self.calculate_remaining_days(user["End_Date"])

        return users
    
    # ✅ Get Single User by Name
    def get_user_by_phone_full(self, phone):
        user = self.collection.find_one({"Phone_Number": phone}, {"_id": 0})

        if user:
            user["Days_Remaining"] = self.calculate_remaining_days(user["End_Date"])
            return user
        else:
            return "❌ User not found"

    # ✅ Delete User
    def delete_user(self, phone):
        result = self.collection.delete_one({"Phone_Number": phone})

        if result.deleted_count:
            print("✅ User deleted")
        else:
            print("❌ User not found")

# ✅ Update User
    # def update_user(self, phone, update_data):
    #     user = self.collection.find_one({"Phone_Number": phone})

    #     if not user:
    #         print("❌ User not found")
    #         return

    #     # Get latest values (fallback to old if not provided)
    #     start_date = update_data.get("Start_Date", user["Start_Date"])
    #     package_period = int(update_data.get("Package_Period", user["Package_Period"]))

    #     # 🔥 ALWAYS recalculate End_Date
    #     update_data["End_Date"] = self.calculate_end_date(
    #         start_date, package_period
    #     )

    #     result = self.collection.update_one(
    #         {"Phone_Number": phone},
    #         {"$set": update_data}
    #     )

    #         # ✅ ADD PAYMENT IF AMOUNT EXISTS
    #     if "Amount_Paid" in update_data:
    #         self.add_payment({**user, **update_data}, "Renewal")

    #     if result.modified_count:
    #         print("✅ User updated")
    #     else:
    #         print("⚠️ No changes made")

    def update_user(self, phone, update_data):
        user = self.collection.find_one({"Phone_Number": phone})

        if not user:
            print("❌ User not found")
            return

        start_date = update_data.get("Start_Date", user["Start_Date"])
        package_period = int(update_data.get("Package_Period", user["Package_Period"]))

        # ✅ Recalculate End Date
        update_data["End_Date"] = self.calculate_end_date(
            start_date, package_period
        )

        result = self.collection.update_one(
            {"Phone_Number": phone},
            {"$set": update_data}
        )

        if result.modified_count:
            print("✅ User updated")
        else:
            print("⚠️ No changes made")

    def renew_membership(self, phone, update_data):
        user = self.collection.find_one({"Phone_Number": phone})

        if not user:
            print("❌ User not found")
            return

        # ✅ Extract values
        start_date = update_data.get("Start_Date")
        package_period = int(update_data.get("Package_Period"))
        amount_paid = int(update_data.get("Amount_Paid"))

        # ✅ Calculate new end date
        end_date = self.calculate_end_date(start_date, package_period)

        try:
            with self.client.start_session() as session:
                with session.start_transaction():

                    # 🔹 Update user
                    self.collection.update_one(
                        {"Phone_Number": phone},
                        {
                            "$set": {
                                "Start_Date": start_date,
                                "Package_Period": package_period,
                                "End_Date": end_date,
                                "Amount_Paid": amount_paid
                            }
                        },
                        session=session
                    )

                    # 🔹 Add payment entry
                    self.add_payment(
                        {
                            **user,
                            **update_data,
                            "Amount_Paid": amount_paid,
                            "Package_Period": package_period
                        },
                        source="Renewal",
                        session=session
                    )

            print("✅ Membership renewed + payment added")

        except Exception as e:
            print("❌ Renewal failed:", str(e))
            raise





class TrainerDB:
    def __init__(self):
        load_dotenv()
        ca = certifi.where()

        mongo_uri = os.getenv("MONGODB_URI")
        self.client = MongoClient(mongo_uri, tlsCAFile=ca)

        self.db = self.client["personal_trainers"]
        self.collection = self.db["clients"]

    # ---------------- CREATE CLIENT ----------------
    def create_client(self, data):
        data["Workout_Plan"] = {}   # { Chest: ["FBP", "IDP"] }
        data["Workout_Log"] = []    # logs per day

        start = datetime.strptime(data["Start_Date"], "%Y-%m-%d")
        data["End_Date"] = (
            start + timedelta(days=data["Package_Period"])
        ).strftime("%Y-%m-%d")

        self.collection.insert_one(data)

    # ---------------- ADD WORKOUT PLAN ----------------
    def add_workout_plan(self, name, plan_data):
        """
        plan_data example:
        {
          "Chest": ["Flat Bench Press", "Incline DB"],
          "Back": ["Lat Pulldown"]
        }
        """
        self.collection.update_one(
            {"Name": name},
            {"$set": {"Workout_Plan": plan_data}}
        )

    # ---------------- GET EXERCISES (IMPORTANT FOR UI) ----------------
    def get_exercises(self, name):
        client = self.collection.find_one({"Name": name})
        if not client:
            return {}
        return client.get("Workout_Plan", {})

    # ---------------- ADD WORKOUT LOG ----------------
    def add_workout_log(self, name, log_data):
        date = log_data["date"]
        body_parts = log_data["body_parts"]

        # Check if same date exists
        existing = self.collection.find_one({
            "Name": name,
            "Workout_Log.date": date
        })

        if existing:
            # ✅ append body parts to existing date
            self.collection.update_one(
                {
                    "Name": name,
                    "Workout_Log.date": date
                },
                {
                    "$push": {
                        "Workout_Log.$.body_parts": {
                            "$each": body_parts
                        }
                    }
                }
            )
        else:
            # ✅ create new date entry
            self.collection.update_one(
                {"Name": name},
                {
                    "$push": {
                        "Workout_Log": {
                            "date": date,
                            "body_parts": body_parts
                        }
                    }
                }
            )

    # ---------------- GET CLIENT ----------------
    def get_client(self, name):
        return self.collection.find_one({"Name": name}, {"_id": 0})

    # ---------------- GET ALL CLIENTS ----------------
    def get_all_clients(self):
        return list(self.collection.find({}, {"_id": 0}))




class AuthDB:
    def __init__(self):
        load_dotenv()
        ca = certifi.where()

        mongo_uri = os.getenv("MONGODB_URI")
        self.client = MongoClient(mongo_uri, tlsCAFile=ca)

        self.db = self.client["auth"]
        self.collection = self.db["users"]   # ✅ NEW COLLECTION

    # ---------------- SIGNUP ----------------
    def create_user(self, data):
        existing = self.collection.find_one({"email": data["email"]})

        if existing:
            return {"error": "User already exists"}

        user = {
            "name": data["name"],
            "email": data["email"],
            "password": generate_password_hash(data["password"]),  # 🔐 hash
            "role": data["role"],  # user / trainer / owner
            "created_at": datetime.utcnow()
        }

        self.collection.insert_one(user)

        return {"message": "User created successfully"}

    # ---------------- LOGIN ----------------
    def login_user(self, email, password):
        user = self.collection.find_one({"email": email})

        if not user:
            return {"error": "User not found"}

        if not check_password_hash(user["password"], password):
            return {"error": "Invalid password"}

        return {
            "message": "Login successful",
            "user": {
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }

    # ---------------- GET USER ----------------
    def get_user(self, email):
        return self.collection.find_one({"email": email}, {"_id": 0, "password": 0})