function StatisticLine({ text, value, label }) {
  return (
    <p aria-label={label}>
      {text} {value}
      {text === "positive" && "%"}
    </p>
  );
}

export default StatisticLine;
