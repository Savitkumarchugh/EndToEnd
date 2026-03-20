import os
import certifi
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv


class GymDB:
    def __init__(self):
        load_dotenv()
        ca = certifi.where()

        mongo_uri = os.getenv("MONGODB_URI")
        self.client = MongoClient(mongo_uri, tlsCAFile=ca)

        self.db = self.client["gym"]
        self.collection = self.db["gym_users"]

    # ✅ Create User
    def create_user(self, user_data):
        user_data["End_Date"] = self.calculate_end_date(
            user_data["Start_Date"],
            user_data["Package_Period"]
        )

        self.collection.insert_one(user_data)
        print("✅ User inserted successfully")

    # ✅ Calculate End Date
    def calculate_end_date(self, start_date, package_period):
        start = datetime.strptime(start_date, "%Y-%m-%d")
        return (start + timedelta(days=package_period)).strftime("%Y-%m-%d")

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
    def get_user_by_name(self, name):
        user = self.collection.find_one({"Name": name}, {"_id": 0})

        if user:
            user["Days_Remaining"] = self.calculate_remaining_days(user["End_Date"])
            return user
        else:
            return "❌ User not found"

    # ✅ Delete User
    def delete_user(self, name):
        result = self.collection.delete_one({"Name": name})
        if result.deleted_count:
            print("✅ User deleted")
        else:
            print("❌ User not found")

    # ✅ Update User
    def update_user(self, name, update_data):
        if "Start_Date" in update_data or "Package_Period" in update_data:
            user = self.collection.find_one({"Name": name})
            if user:
                start_date = update_data.get("Start_Date", user["Start_Date"])
                package_period = update_data.get("Package_Period", user["Package_Period"])

                update_data["End_Date"] = self.calculate_end_date(
                    start_date, package_period
                )

        result = self.collection.update_one(
            {"Name": name},
            {"$set": update_data}
        )

        if result.modified_count:
            print("✅ User updated")
        else:
            print("❌ No changes made or user not found")





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