//this isnt being used. 

// Wait for the DOM to be fully loaded before running the script
window.addEventListener("DOMContentLoaded", () => {
    // Get the element where workouts will be displayed
    const workoutList = document.getElementById("workoutList");
  
    // Get all localStorage keys that represent workouts
    const keys = Object.keys(localStorage).filter(key => key.startsWith("workout_"));
  
    // If there are no workouts, display a motivational message and exit
    if (keys.length === 0) {
      workoutList.innerHTML = "<p>No workouts logged yet, go hit the gym 😤</p>";
      return;
    }
  
    // Sort the workout keys by date (ascending), then reverse to show most recent first
    keys.sort(); // Sort by date
    keys.reverse(); // Show most recent first
  
    // Loop through each workout key and display its data
    keys.forEach(key => {
      // Extract the date from the key (e.g., 'workout_2024-06-01' -> '2024-06-01')
      const date = key.replace("workout_", "");
      // Parse the workout data from localStorage (stored as JSON)
      const workoutData = JSON.parse(localStorage.getItem(key));
  
      // Start building the HTML for this workout
      let html = `<h4>Workout for ${date}</h4><ul>`;
      let totalVolume = 0; // Initialize total volume for this workout
  
      // Loop through each exercise entry in the workout
      Object.values(workoutData).forEach(entry => {
        const { exercise, weight, reps, sets } = entry;
        // Calculate the volume for this exercise
        const volume = weight * reps * sets;
        totalVolume += volume; // Add to the total volume
        // Add exercise details to the HTML
        html += `<li>${exercise}: ${sets} sets x ${reps} reps @ ${weight} lbs</li>`;
      });
  
      // Finish the HTML for this workout, including the total volume
      html += `</ul><p><strong>Total Volume:</strong> ${totalVolume} lbs</p><hr>`;
      // Append this workout's HTML to the workout list
      workoutList.innerHTML += html;
    });
  });

//code for local storage. 