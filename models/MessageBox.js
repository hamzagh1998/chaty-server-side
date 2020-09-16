const mongoose = require('mongoose')

const MessageBoxSchema = new mongoose.Schema({
  user: {
    type: Object,
  },
  lastMessages: {
    type: [{ peer: Object, message: String }]
  }
})

module.exports = mongoose.model('MessageBox', MessageBoxSchema)