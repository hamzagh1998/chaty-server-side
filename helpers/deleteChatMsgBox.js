const MessageBox = require('../models/MessageBox')
const ChatBox = require('../models/ChatBox')

async function deleteChatMsgBox(userId, chatId) {
  let response = false
  try {
    const chatBox = await ChatBox.findOne({_id: chatId, 'user.id': userId})
    if (chatBox) {
      await MessageBox.updateOne(
        {
          'messages.chatId': chatBox._id
        }, 
        {'$pull': 
          {
            'messages': {'chatId': chatBox._id}
          }
        }, err => {
          if (err) console.error(err)
        })
      await ChatBox.deleteOne({_id: chatId})
      response = true
    }
  } catch (err) {
    console.error(err)
  } finally {
    return response
  }
}

module.exports = deleteChatMsgBox