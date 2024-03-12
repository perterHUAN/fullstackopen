const mongoose = require("mongoose");
const PhoneBook = require("./module/phoneBook");
/*
    what to do based on the length of parameters
    
    node <filename> <password>
    show all entries

    node <filename> <password> <name> <phone number>
    add a new entry based on the values of name and phone number parameters.
*/
if (process.argv.length < 3) {
  console.log("must be 2 or more parameters");
  return 0;
}
const password = process.argv[2];

const url =
  `mongodb://root:${password}@dds-2ze78b0241efb5541674-pub.mongodb.rds.aliyuncs.com:3717,dds-2ze78b0241efb5542739-pub.mongodb.rds.aliyuncs.com:3717/admin?replicaSet=mgset-75946545`;

mongoose
  .connect(url)
  .then(() => console.log("connect successful!"))
  .catch((error) => console.log("connect error", error));

if (process.argv.length === 3) {
  PhoneBook.find({}).then((result) => {
    console.log("phonebook:");

    result.forEach((person) => {
      console.log(`${person.name.padEnd(20)} ${person.phoneNumber}`);
    });
    mongoose.connection.close();
    process.exit(1);
  });
} else if (process.argv.length === 5) {
  const person = new PhoneBook({
    name: process.argv[3],
    PhoneNumber: process.argv[4],
  });

  person.save().then(() => {
    console.log("person saved!");
    mongoose.connection.close();
    process.exit(1);
  });
}
