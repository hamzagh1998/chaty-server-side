const ChatBox = require('../models/ChatBox')
const MessageBox = require('../models/MessageBox')

async function createChatBox(userObj, peerObj, messageObj) {
  let senderChatDoc = null
  let lastMessageObj = null
  const lastUpdate = Date.now()
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
        lastUpdate
      })
    senderMessageDoc.save()

    // ======================= Create New chatbox doc for the reciever =======================
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
        message: lastMessageObj.message,
        lastUpdate
      })
      recieverMessageDoc.save()
  } catch (err) {
    console.error(err)
  }
  return senderChatDoc
}

module.exports = createChatBox