const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '名前の入力は必須です'],
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, 'メールアドレスの入力は必須です'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      '正しい形式のアドレスを入力して下さい',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'パスワードの入力は必須です'],
    minlength: 6,
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getName = function () {
  return this.name;
};

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function(candidatePassword){
  const isMath = await bcrypt.compare(candidatePassword, this.password)
  return isMath
}

module.exports = mongoose.model('User', UserSchema);
