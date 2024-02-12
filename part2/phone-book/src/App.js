import React, { useCallback } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";

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
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        handleAdd={handleAdd}
        newName={newName}
        handleChangeName={handleChangeName}
        phoneNumber={phoneNumber}
        handleChangePhoneNumber={handleChangePhoneNumber}
      />

      <h2>Numbers</h2>
      <Persons searchPersons={searchPersons} />
    </div>
  );
}

export default App;
