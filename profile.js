window.addEventListener("DOMContentLoaded", () => {
    const workoutList = document.getElementById("workoutList");
  
    const keys = Object.keys(localStorage).filter(key => key.startsWith("workout_"));
  
    if (keys.length === 0) {
      workoutList.innerHTML = "<p>No workouts logged yet, go hit the gym 😤</p>";
      return;
    }
  
    keys.sort(); // Sort by date
    keys.reverse(); // Show most recent first
  
    keys.forEach(key => {
      const date = key.replace("workout_", "");
      const workoutData = JSON.parse(localStorage.getItem(key));
  
      let html = `<h4>Workout for ${date}</h4><ul>`;
      let totalVolume = 0;
  
      Object.values(workoutData).forEach(entry => {
        const { exercise, weight, reps, sets } = entry;
        const volume = weight * reps * sets;
        totalVolume += volume;
        html += `<li>${exercise}: ${sets} sets x ${reps} reps @ ${weight} lbs</li>`;
      });
  
      html += `</ul><p><strong>Total Volume:</strong> ${totalVolume} lbs</p><hr>`;
      workoutList.innerHTML += html;
    });
  });

  //test 