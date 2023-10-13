const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
