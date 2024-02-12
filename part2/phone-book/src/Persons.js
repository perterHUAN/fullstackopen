function Person({ searchPersons }) {
  return (
    <>
      {searchPersons.map((person) => (
        <p key={person.name}>
          {person.name} {person.phoneNumber}
        </p>
      ))}
    </>
  );
}

export default Person;
