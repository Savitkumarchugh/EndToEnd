import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { MEMBERS_API } from "../config/api";
import { lazy, Suspense } from "react";


export default function MembersHero() {
  const [isRenewMode, setIsRenewMode] = useState(false);
  const [view, setView] = useState("all");
  const [users, setUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const RevenueChart = lazy(() => import("./RevenueChart"));

  // const [form, setForm] = useState({
  //   UserId: "",
  //   Name: "",
  //   Package_Period: "",
  //   Start_Date: "",
  //   Amount_Paid: "",
  //   Phone_Number: "",
  // });

  const [form, setForm] = useState({
    Name: "",
    Package_Period: "1",
    Start_Date: "",
    Amount_Paid: "",
    Phone_Number: "",
    Gender: "Male", // default
  });

  const [searchPhone, setSearchPhone] = useState("");
  const [filter, setFilter] = useState("all");

  // const [updateName, setUpdateName] = useState("");

  // const [updateForm, setUpdateForm] = useState({
  //   UserId: "",
  //   Name: "",
  //   Package_Period: "",
  //   Start_Date: "",
  //   Amount_Paid: "",
  //   Phone_Number: "",
  // });

  const calculateEndDate = (startDate, months) => {
    const daysMap = {
      1: 30,
      3: 90,
      6: 180,
      12: 365,
    };

    const days = daysMap[months];
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);

    return date.toISOString().split("T")[0];
  };

  const validateForm = () => {
    if (
      !form.Name ||
      !form.Start_Date ||
      !form.Amount_Paid ||
      !form.Phone_Number
    ) {
      alert("❌ All fields are required");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(form.Phone_Number)) {
      alert("❌ Enter valid 10-digit phone number");
      return false;
    }

    if (form.Amount_Paid <= 0) {
      alert("❌ Amount must be greater than 0");
      return false;
    }

    return true;
  };
  const filteredUsers = users.filter((user) => {
    const search = searchPhone.toLowerCase();

    const matchesSearch =
      user.Phone_Number.includes(search) ||
      user.Name.toLowerCase().includes(search);

    if (filter === "expired") return user.Days_Remaining < 0 && matchesSearch;

    if (filter === "today") return user.Days_Remaining === 0 && matchesSearch;

    if (filter === "soon")
      return (
        user.Days_Remaining >= 1 && user.Days_Remaining < 5 && matchesSearch
      );

    return matchesSearch;
  });

  // ---------------- FETCH ALL USERS ----------------
  const fetchUsers = async () => {
    try {
      const res = await fetch(MEMBERS_API.FETCH_ALL_USERS);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [payments, setPayments] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // ---------------- FETCH ----------------
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(MEMBERS_API.FETCH_PAYMENTS);
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ---------------- FILTER DATA ----------------
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (year && p.Year !== Number(year)) return false;
      if (month && p.Month !== Number(month)) return false;
      return true;
    });
  }, [payments, year, month]);

  // ---------------- SUMMARY ----------------
  const totalRevenue = useMemo(
    () => filteredPayments.reduce((sum, p) => sum + p.Amount_Paid, 0),
    [filteredPayments],
  );

  const totalTransactions = filteredPayments.length;

  const avgRevenue = totalTransactions
    ? Math.round(totalRevenue / totalTransactions)
    : 0;

  // ---------------- MONTHLY DATA ----------------
  const monthlyData = useMemo(() => {
    const map = Array(12).fill(0);

    filteredPayments.forEach((p) => {
      map[p.Month - 1] += p.Amount_Paid;
    });

    return map.map((amt, i) => ({
      month: i + 1,
      amount: amt,
    }));
  }, [filteredPayments]);

  // ---------------- GROWTH ----------------
  const growth = useMemo(() => {
    if (!month || month === 1) return null;

    const current = monthlyData[month - 1]?.amount || 0;
    const prev = monthlyData[month - 2]?.amount || 0;

    if (prev === 0) return null;

    return Math.round(((current - prev) / prev) * 100);
  }, [monthlyData, month]);

  // ---------------- BEST MONTH ----------------
  const bestMonth = useMemo(() => {
    return monthlyData.reduce((best, curr) =>
      curr.amount > best.amount ? curr : best,
    );
  }, [monthlyData]);

  // ---------------- DISPLAY DATA ----------------
  const displayData = month
    ? monthlyData.filter((m) => m.month === Number(month))
    : monthlyData;

  // ---------------- FETCH SINGLE USER ----------------

  // ---------------- ADD USER ----------------
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await fetch(MEMBERS_API.FETCH_ALL_USERS, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ...form,
  //         UserId: Number(form.UserId),
  //         Package_Period: Number(form.Package_Period),
  //         Amount_Paid: Number(form.Amount_Paid),
  //       }),
  //     });

  //     setView("all");
  //     fetchUsers();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const endDate = calculateEndDate(form.Start_Date, form.Package_Period);

    try {
      await fetch(MEMBERS_API.FETCH_ALL_USERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          Package_Period: Number(form.Package_Period),
          Amount_Paid: Number(form.Amount_Paid),
          End_Date: endDate,
        }),
      });

      // alert("✅ Member Added");
      setView("all");
      setForm({
        Name: "",
        Package_Period: "1",
        Start_Date: "",
        Amount_Paid: "",
        Phone_Number: "",
        Gender: "",
      });
      fetchUsers();
      fetchPayments();
    } catch (err) {
      alert("❌ Error adding member");
    }
  };

  // const handleUpdate = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const filteredData = Object.fromEntries(
  //       Object.entries(updateForm).filter(([_, v]) => v !== ""),
  //     );

  //     await fetch(MEMBERS_API.UPDATE_SINGLE_USER(updateName), {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ...filteredData,
  //         ...(filteredData.UserId && {
  //           UserId: Number(filteredData.UserId),
  //         }),
  //         ...(filteredData.Package_Period && {
  //           Package_Period: Number(filteredData.Package_Period),
  //         }),
  //         ...(filteredData.Amount_Paid && {
  //           Amount_Paid: Number(filteredData.Amount_Paid),
  //         }),
  //       }),
  //     });

  //     // alert("✅ User updated successfully");

  //     setUpdateForm({
  //       UserId: "",
  //       Name: "",
  //       Package_Period: "",
  //       Start_Date: "",
  //       Amount_Paid: "",
  //       Phone_Number: "",
  //     });

  //     // setUpdateName("");
  //     setView("all");
  //     fetchUsers();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <section className="flex flex-col md:flex-row items-start justify-between px-6 py-16 gap-10">
      {/* IMAGE LEFT */}
      <motion.img
        // src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f"
        src="/gym_images/hero_second.jpg"
        alt="gym"
        className="rounded-2xl w-full md:w-1/2 shadow-xl"
        initial={{ opacity: 0, x: -150 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* RIGHT PANEL */}
      <motion.div
        key={view} // 🔥 smooth transition on tab switch
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full md:w-1/2"
      >
        <h2 className="text-3xl font-bold mb-4">Members Panel</h2>

        {/* ---------------- BUTTONS (ACTIVE STATE) ---------------- */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {["all", "add", "revenue"].map((type) => (
            <button
              key={type}
              onClick={() => setView(type)}
              className={`w-full md:w-auto px-4 py-2 rounded-xl transition ${
                view === type
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {type === "all" && "View All"}
              {/* {type === "single" && "View One"} */}
              {type === "add" && "Add Member"}
              {/* {type === "renew" && "Renew Membership"} */}
              {type === "revenue" && "Total Revenue"}
              {/* {type === "update" && "Update Details"} */}
            </button>
          ))}
        </div>

        {/* ---------------- VIEW ALL ---------------- */}
        {/* {view === "all" && (
          <div className="space-y-3 max-h-[20rem] md:max-h-[27rem] overflow-y-auto pr-2">
            {users.length === 0 ? (
              <p className="text-gray-400 text-center">No data found</p>
            ) : (
              users.map((user, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl shadow transition ${
                    user.Days_Remaining < 0
                      ? "bg-red-900"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <h3 className="font-bold text-lg">{user.Name}</h3>
                  <p className="text-sm text-gray-300">
                    📞 {user.Phone_Number}
                  </p>
                  <p className="text-sm">📅 Ends: {user.End_Date}</p>
                  <p className="text-sm">
                    ⏳ Remaining: {user.Days_Remaining} days
                  </p>
                </div>
              ))
            )}
          </div>
        )} */}

        {view === "all" && (
          <div>
            {/* SEARCH */}
            <div className="relative mb-3">
              <input
                placeholder="Search by Name or Phone"
                className="p-2 bg-gray-800 w-full rounded pr-10"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />

              {/* CLEAR BUTTON */}
              {searchPhone && (
                <button
                  onClick={() => setSearchPhone("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ✖
                </button>
              )}
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex gap-2 mb-3">
              {["all", "expired", "soon", "today"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded ${
                    filter === f ? "bg-green-500" : "bg-gray-700"
                  }`}
                >
                  {f === "all" && "All"}
                  {f === "expired" && "Expired"}
                  {f === "soon" && "Expiring Soon"}
                  {f === "today" && "Expiring Today"}
                </button>
              ))}
            </div>

            {/* LIST */}
            <div className="space-y-3 max-h-[21rem] overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-gray-400 text-center">No members found</p>
              ) : (
                filteredUsers.map((user, i) => (
                  <div
                    key={i}
                    // className={`p-4 rounded-xl ${
                    //   user.Days_Remaining < 0
                    //     ? "bg-red-900"
                    //     : "bg-gray-800 hover:bg-gray-700"
                    // }`}
                    className={`p-4 rounded-xl ${
                      user.Days_Remaining < 0
                        ? "bg-red-900"
                        : user.Days_Remaining >= 0 && user.Days_Remaining < 5
                          ? "bg-[#ffffff] text-black"
                          : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    {/* TOP ROW */}
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">{user.Name}</h3>

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                        className="text-sm px-3 py-1 rounded hover:bg-green-500 hover:text-[#ffffff]"
                      >
                        Edit
                      </button>
                    </div>
                    {/* <h3 className="font-bold">{user.Name}</h3> */}
                    {/* <p>👤 {user.Gender}</p> */}
                    <p>📞 +91 {user.Phone_Number}</p>
                    <p>📅 Ends: {user.End_Date}</p>
                    <p>⏳ {user.Days_Remaining} days</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ---------------- VIEW SINGLE ---------------- */}
        {/* {view === "single" && (
          <div>
            <input
              placeholder="Enter Name"
              className="p-2 bg-gray-800 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />

            <button
              onClick={fetchSingleUser}
              className="bg-green-500 px-4 py-2 rounded mb-4 hover:bg-green-600 transition"
            >
              Search
            </button>

            {!singleUser ? (
              <p className="text-gray-400">No data found</p>
            ) : (
              <div
                className={`p-4 rounded-xl ${
                  singleUser.Days_Remaining < 0 ? "bg-red-900" : "bg-gray-800"
                }`}
              >
                <h3 className="font-bold text-lg">{singleUser.Name}</h3>
                <p>📞 {singleUser.Phone_Number}</p>
                <p>📅 {singleUser.End_Date}</p>
                <p>⏳ {singleUser.Days_Remaining} days</p>
              </div>
            )}
          </div>
        )} */}

        {/* ---------------- ADD MEMBER ---------------- */}
        {/* {view === "add" && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            {Object.keys(form).map((key) => (
              <input
                key={key}
                placeholder={key}
                className="p-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            ))}

            <button className="col-span-2 bg-green-500 p-2 rounded hover:bg-green-600 transition">
              Submit
            </button>
          </form>
        )} */}

        {view === "add" && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            <input
              placeholder="Name"
              className="p-2 bg-gray-800 rounded"
              value={form.Name}
              onChange={(e) => setForm({ ...form, Name: e.target.value })}
            />

            <select
              className="p-2 bg-gray-800 rounded"
              value={form.Gender}
              onChange={(e) => setForm({ ...form, Gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Rather Not Say">Rather Not Say</option>
            </select>

            {/* PHONE */}
            <div className="flex">
              <span className="bg-gray-700 px-2 flex items-center rounded-l">
                +91
              </span>
              <input
                placeholder="Phone Number"
                className="p-2 bg-gray-800 w-full rounded-r"
                value={form.Phone_Number}
                onChange={(e) =>
                  setForm({ ...form, Phone_Number: e.target.value })
                }
              />
            </div>

            {/* PACKAGE */}
            <select
              className="p-2 bg-gray-800 rounded"
              value={form.Package_Period}
              onChange={(e) =>
                setForm({ ...form, Package_Period: e.target.value })
              }
            >
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </select>

            {/* DATE PICKER */}
            <input
              type="date"
              className="p-2 bg-gray-800 rounded"
              value={form.Start_Date}
              onChange={(e) => setForm({ ...form, Start_Date: e.target.value })}
            />

            {/* AMOUNT */}
            <div className="flex">
              <span className="bg-gray-700 px-2 flex items-center rounded-l">
                ₹
              </span>
              <input
                placeholder="Amount Paid"
                className="p-2 bg-gray-800 w-full rounded-r"
                value={form.Amount_Paid}
                onChange={(e) =>
                  setForm({ ...form, Amount_Paid: e.target.value })
                }
              />
            </div>

            <button className="col-span-2 bg-green-500 p-2 rounded">
              Add Member
            </button>
          </form>
        )}

        {view === "revenue" && (
          <div
            className="bg-gray-900 p-4 md:p-6 rounded-2xl shadow-xl 
      max-h-[27rem] overflow-y-auto w-full"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">📊 Revenue Dashboard</h2>

              <button
                onClick={fetchPayments}
                className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-700"
              >
                🔄 Refresh
              </button>
            </div>

            {/* FILTERS */}
            <div className="flex gap-3 items-center mb-6 flex-wrap">
              <input
                type="number"
                className="p-2 bg-gray-800 rounded w-28"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />

              <select
                className="p-2 bg-gray-800 rounded"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Full Year</option>
                {monthNames.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* BEST MONTH */}
            {!month && bestMonth && bestMonth.amount > 0 && (
              <div className="mb-6 p-4 bg-green-900 rounded-xl">
                🏆 Best Month: {monthNames[bestMonth.month - 1]} (₹{" "}
                {bestMonth.amount})
              </div>
            )}

            {/* SUMMARY */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 pb-8">
              <div className="bg-gray-800 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold">₹ {totalRevenue}</h3>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Transactions</p>
                <h3 className="text-2xl font-bold">{totalTransactions}</h3>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Avg Revenue</p>
                <h3 className="text-2xl font-bold">₹ {avgRevenue}</h3>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Growth</p>
                <h3
                  className={`text-2xl font-bold ${
                    growth > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {growth !== null ? `${growth}%` : "--"}
                </h3>
              </div>
            </div>

            {/* CHART */}
            <div>
              <h3 className="mb-4 font-semibold text-lg">
                📅 Revenue Trend ({year})
              </h3>

              <div className="bg-gray-800 p-4 rounded-xl">
                <Suspense
                  fallback={
                    <div className="h-[300px] bg-gray-700 animate-pulse rounded-xl" />
                  }
                >
                  <RevenueChart data={displayData} monthNames={monthNames} />
                </Suspense>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- UPDATE MEMBER ---------------- */}
        {/* {view === "update" && (
          <div>
      
            <input
              placeholder="Enter Name to Update"
              className="p-2 bg-gray-800 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
            />

    
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-3">
              {Object.keys(updateForm).map((key) => (
                <input
                  key={key}
                  placeholder={`Update ${key}`}
                  className="p-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={updateForm[key]}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, [key]: e.target.value })
                  }
                />
              ))}

              <button className="col-span-2 bg-yellow-500 p-2 rounded hover:bg-yellow-600 transition">
                Update Member
              </button>
            </form>

            <p className="text-gray-400 text-sm mt-2">
              ⚠️ Only filled fields will be updated
            </p>
          </div>
        )} */}
      </motion.div>

      {/* ✅ MODAL GOES HERE */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-[90%] md:w-[400px]">
            <h2 className="text-xl font-bold mb-4">
              {isRenewMode ? "🔄 Renew Membership" : "Edit Member"}
            </h2>

            {/* NAME (LOCKED)*/}
            <input
              className="w-full mb-2 p-2 bg-gray-800 rounded cursor-not-allowed"
              value={selectedUser.Name}
              disabled
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, Name: e.target.value })
              }
            />

            {/* PHONE (LOCKED) */}
            <input
              className="w-full mb-2 p-2 bg-gray-700 rounded cursor-not-allowed"
              value={selectedUser.Phone_Number}
              disabled
            />

            {/* PACKAGE */}
            <select
              className="w-full mb-2 p-2 bg-gray-800 rounded"
              value={selectedUser.Package_Period}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  Package_Period: e.target.value,
                })
              }
            >
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </select>

            {/* START DATE */}
            <input
              type="date"
              className="w-full mb-2 p-2 bg-gray-800 rounded"
              value={selectedUser.Start_Date}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  Start_Date: e.target.value,
                })
              }
            />

            {/* AMOUNT */}
            <input
              className="w-full mb-4 p-2 bg-gray-800 rounded"
              value={selectedUser.Amount_Paid}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  Amount_Paid: e.target.value,
                })
              }
              placeholder="Amount"
            />

            {/* ACTION BUTTONS */}
            <div className="flex justify-between gap-2 flex-wrap">
              {/* CANCEL */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsRenewMode(false);
                }}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>

              {/* EDIT SAVE */}
              {!isRenewMode && (
                <button
                  onClick={async () => {
                    try {
                      await fetch(
                        // `http://127.0.0.1:5000/users/${selectedUser.Phone_Number}`,
                        MEMBERS_API.UPDATE_SINGLE_USER(selectedUser.Phone_Number),
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            ...selectedUser,
                            Package_Period: Number(selectedUser.Package_Period),
                            Amount_Paid: Number(selectedUser.Amount_Paid),
                          }),
                        },
                      );

                      setIsModalOpen(false);
                      fetchUsers();
                    } catch (err) {
                      alert("❌ Update failed");
                    }
                  }}
                  className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              )}

              {/* SWITCH TO RENEW */}
              {!isRenewMode && (
                <button
                  onClick={() => {
                    setIsRenewMode(true);

                    // 🔥 Auto set today's date
                    const today = new Date().toISOString().split("T")[0];

                    setSelectedUser({
                      ...selectedUser,
                      Start_Date: today,
                    });
                  }}
                  className="bg-[#ff0808] px-4 py-2 rounded hover:bg-[#c80808]"
                >
                  Renew
                </button>
              )}

              {/* CONFIRM RENEW */}
              {isRenewMode && (
                <button
                  onClick={async () => {
                    try {
                      await fetch(
                        // `http://127.0.0.1:5000/users/${selectedUser.Phone_Number}/renew`,
                        MEMBERS_API.RENEW_SINGLE_USER(selectedUser.Phone_Number),
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            Start_Date: selectedUser.Start_Date,
                            Package_Period: Number(selectedUser.Package_Period),
                            Amount_Paid: Number(selectedUser.Amount_Paid),
                          }),
                        },
                      );

                      setIsModalOpen(false);
                      setIsRenewMode(false);
                      fetchUsers();
                    } catch (err) {
                      alert("❌ Renewal failed");
                    }
                  }}
                  className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                >
                  Confirm Renew
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
