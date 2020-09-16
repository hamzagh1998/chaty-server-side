const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  blockedBy: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}) 

module.exports = mongoose.model('User', UserSchema)