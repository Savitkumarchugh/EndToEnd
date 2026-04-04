import { useEffect, useState } from "react";
import { TRAINERS_API } from "../config/api";

export default function TrainersHero() {
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
    const res = await fetch(TRAINERS_API.FETCH_CLIENTS);
    const data = await res.json();
    setClients(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClientDetails = async () => {
    if (!selectedClient) return alert("Select client");

    const res = await fetch(
      TRAINERS_API.FETCH_CLIENT_DETAILS(selectedClient),
    );
    const data = await res.json();

    setClientData(data);
  };

  // ---------------- FETCH EXERCISES ----------------
  const fetchExercises = async (name) => {
    const res = await fetch(
      TRAINERS_API.FETCH_CLIENT_EXERCISES(name),
    );
    const data = await res.json();
    setExerciseMap(data);
  };

  // ---------------- ADD CLIENT ----------------
  const handleAddClient = async (e) => {
    e.preventDefault();

    await fetch(TRAINERS_API.ADD_CLIENT, {
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


    await fetch(TRAINERS_API.HANDLE_CREATE_PLAN(planForm.name), {
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
      TRAINERS_API.HANDLE_ADD_PLAN(selectedClient),
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