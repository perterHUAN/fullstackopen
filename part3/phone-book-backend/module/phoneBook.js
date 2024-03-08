require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
// console.log(process.env.MONGODB_URI);
// const url =
//   "mongodb://root:2222LJMHljmh@dds-2ze78b0241efb5541674-pub.mongodb.rds.aliyuncs.com:3717,dds-2ze78b0241efb5542739-pub.mongodb.rds.aliyuncs.com:3717/admin?replicaSet=mgset-75946545";
console.log("connecting to ", url);

mongoose
  .connect(url)
  .then((result) => console.log("connect to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB:", error.message));

const phoneBookSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});

phoneBookSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("PhoneBook", phoneBookSchema);
