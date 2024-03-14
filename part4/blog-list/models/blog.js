const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0 },
});

// https://mongoosejs.com/docs/api/document.html#Document.prototype.toJSON()
blogSchema.set("toJSON", {
  transform: (doc, ret) => {
    // transform the unqiue identifier into a string representing.
    ret.id = ret._id.toString();
    delete ret._id;
    // we don't require information about the mongodb version.
    delete ret.__v;
    return ret;
  },
});
module.exports = mongoose.model("Blog", blogSchema);
