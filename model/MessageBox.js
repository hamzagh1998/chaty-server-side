const mongoose = require('mongoose')

const MessageBoxSchema = new mongoose.Schema({
  user: {
    Type: Schema.Types.ObjectId,
    ref: require('./User')
  },
  peer: {
    Type: Schema.Types.ObjectId,
    ref: require('./User')
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: require('./ChatBox')
  }
})

module.exports = mongoose.model('MessageBox', MessageBoxSchema)