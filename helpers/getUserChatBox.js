const ChatBox = require('../models/ChatBox')
const MessageBox = require('../models/MessageBox')

async function getUserChatBox(chatId, userId) {
  let chatBox = null
  try {
    chatBox = await ChatBox.findOne({_id: chatId, 'user.id': userId})
    if (chatBox) {
      await MessageBox.updateOne(
        {
          'messages.chatId': chatBox._id // it should be ObjectId
        },
        {'$set': {
          'messages.$.viewed': true
        }}, err => {
          if (err) console.error(err)
        })
    }   
  } catch (err) {
    console.error(err)
  } finally {
    return chatBox
  }
}

module.exports = getUserChatBox