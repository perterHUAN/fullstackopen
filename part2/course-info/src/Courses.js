import Course from "./Course";
function Courses({ courses }) {
  return (
    <>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </>
  );
}

export default Courses;
