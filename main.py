from connection import GymDB

db = GymDB()


# -------------------------------
# 1. CREATE USERS
# -------------------------------

db.create_user({
    "UserId": 1,
    "Name": "Savit",
    "Package_Period": 90,
    "Start_Date": "2026-03-01",
    "Amount_Paid": 3000,
    "Phone_Number": "9876543210"
})
db.create_user({
    "UserId": 2,
    "Name": "Sneha",
    "Package_Period": 30,
    "Start_Date": "2026-02-01",
    "Amount_Paid": 3500,
    "Phone_Number": "8566997855"
})

db.create_user({
    "UserId": 3,
    "Name": "Rahul",
    "Package_Period": 60,
    "Start_Date": "2026-03-10",
    "Amount_Paid": 4200,
    "Phone_Number": "9999999999"
})


# -------------------------------
# 2. GET ALL USERS
# -------------------------------
print("\n📋 All Users:")
users = db.get_all_users()
for user in users:
    print(user)

# 3. GET SINGLE USER
# -------------------------------
print("\n🔍 Get Single User (Savit):")
print(db.get_user_by_name("Savit"))

# -------------------------------
# 4. UPDATE USER
# -------------------------------
print("\n✏️ Updating Savit's Package to 120 days...")
db.update_user("Savit", {
    "Package_Period": 120,
    "Amount_Paid": 4000
})


# -------------------------------
# 5. DELETE USER
# -------------------------------
print("\n🗑️ Deleting Rahul...")
db.delete_user("Rahul")

print("\n📋 Users after deletion:")
for user in db.get_all_users():
    print(user)

print("\n🔍 Updated User:")
print(db.get_user_by_name("Savit"))


# create_user() → Inserts user + auto calculates End_Date

# get_all_users() → Returns all users + Days_Remaining

# get_user_by_name(name) → Fetch single user

# update_user(name, data) → Updates + recalculates End_Date if needed

# delete_user(name) → Deletes user