import Part from "./Part";
function Content({ parts }) {
  return (
    <>
      {parts.map((part, i) => (
        <Part key={i} name={part.name} exercises={part.exercises} />
      ))}
    </>
  );
}

export default Content;
