import { useState } from "react";
import Statistics from "./Statistics";
import Button from "./Button";
function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  function addGood() {
    setGood(good + 1);
  }

  function addNeutral() {
    setNeutral(neutral + 1);
  }

  function addBad() {
    setBad(bad + 1);
  }
  return (
    <div>
      <h2>give feedback</h2>
      <div class="row">
        <Button label="choose good" onClick={addGood}>
          good
        </Button>
        <Button label="choose neutral" onClick={addNeutral}>
          neutral
        </Button>
        <Button label="choose bad" onClick={addBad}>
          bad
        </Button>
      </div>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
