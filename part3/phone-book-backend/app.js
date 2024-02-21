const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
/*
  use the morgan middleware with the customize configure 
  to log the data sent in POST request
*/
morgan.format("reqbody", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqbody"
  )
);

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
  response.json(persons);
});
/*
  Get /info
  respond with the html content which describes
  the length of the notes and the time at which the response is sent.
*/
app.get("/info", (request, response) => {
  const body = `
    <p>Phonebook has info for ${persons.length} people</p>
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

/*
  Delete /api/persons/id
  delete the person which id is equal to the id given in url
*/
app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  const isExist = persons.some((person) => person.id === id);
  if (isExist) {
    persons = persons.filter((persons) => persons.id !== id);
    response.status(200).end();
  } else {
    response.status(404).end();
  }
});

/*
  Post /api/persons/
  create a new record based on the json data in request body. 
  
  Error conditions:
  * Missing the name or number field
  * Invalid format for the name or number field.
  * A record with the same name already exists in the phone book.
*/
function generateRandomId() {
  return Math.floor(Math.random() * 10000);
}

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  let status = 201;
  let errorInfo = "";
  if (!name || !number) {
    status = 400;
    errorInfo = "MUST include the name and number field";
  } else if (typeof name !== "string") {
    status = 400;
    errorInfo = "name field MUST be a string";
  } else if (typeof number !== "string") {
    status = 400;
    errorInfo = "number field MUST be a string";
  } else {
    const isExist = persons.some((person) => person.name === name);
    if (isExist) {
      status = 409;
      errorInfo = "name must be unique";
      persons.push({
        name,
        number,
        id: generateRandomId(),
      });
    }
  }
  console.log(name, number, status, errorInfo);
  response.status(status);
  if (errorInfo !== "") response.json({ error: errorInfo });
  response.end();
});
const PORT = 3001;

app.listen(PORT, () => console.log("connect!!!"));
