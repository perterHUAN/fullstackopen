function Persons({ searchPersons, handleDelete }) {
  function handleClick(name, id) {
    if (window.confirm(`Delte${name}?`)) {
      handleDelete(id);
    }
  }
  return (
    <>
      {searchPersons.map((person) => (
        <p key={person.id}>
          {person.name} {person.phoneNumber}
          <button onClick={() => handleClick(person.name, person.id)}>
            delete
          </button>
        </p>
      ))}
    </>
  );
}

export default Persons;
