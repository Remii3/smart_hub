const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  fullName: { type: String, required: true },
});

const AuthorModel = mongoose.model('Author', AuthorSchema);
module.exports = AuthorModel;
