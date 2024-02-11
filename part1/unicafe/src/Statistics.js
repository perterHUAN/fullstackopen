import StatisticLine from "./StatisticLine";
function Statistics({ good, neutral, bad }) {
  if (!good && !neutral && !bad) {
    return <p>No feedback given</p>;
  }
  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good * 1 + neutral * 0 + bad * -1) / total;
  const positive = total === 0 ? 0 : (good / total) * 100;

  return (
    <>
      <h2>statistics</h2>
      <StatisticLine label="good" text="good" value={good} />
      <StatisticLine label="neutral" text="neutral" value={neutral} />
      <StatisticLine label="bad" text="bad" value={bad} />
      <StatisticLine label="total" text="total" value={total} />
      <StatisticLine label="average" text="average" value={average} />
      <StatisticLine
        label="positive percentage"
        text="positive"
        value={positive}
      />
    </>
  );
}

export default Statistics;
