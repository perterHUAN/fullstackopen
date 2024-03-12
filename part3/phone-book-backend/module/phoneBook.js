const mongoose = require("mongoose");

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
