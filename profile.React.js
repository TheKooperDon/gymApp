// profileReact.js
const { useState, useEffect } = React;

function Profile() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
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
      <h2>Your Profile & Stats</h2>
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
    </div>
  );
}

// Render to a root element
ReactDOM.render(<Profile />, document.getElementById('root'));