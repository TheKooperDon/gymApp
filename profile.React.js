
// profileReact.js
const { useState, useEffect } = React;

// Helper function to format dates as YYYY-MM-DD for internal storage and comparison
function formatDateYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to format dates as MM/DD/YYYY for display
function formatDateForDisplay(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${parseInt(month)}/${parseInt(day)}/${year}`;
}

function Profile() {
  const [workouts, setWorkouts] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [editingWorkout, setEditingWorkout] = useState(null); // {date, workoutData}
  const [editData, setEditData] = useState(null); // editable copy
  const [addingWorkout, setAddingWorkout] = useState(false);
  const [addData, setAddData] = useState({ date: '', exercises: { set0: { group: '', exercise: '', sets: 1, reps: 1, weight: 0 } } });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());

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
        
        // Convert any old format to YYYY-MM-DD for internal storage
        let newDate = date;
        if (!date.includes('-')) {
          // Convert MM/DD/YYYY to YYYY-MM-DD
          const [month, day, year] = date.split('/');
          newDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          
          // ✅ Migrate key in localStorage
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
 
  // Generate calendar data for the current month
  function generateCalendarData() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      calendar.push({ day: '', hasWorkout: false, isEmpty: true });
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateStr = formatDateYYYYMMDD(currentDate);
      const hasWorkout = workouts.some(w => w.date === dateStr);
      calendar.push({
        day,
        hasWorkout,
        date: dateStr,
        isEmpty: false
      });
    }
    
    return calendar;
  }

  function navigateMonth(direction) {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  }

  function getMonthName(date) {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // Generate weight lifted data for the current week (Monday to Sunday)
  function generateWeightData() {
    console.log("=== generateWeightData called ===");
    const weightData = [];
    
    // Get Monday of current week
    const monday = new Date(currentWeek);
    const dayOfWeek = monday.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(monday.getDate() - daysToMonday);
    
    // Generate data for each day of the week (Monday to Sunday)
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      // Use MM/DD/YYYY format to match logger
      const dateStr = date.toLocaleDateString();
      
      // Find workout for this date
      const workout = workouts.find(w => w.date === dateStr);
      console.log(`Day ${i}: ${dateStr} - Found workout:`, !!workout);
      console.log(`Looking for: ${dateStr}`);
      console.log(`Available dates:`, workouts.map(w => w.date));
      console.log(`Match found:`, workouts.find(w => w.date === dateStr));
      
      let totalWeight = 0;
      if (workout) {
        // Calculate total weight for this workout
        Object.values(workout.workoutData).forEach(entry => {
          totalWeight += entry.weight * entry.reps * entry.sets;
        });
      }
      
      weightData.push({
        date: dateStr,
        weight: totalWeight,
        day: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    
    return weightData;
  }

  function navigateWeek(direction) {
    setCurrentWeek(prev => {
      const newWeek = new Date(prev);
      if (direction === 'prev') {
        newWeek.setDate(newWeek.getDate() - 7);
      } else {
        newWeek.setDate(newWeek.getDate() + 7);
      }
      return newWeek;
    });
  }

  function getWeekRange(date) {
    const monday = new Date(date);
    const dayOfWeek = monday.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(monday.getDate() - daysToMonday);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }

  // Calculate total stats
  function calculateStats() {
    const totalWorkouts = workouts.length;
    const totalVolume = workouts.reduce((sum, workout) => {
      return sum + Object.values(workout.workoutData).reduce((workoutSum, entry) => {
        return workoutSum + (entry.weight * entry.reps * entry.sets);
      }, 0);
    }, 0);
    const totalSets = workouts.reduce((sum, workout) => {
      return sum + Object.values(workout.workoutData).reduce((workoutSum, entry) => {
        return workoutSum + entry.sets;
      }, 0);
    }, 0);
    
    return { totalWorkouts, totalVolume, totalSets };
  }

  // Calculate stats and data - moved inside render to ensure workouts are loaded
  const stats = calculateStats();
  const calendarData = generateCalendarData();
  const weightData = generateWeightData();
  const maxWeight = Math.max(...weightData.map(d => d.weight), 1);

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

  // Modal logic
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
    // Save to localStorage
    localStorage.setItem(
      `workout_${editingWorkout.date}`,
      JSON.stringify(editData)
    );
    // Update state
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
      // Reset exercise if group changes
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

  function openAddModal() {
    setAddingWorkout(true);
    setAddData({ date: '', exercises: { set0: { group: '', exercise: '', sets: 1, reps: 1, weight: 0 } } });
  }
  function closeAddModal() {
    setAddingWorkout(false);
    setAddData({ date: '', exercises: { set0: { group: '', exercise: '', sets: 1, reps: 1, weight: 0 } } });
  }
  function handleAddChange(idx, field, value) {
    setAddData(prev => {
      const keys = Object.keys(prev.exercises);
      const key = keys[idx];
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [key]: {
            ...prev.exercises[key],
            [field]: value
          }
        }
      };
    });
  }
  function handleAddGroupChange(idx, group) {
    setAddData(prev => {
      const keys = Object.keys(prev.exercises);
      const key = keys[idx];
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [key]: {
            ...prev.exercises[key],
            group,
            exercise: ''
          }
        }
      };
    });
  }
  function handleAddExerciseChange(idx, exercise) {
    setAddData(prev => {
      const keys = Object.keys(prev.exercises);
      const key = keys[idx];
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [key]: {
            ...prev.exercises[key],
            exercise
          }
        }
      };
    });
  }
  function handleAddRemoveSet(idx) {
    setAddData(prev => {
      const keys = Object.keys(prev.exercises);
      const key = keys[idx];
      const newData = { ...prev.exercises };
      delete newData[key];
      return { ...prev, exercises: newData };
    });
  }
  function handleAddAddSet() {
    setAddData(prev => {
      const newKey = `set${Date.now()}`;
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [newKey]: { group: '', exercise: '', sets: 1, reps: 1, weight: 0 }
        }
      };
    });
  }
  function handleAddSave() {
    if (!addData.date) return;
    
    // The date input already returns YYYY-MM-DD format, so we can use it directly
    const formattedDate = addData.date;
    
    // Save to localStorage with YYYY-MM-DD format
    localStorage.setItem(
      `workout_${formattedDate}`,
      JSON.stringify(addData.exercises)
    );
    
    // Update state with YYYY-MM-DD format
    setWorkouts(ws => [
      { date: formattedDate, workoutData: addData.exercises },
      ...ws.filter(w => w.date !== formattedDate)
    ]);
    
    closeAddModal();
  }

  return (
    <div>
      {firstName ? (
        <>
          {/* Personal Profile Section */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
              <span className="text-white text-2xl font-bold">{firstName.charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1 drop-shadow">{firstName}'s Stats</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-6">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</div>
                <div className="text-xs text-gray-600">Workouts</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalSets}</div>
                <div className="text-xs text-gray-600">Total Sets</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(stats.totalVolume / 1000)}k</div>
                <div className="text-xs text-gray-600">Lbs Lifted</div>
              </div>
            </div>

            {/* Calendar Heatmap */}
            <div className="w-full max-w-xs mb-6">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold">{getMonthName(currentMonth)}</h3>
                <button
                  onClick={() => navigateMonth('next')}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Day labels */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <div key={`day-${idx}`} className="text-xs text-gray-500 text-center pb-1">
                    {day}
                  </div>
                ))}
                {/* Calendar days */}
                {calendarData.map((day, idx) => (
                  <div
                    key={`calendar-${idx}`}
                    className={`aspect-square rounded text-xs flex items-center justify-center ${
                      day.isEmpty 
                        ? 'bg-transparent' 
                        : day.hasWorkout 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-400'
                    }`}
                    title={day.isEmpty ? '' : `${day.date}${day.hasWorkout ? ' - Workout day!' : ' - No workout'}`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>

            {/* Weight Lifted Chart */}
            <div className="w-full max-w-xs mb-6">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => navigateWeek('prev')}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold">Weight Lifted</h3>
                <button
                  onClick={() => navigateWeek('next')}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 text-center mb-3">{getWeekRange(currentWeek)}</p>
              <div className="flex items-end justify-between h-32 gap-1">
                {weightData.map((day, idx) => {
                  const heightPercent = day.weight > 0 ? Math.max((day.weight / maxWeight) * 100, 4) : 4;
                  console.log(`Bar ${idx}: ${day.day}, weight: ${day.weight}, maxWeight: ${maxWeight}, heightPercent: ${heightPercent}%`);
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                        style={{ 
                          height: `${heightPercent}%`,
                          minHeight: '8px',
                          border: '1px solid black'
                        }}
                        title={`${day.day}: ${day.weight.toLocaleString()} lbs`}
                      ></div>
                      <div className="text-xs text-gray-600 mt-1">{day.day}</div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Daily total weight lifted</p>
            </div>
          </div>

          <h3>Recent Workouts</h3>
          {workouts.length === 0 ? (
            <p>No workouts logged yet, go hit the gym 😤</p>
          ) : (
            <>
              {workouts.slice(0, 2).map(({ date, workoutData }, idx) => {
                let totalVolume = 0;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 shadow-md rounded-xl mb-6 p-4 transition hover:shadow-lg relative"
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
                    <h4 className="text-lg font-semibold text-blue-700 mb-2">Workout for {formatDateForDisplay(date)}</h4>
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
              {workouts.length > 2 && (
                <div className="text-center mb-4">
                  <p className="text-gray-600 mb-2">Showing 2 of {workouts.length} workouts</p>
                  <a href="history.html" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    View All Workouts
                  </a>
                </div>
              )}
            </>
          )}

          {/* Add Past Workout Button */}
          <div className="flex justify-center mt-8 mb-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={openAddModal}
            >
              Add Past Workout
            </button>
          </div>

          {/* Download CSV Button - Moved to bottom */}
          <div className="flex justify-center mb-4">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => {
                // CSV columns: Date, Day of the Week, Workout Type, Exercise, Sets, Reps, Weight Used
                const rows = [
                  ["Date", "Day of the Week", "Workout Type", "Exercise", "Sets", "Reps", "Weight Used"]
                ];
                workouts.forEach(({ date, workoutData }) => {
                  const dayOfWeek = new Date(date).toLocaleDateString(undefined, { weekday: 'long' });
                  Object.values(workoutData).forEach(entry => {
                    const { exercise, weight, reps, sets } = entry;
                    // Use local exerciseMap for workout type
                    const workoutType = exerciseMap[exercise] || "";
                    rows.push([
                      date,
                      dayOfWeek,
                      workoutType,
                      exercise,
                      sets,
                      reps,
                      weight
                    ]);
                  });
                });
                // Convert to CSV string
                const csv = rows.map(r => r.map(String).map(v => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
                // Download
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'workout_log.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Download as CSV
            </button>
          </div>
          {/* Edit Modal */}
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
                      {/* Muscle group dropdown */}
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
                      {/* Exercise dropdown */}
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
          {/* Add Modal */}
          {addingWorkout && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                  onClick={closeAddModal}
                  title="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-xl font-bold mb-4">Add Past Workout</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleAddSave();
                  }}
                  className="space-y-4"
                >
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full border rounded px-2 py-1 mb-2"
                    value={addData.date}
                    onChange={e => setAddData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                  {Object.entries(addData.exercises).map(([key, entry], i) => (
                    <div key={key} className="border-b pb-2 mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">Exercise {i + 1}</span>
                        <button
                          type="button"
                          className="text-xs text-red-500 hover:underline"
                          onClick={() => handleAddRemoveSet(i)}
                        >Remove</button>
                      </div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Body Type</label>
                      <select
                        className="w-full border rounded px-2 py-1 mb-1"
                        value={entry.group || ''}
                        onChange={e => handleAddGroupChange(i, e.target.value)}
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
                        onChange={e => handleAddExerciseChange(i, e.target.value)}
                        required
                        disabled={!entry.group}
                      >
                        <option value="">Select exercise</option>
                        {entry.group && getExercisesForGroup(entry.group).map(ex => (
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
                            onChange={e => handleAddChange(i, 'sets', Number(e.target.value))}
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
                            onChange={e => handleAddChange(i, 'reps', Number(e.target.value))}
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
                            onChange={e => handleAddChange(i, 'weight', Number(e.target.value))}
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
                    onClick={handleAddAddSet}
                  >Add Exercise</button>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >Save</button>
                    <button
                      type="button"
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                      onClick={closeAddModal}
                    >Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-8">
          <h2>Your Profile & Stats</h2>
          <p className="mt-4 text-lg text-gray-700">No account found. <a href="signup.html" className="text-blue-600 underline">Sign up</a> or <a href="login.html" className="text-blue-600 underline">log in</a> to see your stats.</p>
        </div>
      )}
    </div>
  );
}

// Render to a root element using React 18 API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Profile />);