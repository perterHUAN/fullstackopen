const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  passwordHash: String,
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
