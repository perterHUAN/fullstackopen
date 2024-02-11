import { useState } from "react";

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good * 1 + neutral * 0 + bad * -1) / total;
  const positive = total === 0 ? 0 : good / total;
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
      <h2>statistics</h2>
      <p arial-label="good count">good {good}</p>
      <p arial-label="neutral count">neutral {neutral}</p>
      <p arial-label="bad count">bad {bad}</p>
      <p arial-label="total">all {total}</p>
      <p arial-label="average">average {average}</p>
      <p arial-label="positive percentage">positive {positive * 100}%</p>
    </div>
  );
}

export default App;
