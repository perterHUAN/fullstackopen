import React, { useCallback, useEffect } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import {
  getAll,
  postNewEntry,
  deletEntry,
  updateEntry,
} from "./phone-book-service";

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
  function handleUpdate() {
    updateEntry(persons.filter((person) => person.name === newName)[0].id, {
      name: newName,
      phoneNumber: phoneNumber,
    });
  }
  function handleAdd(event) {
    event.preventDefault();
    const isExist = persons.some((person) => person.name === newName);

    if (isExist) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one`
        )
      ) {
        updateEntry(persons.find((person) => person.name === newName).id, {
          name: newName,
          phoneNumber: phoneNumber,
        }).then((response) => {
          setPersons(
            persons
              .filter((person) => person.name !== response.name)
              .concat(response)
          );
        });
      }

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
  function handleDelete(id) {
    deletEntry(id)
      .then((_) => setPersons(persons.filter((person) => person.id !== id)))
      .catch((error) => console.log("error: ", error));
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
      <Persons searchPersons={searchPersons} handleDelete={handleDelete} />
    </div>
  );
}

export default App;
