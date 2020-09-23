const mongoose = require('mongoose')

const ChatBoxSchema = new mongoose.Schema({
  user: {
    type: Object
  },
  peer: {
    type: Object
  },
  messages: {
    type:  [{ user: Object, message: String , dateSended: {type: Date, default: Date.now }}]
  },
  blockedBy: {
    type: Array
  }
})

module.exports = mongoose.model('ChatBox', ChatBoxSchema)