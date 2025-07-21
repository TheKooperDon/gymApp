const { useState, useEffect } = React;

function Index() {
  const [user, setUser] = useState(null);
  const [lastWorkout, setLastWorkout] = useState(null);

  useEffect(() => {
    let userData = null;
    try {
      userData = JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {}
    setUser(userData);

    // Find last workout date if logged in
    if (userData) {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('workout_'));
      if (keys.length > 0) {
        keys.sort().reverse();
        setLastWorkout(keys[0].replace('workout_', ''));
      }
    }
  }, []);

  if (user) {
    return (
      <main className="flex-1 p-6 flex flex-col gap-8 justify-center items-center text-center">
        <section className="mb-2">
          <h2 className="text-2xl font-semibold mb-2">Welcome back, <span className="text-blue-700">{user.firstName || user.username || 'friend'}</span>!</h2>
          <p className="text-lg text-gray-700">Ready to log your next workout?</p>
        </section>
        <section className="flex flex-col gap-3 w-full max-w-xs mb-2">
          <a href="logger.html" className="w-full">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition">Log Workout</button>
          </a>
          <a href="profile.html" className="w-full">
            <button className="w-full bg-gray-200 text-blue-700 py-2 rounded-lg text-lg font-semibold shadow hover:bg-blue-300 transition">View Profile</button>
          </a>
        </section>
        <section className="bg-gray-50 rounded-lg p-4 shadow-inner w-full max-w-xs flex flex-col items-center mb-2">
          <h3 className="text-lg font-semibold mb-1">Quick Stats</h3>
          {lastWorkout ? (
            <p className="mb-2 text-gray-700">Last workout: <span className="font-semibold">{lastWorkout}</span></p>
          ) : (
            <p className="mb-2 text-gray-700">No workouts logged yet. Let's get started!</p>
          )}
        </section>
      </main>
    );
  }

  // Guest view (original homepage)
  return (
    <main className="flex-1 p-6 flex flex-col gap-8 justify-center items-center text-center">
      {/* 1. Intro Message / Tagline */}
      <section className="mb-2">
        <h2 className="text-2xl font-semibold mb-2">Welcome to Short Stack</h2>
        <p className="text-lg text-gray-700">Your pocket gym log with max gains, no fluff.</p>
      </section>
      {/* 2. Call to Action Buttons */}
      <section className="flex flex-col gap-3 w-full max-w-xs mb-2">
        <a href="logger.html" className="w-full">
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition">Get Started</button>
        </a>
        <a href="auth.html" className="w-full">
          <button className="w-full bg-gray-200 text-blue-700 py-2 rounded-lg text-lg font-semibold shadow hover:bg-blue-300 transition">Sign Up / Log In</button>
        </a>
      </section>
      {/* 3. App Preview Section */}
      <section className="bg-gray-50 rounded-lg p-4 shadow-inner w-full max-w-xs flex flex-col items-center mb-2">
        <h3 className="text-lg font-semibold mb-1">App Preview</h3>
        <p className="mb-2 text-gray-700">Track sets, reps, and weights with ease.</p>
        {/* Embedded video placeholder */}
        <video controls autoPlay loop muted playsInline className="w-full h-40 rounded mb-2 object-cover bg-gray-200">
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <span className="text-xs text-gray-400 mb-2">(This will be replaced with a real app demo montage soon!)</span>
        <ul className="text-left text-sm text-gray-600 list-disc list-inside">
          <li>Quick Pick for weights</li>
          <li>Set history</li>
          <li>Profile tracking</li>
        </ul>
      </section>
      {/* 4. Why Use This? */}
      <section className="w-full max-w-xs">
        <h3 className="text-lg font-semibold mb-1">Log. Repeat. Grow.</h3>
        <ul className="text-left text-gray-700 list-disc list-inside mb-2">
          <li>Fast workout logging</li>
          <li>Auto-saves your history</li>
          <li>See volume stats and progress</li>
          <li>No account? No problem. <span className="text-xs">(Yet 😏)</span></li>
        </ul>
      </section>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);