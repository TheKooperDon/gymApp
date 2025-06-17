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
    exerciseSelect.innerHTML = `<option value="">-- Select an exercise from ${group} --</option>`;


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


// Start of the + - Buttons
document.querySelectorAll(".adjust-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const inputId = btn.dataset.target;
    const action = btn.dataset.action;
    const input = document.getElementById(inputId);

    let value = parseFloat(input.value) || 0;

    // 👇 Set step sizes
    const step = inputId === "weight" ? 5 : 1;

    if (action === "increase") {
      value += step;
    } else if (action === "decrease") {
      value = Math.max(0, value - step);
    }

    // Update field
    input.value = inputId === "weight" ? value : Math.round(value);
  });
});
// end of the + - buttons


// ===========================
// 📥 Form Submission (safely)
// ===========================
window.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM loaded and script running");

  const form = document.getElementById("loggerForm");
  console.log("🧾 Form grabbed:", form);

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("🚀 Form submitted!");

      const exercise = document.getElementById("exercise").value.trim();
      const weight = document.getElementById("weight").value;
      const reps = document.getElementById("reps").value;

      console.log("💪 Input values →", { exercise, weight, reps });

      if (!exercise || !weight || !reps) {
        console.log("❌ One or more inputs missing.");
        return;
      }

      setCount++;
      const today = new Date();
      const date = today.toLocaleDateString();
      const dayOfWeek = today.toLocaleDateString("en-US", { weekday: 'long' });

      const logBody = document.getElementById("logBody");
      console.log("📊 Table body grabbed:", logBody);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${setCount}</td>
        <td>${exercise}</td>
        <td>${weight} lbs</td>
        <td>${reps}</td>
      `;

      logBody.appendChild(row);
      console.log("✅ Row added:", row);

      lastSet = { exercise, weight, reps };
      form.reset();
      console.log("♻️ Form reset");
    });
  } else {
    console.log("❌ loggerForm not found");
  }
});
// ===========================
// 📥 END Form Submission (safely)
// ===========================

// ===========================
// 🔁 Repeat Last Set
// ===========================
repeatBtn.addEventListener("click", function () {
  console.log("🔁 Repeat button clicked");

  if (!lastSet) {
    console.log("❌ No last set found");
    return;
  }

  setCount++;
  const logBody = document.getElementById("logBody");
  console.log("📊 Table body (repeat):", logBody);

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${setCount}</td>
    <td>${lastSet.exercise}</td>
    <td>${lastSet.weight} lbs</td>
    <td>${lastSet.reps}</td>
  `;
  logBody.appendChild(row);
  console.log("✅ Repeated row added:", row);
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


// JS for quick Pad
console.log("Logger.js is loaded");

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is ready");

  const weightInput = document.getElementById("weight");
  const weightPad = document.getElementById("weightQuickPad");
  const togglePadBtn = document.getElementById("togglePadBtn");

  if (!togglePadBtn || !weightPad || !weightInput) {
    console.log("Some elements are missing.");
    return;
  }

  togglePadBtn.addEventListener("click", () => {
    console.log("Toggle clicked");
    weightPad.style.display = (weightPad.style.display === "flex") ? "none" : "flex";
  });

  document.querySelectorAll("#weightQuickPad .pad-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.textContent;
      console.log(`Pad button clicked: ${val}`);
      weightInput.value = val === "Clear" ? "" : val;
    });
  });
});

//end of quick pad 
/*
togglePadBtn.addEventListener("click", () => {
  console.log("Quick Pick button clicked");
});


window.addEventListener("DOMContentLoaded", () => {
  const weightInput = document.getElementById("weight");
  const weightPad = document.getElementById("weightQuickPad");
  const togglePadBtn = document.getElementById("togglePadBtn");

  togglePadBtn.addEventListener("click", () => {
    weightPad.style.display = (weightPad.style.display === "flex") ? "none" : "flex";
  });

  document.querySelectorAll("#weightQuickPad .pad-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.textContent;
      if (val === "Clear") {
        weightInput.value = "";
      } else {
        weightInput.value = val;
      }
    });
  });
});
*/
/*
const weightInput = document.getElementById("weight");
const weightPad = document.getElementById("weightQuickPad");
const togglePadBtn = document.getElementById("togglePadBtn");

// Toggle pad on button click
togglePadBtn.addEventListener("click", () => {
  weightPad.style.display = (weightPad.style.display === "flex") ? "none" : "flex";
});

// Handle pad button clicks
document.querySelectorAll("#weightQuickPad .pad-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.textContent;
    if (val === "Clear") {
      weightInput.value = "";
    } else {
      weightInput.value = val;
    }
  });
});




*/


// Toggle pad visibility when weight input is focused
/* 
const weightInput = document.getElementById("weight");
const weightPad = document.getElementById("weightQuickPad");

weightInput.addEventListener("focus", () => {
  weightPad.style.display = "flex";
});

weightInput.addEventListener("blur", () => {
  setTimeout(() => weightPad.style.display = "none", 200);
});

// Handle pad button clicks
document.querySelectorAll("#weightQuickPad .pad-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.textContent;
    if (val === "Clear") {
      weightInput.value = "";
    } else {
      weightInput.value = val;
      weightInput.focus(); // keep pad open in case user keeps tapping
    }
  });
});
*/
//end of toggle pad