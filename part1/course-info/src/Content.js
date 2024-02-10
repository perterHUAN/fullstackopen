import Part from "./Part";
function Content({ parts }) {
  return (
    <>
      {parts.map((part) => (
        <Part name={part.name} exercises={part.exercises} />
      ))}
    </>
  );
}

export default Content;
