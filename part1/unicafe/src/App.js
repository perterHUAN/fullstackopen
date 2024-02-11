import { useState } from "react";
import Statistics from "./Statistics";

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h2>give feedback</h2>
      <div class="row">
        <button aria-label="choose good" onClick={() => setGood(good + 1)}>
          good
        </button>
        <button
          aria-label="choose neutral"
          onClick={() => setNeutral(neutral + 1)}
        >
          neutral
        </button>
        <button aria-label="choose bad" onClick={() => setBad(bad + 1)}>
          bad
        </button>
      </div>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
