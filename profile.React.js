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

    if (user && user.firstName) {
      const keys = Object.keys(localStorage).filter(key => key.startsWith("workout_"));
      keys.sort().reverse();
      const data = keys.map(key => {
        const date = key.replace("workout_", "");
        const workoutData = JSON.parse(localStorage.getItem(key));
        return { date, workoutData };
      });
      setWorkouts(data);
    } else {
      setWorkouts([]);
    }
  }, []);

  return (
    <div>
      {firstName ? (
        <>
          <div className="mb-4 flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1 drop-shadow">{firstName}'s Stats</h2>
            <div className="bg-green-100 text-green-800 font-semibold rounded-lg px-4 py-2 shadow-sm mb-2 text-lg">
              Welcome back, {firstName}!
            </div>
          </div>
          <h3>Workout History</h3>
          {workouts.length === 0 ? (
            <p>No workouts logged yet, go hit the gym 😤</p>
          ) : (
            workouts.map(({ date, workoutData }, idx) => {
              let totalVolume = 0;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 shadow-md rounded-xl mb-6 p-4 transition hover:shadow-lg"
                >
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
            })
          )}
          {/* Clear All Data Button */}
          <div className="flex justify-center mt-6">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all workout data?')) {
                  // Remove all workout logs
                  Object.keys(localStorage)
                    .filter(key => key.startsWith('workout_'))
                    .forEach(key => localStorage.removeItem(key));
                  setWorkouts([]);
                }
              }}
            >
              Clear All Data
            </button>
          </div>
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

// Render to a root element
ReactDOM.render(<Profile />, document.getElementById('root'));