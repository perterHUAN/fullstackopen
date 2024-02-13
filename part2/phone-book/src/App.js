import React, { useCallback, useEffect } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import { getAll, postNewEntry } from "./phone-book-service";

function App() {
  const [newName, setNewName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [persons, setPersons] = React.useState([]);
  useEffect(() => {
    getAll().then((data) => setPersons(data));
  }, []);
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
    postNewEntry({ name: newName, phoneNumber: phoneNumber })
      .then((data) => {
        setPersons(persons.concat(data));
      })
      .catch((error) => console.log("generate error: ", error));
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
