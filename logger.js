
// ===========================
// 🔁 Global Setup
// ===========================
const logList = document.getElementById("logList");
const form = document.getElementById("loggerForm");
const repeatBtn = document.getElementById("repeatSet");

let lastSet = null;
let setCount = 0;

// ===========================
// 💪 Muscle Group Buttons: Filter Exercises Based on Selection
// ===========================
// Assume exerciseMap & groupedExercises setup remains unchanged

// Start of the + - Buttons
document.querySelectorAll(".adjust-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const inputId = btn.dataset.target;
    const action = btn.dataset.action;
    const input = document.getElementById(inputId);
    let value = parseFloat(input.value) || 0;
    const step = inputId === "weight" ? 5 : 1;
    if (action === "increase") {
      value += step;
    } else if (action === "decrease") {
      value = Math.max(0, value - step);
    }
    input.value = inputId === "weight" ? value : Math.round(value);
  });
});

// ===========================
// 📥 Form Submission (safely)
// ===========================
window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loggerForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const exercise = document.getElementById("exercise").value.trim();
      const weight = document.getElementById("weight").value;
      const reps = document.getElementById("reps").value;
      if (!exercise || !weight || !reps) return;

      setCount++;
      const logBody = document.getElementById("logBody");
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${setCount}</td>
        <td>${exercise}</td>
        <td>${weight} lbs</td>
        <td>${reps}</td>
      `;
      logBody.appendChild(row);
      lastSet = { exercise, weight, reps };
      form.reset();
    });
  }
});

// ===========================
// 🔁 Repeat Last Set
// ===========================
repeatBtn.addEventListener("click", function () {
  if (!lastSet) return;
  setCount++;
  const logBody = document.getElementById("logBody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${setCount}</td>
    <td>${lastSet.exercise}</td>
    <td>${lastSet.weight} lbs</td>
    <td>${lastSet.reps}</td>
  `;
  logBody.appendChild(row);
});

// ===========================
// ✅ Finish Workout Button
// ===========================
document.getElementById("finishWorkout").addEventListener("click", function () {
  const logBody = document.getElementById("logBody");
  const rows = logBody.querySelectorAll("tr");

  if (rows.length === 0) {
    alert("Bruh... log at least one set before finishing.");
    return;
  }

  const workoutData = [];
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    workoutData.push({
      exercise: cells[1].textContent,
      weight: cells[2].textContent.replace(" lbs", ""),
      reps: cells[3].textContent
    });
  });

  const grouped = {};
  workoutData.forEach(entry => {
    const key = `${entry.exercise}|${entry.weight}|${entry.reps}`;
    if (!grouped[key]) {
      grouped[key] = {
        exercise: entry.exercise,
        weight: parseInt(entry.weight),
        reps: parseInt(entry.reps),
        sets: 1
      };
    } else {
      grouped[key].sets++;
    }
  });

  let totalSets = 0;
  let totalReps = 0;
  let totalVolume = 0;
  for (const entry of Object.values(grouped)) {
    totalSets += entry.sets;
    totalReps += entry.reps * entry.sets;
    totalVolume += entry.reps * entry.weight * entry.sets;
  }

  const today = new Date().toLocaleDateString("en-US");
  const key = `workout_${today}`;
  localStorage.setItem(key, JSON.stringify(grouped));

  const status = document.getElementById("workoutStatus");
  if (status) {
    status.textContent = "✅ Workout saved to your profile!";
    status.style.display = "block";
  }

  const summarySection = document.getElementById("summarySection");
  const summaryText = document.getElementById("summaryText");
  summaryText.textContent = `Workout saved for ${today} — ${totalSets} total sets, ${totalReps} reps, ${totalVolume} lbs lifted.`;
  summarySection.style.display = "block";

  alert("Workout saved! 🧠 Now go flex on the Profile page.");
});
