const mongoose = require('mongoose')

const MessageBoxSchema = new mongoose.Schema({
  user: {
    type: Object,
  },
  messages: {
    type: Array
  },
  blockedBy: {
    type: Array
  }
})

module.exports = mongoose.model('MessageBox', MessageBoxSchema)