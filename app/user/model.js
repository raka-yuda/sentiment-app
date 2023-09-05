const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, 'Email harus diisi']
  },
  name: {
    type: String,
    require: [true, 'Nama harus diisi']
  },
  password: {
    type: String,
    require: [true, 'Kata sandi harus diisi']
  },
  interest: {
    type: String,
    require: [true, 'Minat harus diisi']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  phoneNumber: {
    type: String,
  },

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
