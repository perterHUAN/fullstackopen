import React from "react";

function App() {
  const [newName, setNewName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [persons, setPersons] = React.useState([
    { name: "Arto Hellas", phoneNumber: "123252352" },
  ]);
  function handleChangeName(event) {
    const value = event.target.value;
    setNewName(value);
  }
  function handleChangePhoneNumber(event) {
    const value = event.target.value;
    setPhoneNumber(value);
  }
  function handleAdd(event) {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    setPersons(persons.concat({ name: newName, phoneNumber: phoneNumber }));
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleAdd}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={newName}
            onChange={handleChangeName}
            required
          />
        </div>
        <div>
          <label htmlFor="phone-number">Phone Number</label>
          <input
            id="phone-number"
            name="phone-number"
            type="text"
            value={phoneNumber}
            onChange={handleChangePhoneNumber}
            required
          />
        </div>
        <div>
          <button>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.phoneNumber}
        </p>
      ))}
    </div>
  );
}

export default App;
