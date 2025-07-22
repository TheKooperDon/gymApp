const { useState, useEffect } = React;

function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "month", "week"
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    // Get logged-in user
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("currentUser"));
    } catch (e) {}
    setFirstName(user && user.firstName ? user.firstName : "");

    if (user && user.firstName) {
      const keys = Object.keys(localStorage).filter(key => key.startsWith("workout_"));
      keys.sort().reverse();
      const data = keys.map(key => {
        const date = key.replace("workout_", "");
        const workoutData = JSON.parse(localStorage.getItem(key));
        
        // Convert old date format (YYYY-MM-DD) to new format (MM/DD/YYYY)
        let newDate = date;
        if (date.includes('-')) {
          const [year, month, day] = date.split('-');
          newDate = `${month}/${day}/${year}`;
          
          // Update localStorage with new key
          localStorage.removeItem(key);
          localStorage.setItem(`workout_${newDate}`, JSON.stringify(workoutData));
        }
        
        return { date: newDate, workoutData };
      });
      setWorkouts(data);
    } else {
      setWorkouts([]);
    }
  }, []);

  // Add exerciseMap for workout type lookup
  const exerciseMap = {
    "Cable Fly": "Chest",
    "Cable Incline Chest Press": "Chest",
    "Chest Press Machine": "Chest",
    "Decline Bench Press": "Chest",
    "Dumbbell Bench Press": "Chest",
    "Dumbbell Chest Fly": "Chest",
    "Incline Bench Press": "Chest",
    "Incline Chest Press": "Chest",
    "Machine Incline Chest Press": "Chest",
    "Push Ups": "Chest",
    "Seated Bench Machine": "Chest",
    "Barbell Row": "Back",
    "Cable Reverse Fly": "Back",
    "Cable Row (Wide Grip)": "Back",
    "Chin Ups": "Back",
    "Lat Pull Down Close Grip": "Back",
    "Lat Pull Down Wide Grip": "Back",
    "Pull Ups": "Back",
    "Row Cable Close Grip": "Back",
    "Seated Row Machine": "Back",
    "T-Bar Row": "Back",
    "Arnold Press": "Shoulders",
    "Cable Lateral Raise": "Shoulders",
    "Dumbbell Shrugs": "Shoulders",
    "Front Raise": "Shoulders",
    "Lateral Raise": "Shoulders",
    "Pike Push Ups": "Shoulders",
    "Rear Delt Fly": "Shoulders",
    "Shoulder Press": "Shoulders",
    "Cable Reverse Curls": "Arms",
    "Cable Rope Overhead Tricep": "Arms",
    "Cable Single Arm Curls": "Arms",
    "Close Grip Push Ups": "Arms",
    "Dips": "Arms",
    "Hammer Curls": "Arms",
    "Incline Dumbbell Curls": "Arms",
    "Over Head Bar Tricep Extension": "Arms",
    "Preacher Curl Machine": "Arms",
    "Rope Bicep Curls": "Arms",
    "Single Arm Tricep": "Arms",
    "Tricep Rope Pushdown": "Arms",
    "Z Bar Curl": "Arms",
    "Barbell Box Squat": "Legs",
    "Barbell Front Squat": "Legs",
    "Barbell Glute Bridge": "Legs",
    "Barbell RDL": "Legs",
    "Cable Kick Backs": "Legs",
    "Cable Lateral Raises": "Legs",
    "Dumbbell Bulgarian Split Squat": "Legs",
    "Dumbbell Hamstring Curls": "Legs",
    "Dumbbell RDLs": "Legs",
    "Dumbbell Step Ups": "Legs",
    "Dumbbell Walking Lunges": "Legs",
    "Glute Kick Backs": "Legs",
    "Goblet Squat": "Legs",
    "Leg Press Machine": "Legs",
    "Resistance Band Glute Bridge": "Legs",
    "Resistance Band Kickbacks": "Legs",
    "Resistance Band Side Steps": "Legs",
    "Smith Machine Squat": "Legs",
    "Step Ups": "Legs",
    "Cable Woodchoppers": "Core",
    "Hanging Leg Raises": "Core",
    "Plank": "Core",
  };

  // Filter workouts based on selected filter
  function getFilteredWorkouts() {
    if (filter === "all") return workouts;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (filter === "week") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return workouts.filter(w => new Date(w.date) >= weekAgo);
    }
    
    if (filter === "month") {
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      return workouts.filter(w => new Date(w.date) >= monthAgo);
    }
    
    return workouts;
  }

  // Modal logic (same as profile page)
  function openEditModal(date, workoutData) {
    setEditingWorkout({ date, workoutData });
    setEditData(JSON.parse(JSON.stringify(workoutData)));
  }
  function closeEditModal() {
    setEditingWorkout(null);
    setEditData(null);
  }
  function handleEditChange(idx, field, value) {
    setEditData(prev => {
      const keys = Object.keys(prev);
      const key = keys[idx];
      return {
        ...prev,
        [key]: {
          ...prev[key],
          [field]: value
        }
      };
    });
  }
  function handleRemoveSet(idx) {
    setEditData(prev => {
      const keys = Object.keys(prev);
      const key = keys[idx];
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  }
  function handleAddSet() {
    setEditData(prev => {
      const newKey = `set${Date.now()}`;
      return {
        ...prev,
        [newKey]: { exercise: "", sets: 1, reps: 1, weight: 0 }
      };
    });
  }
  function handleEditSave() {
    localStorage.setItem(
      `workout_${editingWorkout.date}`,
      JSON.stringify(editData)
    );
    setWorkouts(ws =>
      ws.map(w =>
        w.date === editingWorkout.date
          ? { ...w, workoutData: editData }
          : w
      )
    );
    closeEditModal();
  }

  // For dropdowns
  const muscleGroups = Array.from(new Set(Object.values(exerciseMap)));
  function getExercisesForGroup(group) {
    return Object.entries(exerciseMap)
      .filter(([_, g]) => g === group)
      .map(([ex]) => ex);
  }
  function getGroupForExercise(exercise) {
    return exerciseMap[exercise] || "";
  }
  function handleEditGroupChange(idx, group) {
    setEditData(prev => {
      const keys = Object.keys(prev);
      const key = keys[idx];
      return {
        ...prev,
        [key]: {
          ...prev[key],
          group,
          exercise: ""
        }
      };
    });
  }
  function handleEditExerciseChange(idx, exercise) {
    setEditData(prev => {
      const keys = Object.keys(prev);
      const key = keys[idx];
      return {
        ...prev,
        [key]: {
          ...prev[key],
          exercise
        }
      };
    });
  }

  const filteredWorkouts = getFilteredWorkouts();

  return (
    <main className="flex-1 p-6 flex flex-col">
      {firstName ? (
        <>
          {/* Back Button */}
          <div className="flex justify-start mb-4">
            <a 
              href="profile.html" 
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Back to Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </a>
          </div>

          <div className="mb-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Workout History</h2>
            <p className="text-gray-600 mb-4">All your logged workouts</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 justify-center">
            <button
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                filter === "month" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("month")}
            >
              This Month
            </button>
            <button
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                filter === "week" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("week")}
            >
              This Week
            </button>
          </div>

          {/* Workout Count */}
          <div className="text-center mb-4">
            <p className="text-gray-600">
              Showing {filteredWorkouts.length} of {workouts.length} workouts
            </p>
          </div>

          {/* Workout List */}
          {filteredWorkouts.length === 0 ? (
            <div className="text-center mt-8">
              <p className="text-gray-600">
                {filter === "all" 
                  ? "No workouts logged yet" 
                  : `No workouts in the last ${filter === "week" ? "week" : "month"}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWorkouts.map(({ date, workoutData }, idx) => {
                let totalVolume = 0;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 shadow-md rounded-xl p-4 transition hover:shadow-lg relative"
                  >
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
                      title="Edit workout"
                      onClick={() => openEditModal(date, workoutData)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.789l-4 1 1-4 13.362-13.302z" />
                      </svg>
                    </button>
                    <h4 className="text-lg font-semibold text-blue-700 mb-2">Workout for {date}</h4>
                    <ul className="mb-2 space-y-1">
                      {Object.values(workoutData).map((entry, i) => {
                        const { exercise, weight, reps, sets } = entry;
                        const volume = weight * reps * sets;
                        totalVolume += volume;
                        return (
                          <li key={i} className="text-gray-800">
                            <span className="font-medium text-gray-900">{exercise}</span>:
                            <span className="ml-1">{sets} sets x {reps} reps @ {weight} lbs</span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-green-700 text-base">Total Volume:</span>
                      <span className="font-semibold text-gray-900 text-base">{totalVolume} lbs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Edit Modal (same as profile page) */}
          {editingWorkout && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                  onClick={closeEditModal}
                  title="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-xl font-bold mb-4">Edit Workout for {editingWorkout.date}</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleEditSave();
                  }}
                  className="space-y-4"
                >
                  {Object.entries(editData).map(([key, entry], i) => (
                    <div key={key} className="border-b pb-2 mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">Exercise {i + 1}</span>
                        <button
                          type="button"
                          className="text-xs text-red-500 hover:underline"
                          onClick={() => handleRemoveSet(i)}
                        >Remove</button>
                      </div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Body Type</label>
                      <select
                        className="w-full border rounded px-2 py-1 mb-1"
                        value={entry.group || getGroupForExercise(entry.exercise) || ""}
                        onChange={e => handleEditGroupChange(i, e.target.value)}
                        required
                      >
                        <option value="">Select body type</option>
                        {muscleGroups.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Exercise Name</label>
                      <select
                        className="w-full border rounded px-2 py-1 mb-1"
                        value={entry.exercise}
                        onChange={e => handleEditExerciseChange(i, e.target.value)}
                        required
                        disabled={!entry.group && !getGroupForExercise(entry.exercise)}
                      >
                        <option value="">Select exercise</option>
                        {(entry.group || getGroupForExercise(entry.exercise)) &&
                          getExercisesForGroup(entry.group || getGroupForExercise(entry.exercise)).map(ex => (
                            <option key={ex} value={ex}>{ex}</option>
                          ))}
                      </select>
                      <div className="flex gap-2 mt-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Sets</label>
                          <input
                            type="number"
                            className="w-full border rounded px-2 py-1"
                            value={entry.sets}
                            min={1}
                            onChange={e => handleEditChange(i, "sets", Number(e.target.value))}
                            placeholder="Sets"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Reps</label>
                          <input
                            type="number"
                            className="w-full border rounded px-2 py-1"
                            value={entry.reps}
                            min={1}
                            onChange={e => handleEditChange(i, "reps", Number(e.target.value))}
                            placeholder="Reps"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Weight (lbs)</label>
                          <input
                            type="number"
                            className="w-full border rounded px-2 py-1"
                            value={entry.weight}
                            min={0}
                            onChange={e => handleEditChange(i, "weight", Number(e.target.value))}
                            placeholder="Weight"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="w-full bg-gray-200 text-blue-700 py-2 rounded-lg text-sm font-semibold shadow hover:bg-blue-300 transition mb-2"
                    onClick={handleAddSet}
                  >Add Exercise</button>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >Save</button>
                    <button
                      type="button"
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                      onClick={closeEditModal}
                    >Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-8">
          <h2>Workout History</h2>
          <p className="mt-4 text-lg text-gray-700">No account found. <a href="signup.html" className="text-blue-600 underline">Sign up</a> or <a href="login.html" className="text-blue-600 underline">log in</a> to see your history.</p>
        </div>
      )}
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<WorkoutHistory />); 