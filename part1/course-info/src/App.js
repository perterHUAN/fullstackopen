import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

function App() {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      { name: "full stack", exercises: 11 },
    ],
  };
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={course.parts.reduce((pre, cur) => cur.exercises + pre, 0)} />
    </div>
  );
}

export default App;
