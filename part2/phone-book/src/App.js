import React from "react";

function App() {
  const [newName, setNewName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [persons, setPersons] = React.useState([
    { name: "Arto Hellas", phoneNumber: "123252352", idx: 1 },
    { name: "Ada Lovelace", phoneNumber: "123252352", idx: 2 },
    { name: "Dan Abramov", phoneNumber: "123252352", idx: 3 },
    { name: "Mary Poppendieck", phoneNumber: "123252352", idx: 4 },
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
  function handleSearchChange(event) {
    const value = event.target.value;
    setSearch(value);
  }
  const reg = new RegExp(search, "i");
  const searchPersons = persons.filter((person) => reg.test(person.name));
  return (
    <div>
      <h2>Phonebook</h2>
      <label id="search">filter shown with</label>
      <input
        htmlFor="search"
        type="text"
        name="search"
        value={search}
        onChange={handleSearchChange}
      ></input>
      <h2>add a new</h2>
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
      {searchPersons.map((person) => (
        <p key={person.name}>
          {person.name} {person.phoneNumber}
        </p>
      ))}
    </div>
  );
}

export default App;
