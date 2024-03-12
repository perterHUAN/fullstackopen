require("dotenv").config();
const PhoneBook = require("./module/phoneBook");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

// connect to database
const mongoUrl = process.env.MONGODB_URI;
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

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
app.use(express.static("build"));

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

/*
  Get /api/persons
  respond with an array of persons' name and phone number
  in the format of JSON.
*/
app.get("/api/persons", (request, response) => {
  PhoneBook.find({}).then((result) => {
    response.json(result);
  });
});
/*
  Get /info
  respond with the html content which describes
  the length of the notes and the time at which the response is sent.
*/
app.get("/info", (request, response, next) => {
  PhoneBook.countDocuments({})
    .then((count) => {
      const body = `
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}<p>
      `;
      response.send(body);
    })
    .catch((error) => {
      next(error);
    });
});

/*
  Get /api/persons/:id
  respond with the person's info which id is equal to the id that is given in url.
  if don't exist, return  404
*/

app.get("/api/persons/:id", (request, response, next) => {
  PhoneBook.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.send(result);
      } else {
        response.status(404).send("<h1>404<h1>");
      }
    })
    .catch((error) => next(error));
});

/*
  Delete /api/persons/id
  delete the person which id is equal to the id given in url
*/
app.delete("/api/persons/:id", (request, response) => {
  PhoneBook.findByIdAndDelete(request.params.id)
    .then((result) => {
      // 204 No content delete successfully
      console.log("delete: ", result);
      response.status(204).end();
    })
    .catch((error) => {
      // handle errors uniformly in one place.
      next(error);
    });
});

/*
  Post /api/persons/
  create a new record based on the json data in request body. 
  
  Error conditions:
  * Missing the name or number field
  * Invalid format for the name or number field.
  * A record with the same name already exists in the phone book.
*/
app.post("/api/persons", (request, response, next) => {
  const { name, phoneNumber } = request.body;
  const phoneBook = new PhoneBook({ name, phoneNumber });
  phoneBook
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      // what errors may occur
      // validation error
      // if there an existing phone book entry with the same name, what happens?
      next(error);
    });
});

/*
  Put /api/persons/id
  update the existing phone book entry
*/
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const phoneBookEntry = {
    name: body.name,
    phoneNumber: body.phoneNumber,
  };
  // set {new: true}, or the returned updatePhoneBookEntry will be the origin one rather than the updated version
  // findByIdAndUpdate is implemented base onc findOneAndUpate, which by default does
  // not to execute validation. Therefore, we need to explicitly set it.
  PhoneBook.findByIdAndUpdate(request.params.id, phoneBookEntry, {
    new: true,
    runValidators: true,
  })
    .then((updatePhoneBookEntry) => {
      // if a given id entry is not found, what does it return ?
      // how should the return value be handled in the frontend ?
      console.log("update: ", updatePhoneBookEntry);
      response.json(updatePhoneBookEntry);
    })
    .catch((error) => {
      next(error);
    });
});

// handle erros uniformly in this place.
// move the err handling logic to an error handling middleware
const errorHandle = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    // malformat
    // 400  Bad request
    return response.status(400).send({ error: "malformat Id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  // other reasons for the occurrance of errors
  next(error);
};

// Finally, add the errorHandle middleware.
app.use(errorHandle);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("connect!!!"));
