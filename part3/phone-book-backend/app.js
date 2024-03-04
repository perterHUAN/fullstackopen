const express = require("express");
const morgan = require("morgan");

const app = express();

/*
  enable cors
  frontend 3000
  backend 3001
*/
const cors = require("cors");
app.use(cors());


/*
  serve static source,such as html, javascript,css..
*/
app.use(express.static('build'));

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    phoneNumber: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    phoneNumber: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    phoneNumber: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    phoneNumber: "39-23-6423122",
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
  const { name, phoneNumber } = request.body;
  let status = 201;
  let errorInfo = "";
  let newEntry = null;
  if (!name || !phoneNumber) {
    status = 400;
    errorInfo = "MUST include the name and phoneNumber field";
  } else if (typeof name !== "string") {
    status = 400;
    errorInfo = "name field MUST be a string";
  } else if (typeof phoneNumber !== "string") {
    status = 400;
    errorInfo = "phoneNumber field MUST be a string";
  } else {
    const isExist = persons.some((person) => person.name === name);
    if (isExist) {
      status = 409;
      errorInfo = "name must be unique";
    } else {
      newEntry = {
        name,
        phoneNumber,
        id: generateRandomId(),
      };
      persons.push(newEntry);
    }
  }
  console.log(name, phoneNumber, status, errorInfo);
  response.status(status);
  if (errorInfo !== "") response.json({ error: errorInfo });
  if (newEntry !== null) {
    console.log("entry:", newEntry);
    response.json(newEntry);
  }
  response.end();
});
const PORT = 3001;

app.listen(PORT, () => console.log("connect!!!"));