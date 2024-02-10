import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

function App() {
  const course = "Half Stack application development";
  const parts = [
    {
      name: "Fundamentals of React",
      exercises: 10,
    },
    {
      name: "Using props to pass data",
      exercises: 7,
    },
    { name: "full stack", exercises: 11 },
  ];
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total total={parts.reduce((pre, cur) => cur.exercises + pre, 0)} />
    </div>
  );
}

export default App;
