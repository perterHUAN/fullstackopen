import React from "react";

function App() {
  const [newName, setNewName] = React.useState("");
  const [persons, setPersons] = React.useState([{ name: "Arto Hellas" }]);
  function handleChange(event) {
    const value = event.target.value;
    setNewName(value);
  }
  function handleSubmit(event) {
    event.preventDefault();
    setPersons(persons.concat({ name: newName }));
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={newName}
          onChange={handleChange}
        />
        <div>
          <button>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <p key={person.name}>{person.name}</p>
      ))}
    </div>
  );
}

export default App;
