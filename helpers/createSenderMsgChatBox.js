const ChatBox = require('../models/ChatBox')
const MessageBox = require('../models/MessageBox')

async function createSenderMsgChatBox(userObj, peerObj, messageObj) {
  let senderChatDoc = null
  try {
     // ======================= Create new chatbox For the sender =======================
     senderChatDoc = await ChatBox.create(
      {
        user: userObj, peer: peerObj
      })
    await senderChatDoc.messages.push(messageObj)
    await senderChatDoc.save()
    // Create new messagebox For the sender
    lastMessageObj = senderChatDoc.messages.slice(-1)[0]
    const senderMessageDoc = await MessageBox.create({user: userObj})
    senderMessageDoc.messages.push(
      {
        chatId: senderChatDoc._id, 
        peerId: peerObj.id, 
        peerName: peerObj.username, 
        senderId: lastMessageObj.user.id,
        senderName: lastMessageObj.user.username, 
        lastMessage: lastMessageObj.message,
        viewed: false,
        lastUpdate: Date.now()
      })
    senderMessageDoc.save()
  } catch (err) {
    console.error(err)
  } finally {
    return senderChatDoc
  }
}

module.exports = createSenderMsgChatBox