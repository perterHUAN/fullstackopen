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
      <table>
        <tbody>
          <tr>
            <td>good</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>neutral</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>bad</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td>total</td>
            <td>{total}</td>
          </tr>
          <tr>
            <td>average</td>
            <td>{average}</td>
          </tr>
          <tr>
            <td>positve</td>
            <td>{positive}%</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Statistics;
