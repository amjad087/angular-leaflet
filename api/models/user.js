const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // by defaulat mongoose does not throw an error
                                                              // on duplicate values for a unique field. by using
                                                              // unique validator (a third party package), we get
                                                              // an error on duplicate values for unique fields

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);  // use unique validator as a plugin for user schema

module.exports = mongoose.model('User', userSchema);
