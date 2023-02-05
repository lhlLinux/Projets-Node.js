const mongoose = require('mongoose');
const uniquenessValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniquenessValidator);
module.exports = mongoose.model('User', userSchema);