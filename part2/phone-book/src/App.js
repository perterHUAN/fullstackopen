import React, { useCallback, useEffect } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import Message from "./Message";
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
  const [message, setMessage] = React.useState("");

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
        })
          .then((response) => {
            setPersons(
              persons
                .filter((person) => person.name !== newName)
                .concat(response || [])
            );
          })
          .catch((error) => {
            setMessage(error.response.data.error);
          });
      }
    } else {
      postNewEntry({ name: newName, phoneNumber: phoneNumber })
        .then((data) => {
          setMessage(`Added ${newName}`);
          setTimeout(() => setMessage(""), 2000);
          setPersons(persons.concat(data));
        })
        .catch((error) => {
          setMessage(error.response.data.error);
        });
    }
    setNewName("");
    setPhoneNumber("");
  }
  function handleSearchChange(event) {
    const value = event.target.value;
    setSearch(value);
  }
  function handleDelete(id) {
    deletEntry(id)
      .then((_) => setPersons(persons.filter((person) => person.id !== id)))
      .catch((error) => {
        setMessage(error.response.data.error);
      });
  }
  const reg = new RegExp(search, "i");
  const searchPersons = persons.filter((person) => reg.test(person.name));
  return (
    <div>
      <h2>Phonebook</h2>
      {message && <Message message={message} />}
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
