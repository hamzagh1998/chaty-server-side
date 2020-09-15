const mongoose = require('mongoose')

const ChatBoxSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: require('./User')
  },
  peer: {
    Type: Schema.Types.ObjectId,
    ref: require('./User')
  },
  messages: {
    type: Array,
    default: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: require('./User')
        },
        message: {
          type: String,
        }
      }
    ]
  }
})

module.exports = mongoose.model('ChatBox', ChatBoxSchema)