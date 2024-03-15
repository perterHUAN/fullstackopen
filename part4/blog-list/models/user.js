const mongoose = require("mongoose");

// validating the format of the passwordHash is meaningless.
const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\w{3,}/.test(v);
      },
      message: (props) => `username must be at least 3 characters.`,
    },
  },
  passwordHash: { type: String, required: true },
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    // the passwordHash should not be revealed.
    delete ret.passwordHash;

    // not need to return
  },
});
module.exports = mongoose.model("User", userSchema);
