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

// add validator
const phoneBookSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  phoneNumber: {
    type: String,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
    require: true,
  },
});

phoneBookSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("PhoneBook", phoneBookSchema);