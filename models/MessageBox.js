const mongoose = require('mongoose')

const MessageBoxSchema = new mongoose.Schema({
  user: {
    type: Object,
  },
  messages: {
    type: Array
  },
  viewed: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('MessageBox', MessageBoxSchema)