// loggerReact.js
const { useState } = React;

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

function groupExercisesByCategory(map) {
  const grouped = {};
  for (let exercise in map) {
    const group = map[exercise];
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(exercise);
  }
  return grouped;
}

function Logger() {
  const groupedExercises = groupExercisesByCategory(exerciseMap);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [log, setLog] = useState([]);
  const [lastSet, setLastSet] = useState(null);
  const [summary, setSummary] = useState("");
  const [showPad, setShowPad] = useState(false);

  function addSet(e) {
    e.preventDefault();
    if (!exercise || !weight || !reps) return;
    const newSet = { exercise, weight: Number(weight), reps: Number(reps) };
    setLog([...log, newSet]);
    setLastSet(newSet);
    setExercise("");
    setWeight("");
    setReps("");
  }

  function repeatSet() {
    if (!lastSet) return;
    setLog([...log, lastSet]);
  }

  function finishWorkout() {
    if (log.length === 0) {
      alert("Bruh... log at least one set.");
      return;
    }
    // Group sets
    const grouped = {};
    let totalSets = 0, totalReps = 0, totalVolume = 0;
    log.forEach(({ exercise, weight, reps }) => {
      const key = `${exercise}|${weight}|${reps}`;
      if (!grouped[key]) {
        grouped[key] = { exercise, weight, reps, sets: 1 };
      } else {
        grouped[key].sets++;
      }
    });
    for (const entry of Object.values(grouped)) {
      totalSets += entry.sets;
      totalReps += entry.reps * entry.sets;
      totalVolume += entry.reps * entry.weight * entry.sets;
    }
    const today = new Date().toLocaleDateString();
    setSummary(`Workout saved for ${today} — ${totalSets} sets, ${totalReps} reps, ${totalVolume} lbs lifted.`);
    // Save to localStorage
    const dateKey = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`workout_${dateKey}`, JSON.stringify(grouped));
    alert("Workout saved! 💾 Time to go flex 💪");
  }

  function handlePad(val) {
    if (val === "Clear") setWeight("");
    else setWeight(val);
    setShowPad(false);
  }

  return (
    <div className="w-full">
      <h2 className="text-center text-2xl font-semibold mb-4">Log Workout</h2>
      <form onSubmit={addSet} className="w-full max-w-[400px] mx-auto">
        <div className="flex flex-col items-center mb-4 w-full">
          <label className="text-center mb-1">Select Muscle Group:</label>
          <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
            {Object.keys(groupedExercises).map(group => (
              <button
                type="button"
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`flex-1 min-w-[90px] px-3 py-2 rounded font-medium border border-gray-300 bg-gray-100 hover:bg-gray-200 transition ${selectedGroup === group ? 'bg-blue-200 border-blue-400' : ''}`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center mb-4 w-full">
          <label htmlFor="exercise" className="mb-1">Exercise:</label>
          <select
            id="exercise"
            name="exercise"
            value={exercise}
            onChange={e => setExercise(e.target.value)}
            required
            className="w-full max-w-xs px-2 py-2 border border-gray-300 rounded text-center"
          >
            <option value="">
              {selectedGroup
                ? `-- Select ${selectedGroup} Exercise --`
                : "-- Select a muscle group first --"}
            </option>
            {selectedGroup && groupedExercises[selectedGroup].map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-center mb-4 w-full">
          <label htmlFor="weight" className="mb-1">Weight (lbs):</label>
          <div className="flex justify-center items-center gap-2 w-full mb-2">
            <button type="button" onClick={() => setWeight(w => Math.max(0, Number(w) - 5))} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">-</button>
            <input
              type="number"
              id="weight"
              name="weight"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              className="flex-1 max-w-[100px] text-center text-lg p-2 border border-gray-300 rounded"
            />
            <button type="button" onClick={() => setWeight(w => Number(w) + 5)} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">+</button>
          </div>
          <button type="button" className="mt-2 text-sm text-blue-700 underline" onClick={() => setShowPad(p => !p)}>Quick Pick</button>
          {showPad && (
            <div className="flex gap-2 mt-2 flex-wrap justify-center">
              {[5, 10, 15, 20, 25, 30, 35, 40].map(val => (
                <button type="button" className="px-4 py-2 text-base bg-gray-100 rounded cursor-pointer border border-gray-300" key={val} onClick={() => handlePad(val)}>{val}</button>
              ))}
              <button type="button" className="px-4 py-2 text-base bg-gray-100 rounded cursor-pointer border border-gray-300" onClick={() => handlePad("Clear")}>Clear</button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center mb-4 w-full">
          <label htmlFor="reps" className="mb-1">Reps:</label>
          <div className="flex justify-center items-center gap-2 w-full">
            <button type="button" onClick={() => setReps(r => Math.max(0, Number(r) - 1))} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">-</button>
            <input
              type="number"
              id="reps"
              name="reps"
              value={reps}
              onChange={e => setReps(e.target.value)}
              className="flex-1 max-w-[100px] text-center text-lg p-2 border border-gray-300 rounded"
            />
            <button type="button" onClick={() => setReps(r => Number(r) + 1)} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">+</button>
          </div>
        </div>
        <div className="flex justify-center gap-4 mb-4 w-full">
          <button type="submit" className="flex-1 max-w-[150px] px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Set</button>
          <button type="button" onClick={repeatSet} className="flex-1 max-w-[150px] px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Repeat Last Set</button>
        </div>
        <div className="flex flex-col items-center mb-4 w-full">
          <button type="button" onClick={finishWorkout} className="w-full max-w-xs px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Finish Workout</button>
        </div>
      </form>
      {summary && <div className="mt-4 text-center font-semibold text-green-700"><strong>{summary}</strong></div>}
      <h3 className="text-center text-lg font-semibold mt-6 mb-2">Workout Log</h3>
      <table id="logTable" className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-center bg-gray-100">#</th>
            <th className="border border-gray-300 p-2 text-center bg-gray-100">Exercise</th>
            <th className="border border-gray-300 p-2 text-center bg-gray-100">Weight</th>
            <th className="border border-gray-300 p-2 text-center bg-gray-100">Reps</th>
          </tr>
        </thead>
        <tbody>
          {log.map((set, idx) => (
            <tr key={idx}>
              <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
              <td className="border border-gray-300 p-2 text-center">{set.exercise}</td>
              <td className="border border-gray-300 p-2 text-center">{set.weight} lbs</td>
              <td className="border border-gray-300 p-2 text-center">{set.reps}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add clear buttons below the log */}
      <div className="flex justify-center gap-4 mt-6 mb-2">
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {
            if (log.length > 0) setLog(log.slice(0, -1));
          }}
        >
          Remove Last Set
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => {
            if (log.length > 0 && window.confirm('Clear all sets?')) setLog([]);
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

// React 18+ API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Logger />);