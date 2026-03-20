import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function App() {
  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <MembersHero />
      <TrainersHero />
      <Features />
      <Footer />
    </div>
  );
}

// ---------------- NAVBAR ----------------
function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-md">
      <div className="flex items-center gap-2 text-xl font-bold">
        <Dumbbell /> A1 Fitness Series
      </div>
      <div className="hidden md:flex gap-6">
        <a href="#" className="hover:text-green-400">
          Home
        </a>
        <a href="#" className="hover:text-green-400">
          Services
        </a>
        <a href="#" className="hover:text-green-400">
          Membership
        </a>
        <a href="#" className="hover:text-green-400">
          Contact
        </a>
      </div>
      <button className="bg-green-500 px-4 py-2 rounded-xl hover:bg-green-600">
        Join Now
      </button>
    </nav>
  );
}

// ---------------- HERO ----------------
function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 py-16">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Transform Your Body
        </h1>
        <p className="mt-4 text-gray-400">
          Join A1 Fitness Series and achieve your dream physique with expert
          trainers and modern equipment.
        </p>
        <button className="mt-6 bg-green-500 px-6 py-3 rounded-xl text-lg hover:bg-green-600">
          Get Started
        </button>
      </motion.div>

      <motion.img
        // src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74"
        src="/gym_images/hero_first.jpg"
        alt="gym"
        className="rounded-2xl mt-10 md:mt-0 w-full md:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      />
    </section>
  );
}

// ---------------- HERO ----------------
function MembersHero() {
  const [view, setView] = useState("all");
  const [users, setUsers] = useState([]);
  const [singleUser, setSingleUser] = useState(null);
  const [searchName, setSearchName] = useState("");

  const [form, setForm] = useState({
    UserId: "",
    Name: "",
    Package_Period: "",
    Start_Date: "",
    Amount_Paid: "",
    Phone_Number: "",
  });

  const [updateName, setUpdateName] = useState("");

  const [updateForm, setUpdateForm] = useState({
    UserId: "",
    Name: "",
    Package_Period: "",
    Start_Date: "",
    Amount_Paid: "",
    Phone_Number: "",
  });

  // ---------------- FETCH ALL USERS ----------------
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://gym-2e9s.onrender.com/users");
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

  // ---------------- FETCH SINGLE USER ----------------
  const fetchSingleUser = async () => {
    try {
      const res = await fetch(
        `https://gym-2e9s.onrender.com/users/${searchName}`,
      );
      const data = await res.json();

      if (data.error) {
        setSingleUser(null);
      } else {
        setSingleUser(data);
      }
    } catch (err) {
      console.error(err);
      setSingleUser(null);
    }
  };

  // ---------------- ADD USER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("https://gym-2e9s.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          UserId: Number(form.UserId),
          Package_Period: Number(form.Package_Period),
          Amount_Paid: Number(form.Amount_Paid),
        }),
      });

      setView("all");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const filteredData = Object.fromEntries(
        Object.entries(updateForm).filter(([_, v]) => v !== ""),
      );

      await fetch(`https://gym-2e9s.onrender.com/users/${updateName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...filteredData,
          ...(filteredData.UserId && {
            UserId: Number(filteredData.UserId),
          }),
          ...(filteredData.Package_Period && {
            Package_Period: Number(filteredData.Package_Period),
          }),
          ...(filteredData.Amount_Paid && {
            Amount_Paid: Number(filteredData.Amount_Paid),
          }),
        }),
      });

      // alert("✅ User updated successfully");

      setUpdateForm({
        UserId: "",
        Name: "",
        Package_Period: "",
        Start_Date: "",
        Amount_Paid: "",
        Phone_Number: "",
      });

      setUpdateName("");
      setView("all");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

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
          {["all", "single", "add", "update"].map((type) => (
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
              {type === "single" && "View One"}
              {type === "add" && "Add Member"}
              {type === "update" && "Update Details"}
            </button>
          ))}
        </div>

        {/* ---------------- VIEW ALL ---------------- */}
        {view === "all" && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
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
        )}

        {/* ---------------- VIEW SINGLE ---------------- */}
        {view === "single" && (
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
        )}

        {/* ---------------- ADD MEMBER ---------------- */}
        {view === "add" && (
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
        )}

        {/* ---------------- UPDATE MEMBER ---------------- */}
        {view === "update" && (
          <div>
            {/* NAME INPUT */}
            <input
              placeholder="Enter Name to Update"
              className="p-2 bg-gray-800 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
            />

            {/* UPDATE FORM */}
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
        )}
      </motion.div>
    </section>
  );
}

function TrainersHero() {
  const [view, setView] = useState("clients");

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  const [exerciseMap, setExerciseMap] = useState({});

  const [clientData, setClientData] = useState(null);

  const [clientForm, setClientForm] = useState({
    Name: "",
    Age: "",
    Package_Period: "",
    Fitness_Goal: "",
    Start_Date: "",
  });

  // -------- CREATE PLAN STATE --------
  const [planForm, setPlanForm] = useState({
    name: "",
    bodyParts: [{ name: "", exercises: [""] }],
  });

  // -------- LOG WORKOUT STATE --------
  const [workoutForm, setWorkoutForm] = useState({
    date: "",
    bodyParts: [
      {
        name: "",
        exercises: [
          {
            name: "",
            sets: ["", "", ""],
          },
        ],
      },
    ],
  });

  const [selectedBodyPart, setSelectedBodyPart] = useState("");

  // ---------------- FETCH CLIENTS ----------------
  const fetchClients = async () => {
    const res = await fetch("https://gym-2e9s.onrender.com/clients");
    const data = await res.json();
    setClients(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClientDetails = async () => {
    if (!selectedClient) return alert("Select client");

    const res = await fetch(
      `https://gym-2e9s.onrender.com/clients/${selectedClient}`,
    );
    const data = await res.json();

    setClientData(data);
  };

  // ---------------- FETCH EXERCISES ----------------
  const fetchExercises = async (name) => {
    const res = await fetch(
      `https://gym-2e9s.onrender.com/clients/${name}/exercises`,
    );
    const data = await res.json();
    setExerciseMap(data);
  };

  // ---------------- ADD CLIENT ----------------
  const handleAddClient = async (e) => {
    e.preventDefault();

    await fetch("https://gym-2e9s.onrender.com/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...clientForm,
        Age: Number(clientForm.Age),
        Package_Period: Number(clientForm.Package_Period),
      }),
    });

    setView("clients");
    fetchClients();
  };

  // ---------------- CREATE PLAN ----------------
  const handleCreatePlan = async () => {
    const payload = {
      body_parts: planForm.bodyParts.map((bp) => ({
        name: bp.name,
        exercises: bp.exercises,
      })),
    };

    await fetch(`https://gym-2e9s.onrender.com/clients/${planForm.name}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("✅ Plan Created");
    setView("clients");
  };

  const addBodyPart = () => {
    setWorkoutForm({
      ...workoutForm,
      bodyParts: [
        ...workoutForm.bodyParts,
        { name: "", exercises: [{ name: "", sets: ["", "", ""] }] },
      ],
    });
  };

  const getLatestWorkout = () => {
    if (!selectedBodyPart || !clientData?.Workout_Log) return null;

    const filtered = clientData.Workout_Log.filter((log) =>
      log.body_parts.some((bp) => bp.name === selectedBodyPart),
    ).sort((a, b) => b.date.localeCompare(a.date));

    return filtered[0] || null;
  };

  const latestWorkout = getLatestWorkout();

  const addExercise = (bpIndex) => {
    const updated = [...workoutForm.bodyParts];
    updated[bpIndex].exercises.push({ name: "", sets: ["", "", ""] });
    setWorkoutForm({ ...workoutForm, bodyParts: updated });
  };

  // ---------------- LOG WORKOUT ----------------
  const handleAddWorkout = async () => {
    const payload = {
      date: workoutForm.date,
      body_parts: workoutForm.bodyParts.map((bp) => ({
        name: bp.name,
        exercises: bp.exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets.map((w, i) => ({
            set: i + 1,
            weight: Number(w),
          })),
        })),
      })),
    };

    await fetch(
      `https://gym-2e9s.onrender.com/clients/${selectedClient}/workout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    alert("✅ Full workout logged");
  };

  return (
    <section className="flex flex-col md:flex-row px-6 py-16 gap-10">
      {/* LEFT PANEL */}
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-bold mb-4">Trainer Panel</h2>

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {[
            "clients",
            "addClient",
            "createPlan",
            "logWorkout",
            "clientInfo",
          ].map((type) => (
            <button
              key={type}
              onClick={() => setView(type)}
              className={`px-4 py-2 rounded ${
                view === type ? "bg-green-500" : "bg-gray-800"
              }`}
            >
              {type === "clients" && "View Clients"}
              {type === "addClient" && "Add Client"}
              {type === "createPlan" && "Create Plan"}
              {type === "logWorkout" && "Log Workout"}
              {type === "clientInfo" && "Client Info"}
            </button>
          ))}
        </div>

        {/* ---------------- CLIENTS ---------------- */}
        {view === "clients" && (
          <div className="space-y-3">
            {clients.map((c, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-xl">
                <h3 className="font-bold">{c.Name}</h3>
                <p>🎯 {c.Fitness_Goal}</p>
                <p>🎂 {c.Age} yrs</p>
                <p>📅 Start: {c.Start_Date}</p>
                <p>🏁 End: {c.End_Date}</p>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- ADD CLIENT ---------------- */}
        {view === "addClient" && (
          <form onSubmit={handleAddClient} className="grid grid-cols-2 gap-3">
            {Object.keys(clientForm).map((key) => (
              <input
                key={key}
                placeholder={key}
                className="p-2 bg-gray-800 rounded"
                value={clientForm[key]}
                onChange={(e) =>
                  setClientForm({ ...clientForm, [key]: e.target.value })
                }
              />
            ))}
            <button className="col-span-2 bg-green-500 p-2 rounded">
              Add Client
            </button>
          </form>
        )}

        {/* ---------------- CREATE PLAN ---------------- */}
        {view === "createPlan" && (
          <div className="space-y-4">
            <input
              placeholder="Client Name"
              className="p-2 bg-gray-800 w-full"
              onChange={(e) =>
                setPlanForm({ ...planForm, name: e.target.value })
              }
            />

            {planForm.bodyParts.map((bp, bpIndex) => (
              <div key={bpIndex} className="bg-gray-800 p-3 rounded">
                <input
                  placeholder="Body Part"
                  className="p-2 w-full mb-2 bg-gray-700"
                  onChange={(e) => {
                    const updated = [...planForm.bodyParts];
                    updated[bpIndex].name = e.target.value;
                    setPlanForm({ ...planForm, bodyParts: updated });
                  }}
                />

                {bp.exercises.map((ex, exIndex) => (
                  <input
                    key={exIndex}
                    placeholder="Exercise"
                    className="p-2 w-full mb-2 bg-gray-600"
                    onChange={(e) => {
                      const updated = [...planForm.bodyParts];
                      updated[bpIndex].exercises[exIndex] = e.target.value;
                      setPlanForm({ ...planForm, bodyParts: updated });
                    }}
                  />
                ))}

                <button
                  onClick={() => {
                    const updated = [...planForm.bodyParts];
                    updated[bpIndex].exercises.push("");
                    setPlanForm({ ...planForm, bodyParts: updated });
                  }}
                  className="bg-blue-500 px-2 py-1 rounded"
                >
                  + Exercise
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setPlanForm({
                  ...planForm,
                  bodyParts: [
                    ...planForm.bodyParts,
                    { name: "", exercises: [""] },
                  ],
                })
              }
              className="bg-purple-500 px-3 py-2 rounded"
            >
              + Body Part
            </button>

            <button
              onClick={handleCreatePlan}
              className="bg-green-500 w-full p-2 rounded"
            >
              Save Plan
            </button>
          </div>
        )}

        {/* ---------------- LOG WORKOUT ---------------- */}
        {view === "logWorkout" && (
          <div className="space-y-4">
            {/* CLIENT */}
            <select
              className="p-2 bg-gray-800 w-full"
              onChange={(e) => {
                setSelectedClient(e.target.value);
                fetchExercises(e.target.value);
              }}
            >
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c.Name} value={c.Name}>
                  {c.Name}
                </option>
              ))}
            </select>

            {/* DATE */}
            <input
              type="date"
              className="p-2 bg-gray-800 w-full"
              onChange={(e) =>
                setWorkoutForm({ ...workoutForm, date: e.target.value })
              }
            />

            {/* BODY PARTS */}
            {workoutForm.bodyParts.map((bp, bpIndex) => (
              <div
                key={bpIndex}
                className="bg-gray-800 p-4 rounded-xl space-y-3"
              >
                {/* BODY PART SELECT */}
                <select
                  className="p-2 w-full bg-gray-700"
                  onChange={(e) => {
                    const updated = [...workoutForm.bodyParts];
                    updated[bpIndex].name = e.target.value;
                    setWorkoutForm({ ...workoutForm, bodyParts: updated });
                  }}
                >
                  <option>Select Body Part</option>
                  {exerciseMap.body_parts?.map((bp) => (
                    <option key={bp.name} value={bp.name}>
                      {bp.name}
                    </option>
                  ))}
                </select>

                {/* EXERCISES */}
                {bp.exercises.map((ex, exIndex) => (
                  <div
                    key={exIndex}
                    className="bg-gray-700 p-3 rounded space-y-2"
                  >
                    {/* EXERCISE SELECT */}
                    <select
                      className="p-2 w-full bg-gray-600"
                      onChange={(e) => {
                        const updated = [...workoutForm.bodyParts];
                        updated[bpIndex].exercises[exIndex].name =
                          e.target.value;
                        setWorkoutForm({ ...workoutForm, bodyParts: updated });
                      }}
                    >
                      <option>Select Exercise</option>
                      {(
                        exerciseMap.body_parts?.find((b) => b.name === bp.name)
                          ?.exercises || []
                      ).map((exName) => (
                        <option key={exName} value={exName}>
                          {exName}
                        </option>
                      ))}
                    </select>

                    {/* SETS */}
                    {ex.sets.map((_, setIndex) => (
                      <input
                        key={setIndex}
                        placeholder={`Set ${setIndex + 1}`}
                        className="p-2 w-full bg-gray-500"
                        onChange={(e) => {
                          const updated = [...workoutForm.bodyParts];
                          updated[bpIndex].exercises[exIndex].sets[setIndex] =
                            e.target.value;
                          setWorkoutForm({
                            ...workoutForm,
                            bodyParts: updated,
                          });
                        }}
                      />
                    ))}
                  </div>
                ))}

                <button
                  onClick={() => addExercise(bpIndex)}
                  className="bg-purple-500 px-3 py-1 rounded"
                >
                  + Add Exercise
                </button>
              </div>
            ))}

            <button
              onClick={addBodyPart}
              className="bg-indigo-500 px-4 py-2 rounded"
            >
              + Add Body Part
            </button>

            <button
              onClick={handleAddWorkout}
              className="bg-yellow-500 w-full p-2 rounded"
            >
              Submit Workout
            </button>
          </div>
        )}

        {view === "clientInfo" && (
          <div className="space-y-4">
            {/* SELECT CLIENT */}
            <select
              className="p-2 bg-gray-800 w-full"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c.Name} value={c.Name}>
                  {c.Name}
                </option>
              ))}
            </select>

            {/* DISPLAY DATA */}
            {clientData && (
              <div className="space-y-6 mt-4">
                {/* CLIENT INFO */}
                <div className="bg-gray-900 p-4 rounded-xl">
                  <h3 className="text-xl font-bold">{clientData.Name}</h3>
                  <p>🎯 Goal: {clientData.Fitness_Goal}</p>
                  <p>🎂 Age: {clientData.Age}</p>
                  <p>📅 Start: {clientData.Start_Date}</p>
                  <p>🏁 End: {clientData.End_Date}</p>
                </div>

                {/* WORKOUT PLAN */}
                {/* <div className="bg-gray-900 p-4 rounded-xl">
                  <h3 className="font-bold mb-2">📋 Workout Plan</h3>

                  {clientData.Workout_Plan?.body_parts?.map((bp, i) => (
                    <div key={i} className="mb-3">
                      <p className="font-semibold">{bp.name}</p>
                      <ul className="ml-4 list-disc">
                        {bp.exercises.map((ex, j) => (
                          <li key={j}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div> */}
              </div>
            )}

            <select
              className="p-2 bg-gray-800 w-full"
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
            >
              <option value="">Select Body Part</option>
              {clientData?.Workout_Plan?.body_parts?.map((bp) => (
                <option key={bp.name} value={bp.name}>
                  {bp.name}
                </option>
              ))}
            </select>

            {/* SEARCH BUTTON */}
            <button
              onClick={fetchClientDetails}
              className="bg-blue-500 w-full p-2 rounded"
            >
              🔍 Search Client
            </button>

            {/* WORKOUT LOG */}
            <div className="bg-gray-900 p-4 rounded-xl">
              <h3 className="font-bold mb-2">📊 Latest Workout</h3>

              {!selectedBodyPart && (
                <p className="text-gray-400">Select a body part</p>
              )}

              {selectedBodyPart && !latestWorkout && (
                <p className="text-gray-400">No workout found</p>
              )}

              {latestWorkout && (
                <div>
                  <p className="font-semibold">📅 {latestWorkout.date}</p>

                  {latestWorkout.body_parts
                    .filter((bp) => bp.name === selectedBodyPart)
                    .map((bp, i) => (
                      <div key={i} className="mt-3">
                        <p className="text-green-400">{bp.name}</p>

                        {bp.exercises.map((ex, j) => (
                          <div key={j} className="ml-3 mb-2">
                            <p>{ex.name}</p>

                            <div className="flex gap-3 text-sm text-gray-300">
                              {ex.sets.map((s, k) => (
                                <span key={k}>
                                  S{s.set}: {s.weight}kg
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* DISPLAY DATA */}
            {clientData && (
              <div className="space-y-6 mt-4">
                {/* CLIENT INFO */}
                {/* <div className="bg-gray-900 p-4 rounded-xl">
                  <h3 className="text-xl font-bold">{clientData.Name}</h3>
                  <p>🎯 Goal: {clientData.Fitness_Goal}</p>
                  <p>🎂 Age: {clientData.Age}</p>
                  <p>📅 Start: {clientData.Start_Date}</p>
                  <p>🏁 End: {clientData.End_Date}</p>
                </div> */}

                {/* WORKOUT PLAN */}
                <div className="bg-gray-900 p-4 rounded-xl">
                  <h3 className="font-bold mb-2">📋 Workout Plan</h3>

                  {clientData.Workout_Plan?.body_parts?.map((bp, i) => (
                    <div key={i} className="mb-3">
                      <p className="font-semibold">{bp.name}</p>
                      <ul className="ml-4 list-disc">
                        {bp.exercises.map((ex, j) => (
                          <li key={j}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* IMAGE */}
      <img
        src="/gym_images/hero_third.jpg"
        className="w-full md:w-1/2 rounded-2xl"
      />
    </section>
  );
}

// ---------------- FEATURES ----------------
function Features() {
  const items = [
    {
      title: "Strength Training",
      desc: "Heavy lifting and expert guidance to build muscle.",
    },
    {
      title: "Personal Training",
      desc: "Customized plans tailored to your fitness goals.",
    },
    {
      title: "Diet Planning",
      desc: "Nutrition plans for weight gain and fat loss.",
    },
  ];

  return (
    <section className="px-6 py-16 bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-400 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------- FOOTER ----------------
function Footer() {
  return (
    <footer className="bg-gray-900 px-6 py-10 mt-auto">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold text-lg">A1 Fitness Series</h3>
          <p className="text-gray-400 mt-2">Your transformation starts here.</p>
        </div>

        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="flex items-center gap-2 mt-2 text-gray-400">
            <Phone size={16} /> +91 9876543210
          </p>
          <p className="flex items-center gap-2 text-gray-400">
            <Mail size={16} /> support@a1fitness.com
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="text-gray-400 mt-2 space-y-1">
            <li>Home</li>
            <li>Services</li>
            <li>Membership</li>
          </ul>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-6">
        © 2026 A1 Fitness Series. All rights reserved.
      </p>
    </footer>
  );
}
