function Statistics({ good, neutral, bad }) {
  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good * 1 + neutral * 0 + bad * -1) / total;
  const positive = total === 0 ? 0 : good / total;

  return (
    <>
      <h2>statistics</h2>
      <p arial-label="good count">good {good}</p>
      <p arial-label="neutral count">neutral {neutral}</p>
      <p arial-label="bad count">bad {bad}</p>
      <p arial-label="total">all {total}</p>
      <p arial-label="average">average {average}</p>
      <p arial-label="positive percentage">positive {positive * 100}%</p>
    </>
  );
}

export default Statistics;
