// ===========================
// 🔁 Global Setup
// ===========================
const logList = document.getElementById("logList");
const form = document.getElementById("loggerForm");
const repeatBtn = document.getElementById("repeatSet");

let lastSet = null;
let setCount = 0;

// ===========================
// 🧠 Exercise Map: All Exercises Grouped by Category
// ===========================
const exerciseMap = {
  // Chest
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

  // Back
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

  // Shoulders
  "Arnold Press": "Shoulders",
  "Cable Lateral Raise": "Shoulders",
  "Dumbbell Shrugs": "Shoulders",
  "Front Raise": "Shoulders",
  "Lateral Raise": "Shoulders",
  "Pike Push Ups": "Shoulders",
  "Rear Delt Fly": "Shoulders",
  "Shoulder Press": "Shoulders",

  // Arms
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

  // Legs
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

  // Core
  "Cable Woodchoppers": "Core",
  "Hanging Leg Raises": "Core",
  "Plank": "Core",
};

// ===========================
// 💪 Muscle Group Buttons: Filter Exercises Based on Selection
// ===========================
const exerciseSelect = document.getElementById("exercise");
const groupButtons = document.querySelectorAll("#muscleGroupBtns button");

const groupedExercises = {};
for (let exercise in exerciseMap) {
  const group = exerciseMap[exercise];
  if (!groupedExercises[group]) groupedExercises[group] = [];
  groupedExercises[group].push(exercise);
}

// When user taps a muscle group button, populate the dropdown with matching exercises
groupButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const group = btn.dataset.group;
    exerciseSelect.innerHTML = '<option value="">-- Select Exercise --</option>';

    if (groupedExercises[group]) {
      groupedExercises[group].forEach((exercise) => {
        const option = document.createElement("option");
        option.value = exercise;
        option.textContent = exercise;
        exerciseSelect.appendChild(option);
      });
    }
  });
});
// ===========================
// 🔄 END: Muscle Group Buttons
// ===========================


// ===========================
// 📥 Form Submission: Log New Set
// ===========================
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const exercise = document.getElementById("exercise").value.trim();
  const weight = document.getElementById("weight").value;
  const reps = document.getElementById("reps").value;

  if (!exercise || !weight || !reps) return;

  setCount++;
  const today = new Date();
  const date = today.toLocaleDateString();
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: 'long' });

  const logEntry = `${setCount}. ${dayOfWeek} ${date} - ${exercise} | ${weight} lbs x ${reps}`;
  const li = document.createElement("li");
  li.textContent = logEntry;
  logList.appendChild(li);

  lastSet = { exercise, weight, reps }; // save last set for repeat use
  form.reset(); // clear form fields
});
// ===========================
// ✅ END: Set Logging
// ===========================


// ===========================
// 🔁 Repeat Last Set
// ===========================
repeatBtn.addEventListener("click", function () {
  if (!lastSet) return;

  setCount++;
  const today = new Date();
  const date = today.toLocaleDateString();
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: 'long' });

  const logEntry = `${setCount}. ${dayOfWeek} ${date} - ${lastSet.exercise} | ${lastSet.weight} lbs x ${lastSet.reps}`;
  const li = document.createElement("li");
  li.textContent = logEntry;
  logList.appendChild(li);
});
// ===========================
// 🔁 END: Repeat Last Set
// ===========================


// ===========================
// ✅ Finish Workout Button
// ===========================
document.getElementById("finishWorkout").addEventListener("click", function () {
  alert("Workout complete! You beast 😤🔥");
  // 📝 In the future: Save to localStorage, export to file, etc.
});
// ===========================
// 🏁 END: Finish Workout Button
// ===========================