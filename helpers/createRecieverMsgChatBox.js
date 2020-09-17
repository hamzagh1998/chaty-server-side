const ChatBox = require('../models/ChatBox')
const MessageBox = require('../models/MessageBox')

async function createRecieverMsgChatBox(userObj, peerObj, messageObj) {
  try {
    const recieverChatDoc = await ChatBox.create(
      {
        user: peerObj, peer: userObj
      })
    await recieverChatDoc.messages.push(messageObj)
    await recieverChatDoc.save()
    // Create new messagebox For the reciever
    lastMessageObj = recieverChatDoc.messages.slice(-1)[0]
    const recieverMessageDoc = await MessageBox.create({user: peerObj})
    recieverMessageDoc.messages.push(
      {
        chatId: recieverChatDoc._id, 
        peerId: userObj.id, 
        peerName: userObj.username, 
        senderId: lastMessageObj.user.id,
        senderName: lastMessageObj.user.username, 
        lastMessage: lastMessageObj.message,
        lastUpdate: Date.now()
      })
      recieverMessageDoc.save()
  } catch (err) {
    console.error(err)
  }
}

module.exports = createRecieverMsgChatBox