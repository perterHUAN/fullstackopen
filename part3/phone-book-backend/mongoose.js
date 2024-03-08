const mongoose = require("mongoose");

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
const [, , password, name, phoneNumber] = process.argv;

const url =
  "mongodb://root:<password>@dds-2ze78b0241efb5541674-pub.mongodb.rds.aliyuncs.com:3717,dds-2ze78b0241efb5542739-pub.mongodb.rds.aliyuncs.com:3717/admin?replicaSet=mgset-75946545";

async function connectThenAddOrQuery() {
  const schema = new mongoose.Schema({ name: String, phoneNumber: String });
  const PhoneBook = mongoose.model("PhoneBook", schema);
  try {
    await mongoose.connect(url.replace(/<password>/, password));
    console.log("connect successful!!!");

    if (name && phoneNumber) {
      const entry = new PhoneBook({ name, phoneNumber });
      try {
        await entry.save().then((result) => console.log("insert OK", result));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await PhoneBook.find({}).then((result) => {
          result.forEach((item) => console.log(result));
        });
      } catch (error) {
        console.log(error);
      }
    }

    await mongoose.connection.close();
    console.log("close successul!!!");
  } catch (error) {
    console.log(error);
  }
}

connectThenAddOrQuery();
