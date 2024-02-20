const express = require("express");
const app = express();

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
/*
  Get /api/persons
  respond with an array of persons' name and phone number
  in the format of JSON.
*/
app.get("/api/persons", (request, response) => {
  response.json(notes);
});
/*
  Get /info
  respond with the html content which describes
  the length of the notes and the time at which the response is sent.
*/
app.get("/info", (request, response) => {
  const body = `
    <p>Phonebook has info for ${notes.length} people</p>
    <p>${new Date()}<p>
  `;
  response.send(body);
});

/*
  Get /api/persons/:id
  respond with the person's info which id is equal to the id that is given in url.
  if don't exist, return  404
*/

app.get("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  const result = persons.filter((person) => person.id === id);
  if (result.length === 0) response.status(404).end();
  else response.send(result[0]);
});

const PORT = 3001;

app.listen(PORT, () => console.log("connect!!!"));
