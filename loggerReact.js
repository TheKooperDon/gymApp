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
    <div className="logger-root">
      <h2 className="text-center">Log Workout</h2>
      <form onSubmit={addSet} className="logger-form">
        <div className="form-row">
          <label className="text-center">Select Muscle Group:</label>
          <div className="button-wrap">
            {Object.keys(groupedExercises).map(group => (
              <button type="button" key={group} onClick={() => setSelectedGroup(group)}>{group}</button>
            ))}
          </div>
        </div>
        <div className="form-row">
          <label htmlFor="exercise">Exercise:</label>
          <select id="exercise" name="exercise" value={exercise} onChange={e => setExercise(e.target.value)} required>
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
        <div className="form-row">
          <label htmlFor="weight">Weight (lbs):</label>
          <div className="input-group">
            <button type="button" onClick={() => setWeight(w => Math.max(0, Number(w) - 5))}>-</button>
            <input type="number" id="weight" name="weight" value={weight} onChange={e => setWeight(e.target.value)} />
            <button type="button" onClick={() => setWeight(w => Number(w) + 5)}>+</button>
          </div>
          <button type="button" className="quick-pick-btn" onClick={() => setShowPad(p => !p)}>Quick Pick</button>
          {showPad && (
            <div className="quick-pad-row">
              {[5, 10, 15, 20, 25, 30, 35, 40].map(val => (
                <button type="button" className="pad-btn" key={val} onClick={() => handlePad(val)}>{val}</button>
              ))}
              <button type="button" className="pad-btn" onClick={() => handlePad("Clear")}>Clear</button>
            </div>
          )}
        </div>
        <div className="form-row">
          <label htmlFor="reps">Reps:</label>
          <div className="input-group">
            <button type="button" onClick={() => setReps(r => Math.max(0, Number(r) - 1))}>-</button>
            <input type="number" id="reps" name="reps" value={reps} onChange={e => setReps(e.target.value)} />
            <button type="button" onClick={() => setReps(r => Number(r) + 1)}>+</button>
          </div>
        </div>
        <div className="button-row">
          <button type="submit">+ Add Set</button>
          <button type="button" onClick={repeatSet}>Repeat Last Set</button>
        </div>
        <div className="form-row">
          <button type="button" onClick={finishWorkout}>Finish Workout</button>
        </div>
      </form>
      {summary && <div className="text-center summary-msg"><strong>{summary}</strong></div>}
      <h3 className="text-center">Workout Log</h3>
      <table id="logTable">
        <thead>
          <tr>
            <th>#</th><th>Exercise</th><th>Weight</th><th>Reps</th>
          </tr>
        </thead>
        <tbody>
          {log.map((set, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{set.exercise}</td>
              <td>{set.weight} lbs</td>
              <td>{set.reps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// React 18+ API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Logger />);