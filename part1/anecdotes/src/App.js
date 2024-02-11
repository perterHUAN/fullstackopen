import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients",
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));
  function generateRandomAnecdote() {
    const idx = Math.floor(Math.random() * anecdotes.length);
    setSelected(idx);
  }
  function vote() {
    const copy = [...points];
    copy[selected]++;
    setPoints(copy);
  }

  const result = points.reduce(
    (pre, cur, idx) => (cur > pre.value ? { value: cur, idx } : pre),
    { value: 0, idx: -1 }
  );
  const anecdoteWithVote = result.idx === -1 ? "" : anecdotes[result.idx];
  return (
    <>
      <div>{anecdotes[selected]}</div>
      <button onClick={vote}>vote</button>
      <button onClick={generateRandomAnecdote}>next anecdote</button>
      <h2>Anecdote with most votes</h2>
      <p>{anecdoteWithVote}</p>
    </>
  );
};

export default App;
