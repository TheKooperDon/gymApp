//this isnt being used 

// profileReact.js
const { useState, useEffect } = React;

function Profile() {
  const [workouts, setWorkouts] = useState([]);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    // Get logged-in user
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("currentUser"));
    } catch (e) {}
    setFirstName(user && user.firstName ? user.firstName : "");

    const keys = Object.keys(localStorage).filter(key => key.startsWith("workout_"));
    keys.sort().reverse();
    const data = keys.map(key => {
      const date = key.replace("workout_", "");
      const workoutData = JSON.parse(localStorage.getItem(key));
      return { date, workoutData };
    });
    setWorkouts(data);
  }, []);

  return (
    <div>
      {firstName ? (
        <>
          <h2 className="mb-1">{firstName}'s Stats</h2>
          <div className="mb-2 text-green-700 font-semibold">Welcome back, {firstName}!</div>
        </>
      ) : (
        <h2>Your Profile & Stats</h2>
      )}
      <h3>Workout History</h3>
      {workouts.length === 0 ? (
        <p>No workouts logged yet, go hit the gym 😤</p>
      ) : (
        workouts.map(({ date, workoutData }, idx) => {
          let totalVolume = 0;
          return (
            <div key={idx}>
              <h4>Workout for {date}</h4>
              <ul>
                {Object.values(workoutData).map((entry, i) => {
                  const { exercise, weight, reps, sets } = entry;
                  const volume = weight * reps * sets;
                  totalVolume += volume;
                  return (
                    <li key={i}>
                      {exercise}: {sets} sets x {reps} reps @ {weight} lbs
                    </li>
                  );
                })}
              </ul>
              <p><strong>Total Volume:</strong> {totalVolume} lbs</p>
              <hr />
            </div>
          );
        })
      )}
      {/* Clear All Data Button */}
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all workout data and log out?')) {
              // Remove all workout logs
              Object.keys(localStorage)
                .filter(key => key.startsWith('workout_'))
                .forEach(key => localStorage.removeItem(key));
              // Remove login
              localStorage.removeItem('currentUser');
              setWorkouts([]);
              setFirstName("");
            }
          }}
        >
          Clear All Data & Log Out
        </button>
      </div>
    </div>
  );
}

// Render to a root element
ReactDOM.render(<Profile />, document.getElementById('root'));