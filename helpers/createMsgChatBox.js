const ChatBox = require('../models/ChatBox')
const MessageBox = require('../models/MessageBox')

const getUserMsgsBox = require('./getUserMsgsBox')

async function createMsgChatBox(userObj, peerObj, messageObj, viewed=false) {
  let senderChatDoc = null
  try {
     // ======================= Create new chatbox For the sender =======================
     senderChatDoc = await ChatBox.create(
      {
        user: userObj, peer: peerObj
      })
    await senderChatDoc.messages.push(messageObj)
    await senderChatDoc.save()
    // Get last Message from the chetbox
    let lastMessageObj = senderChatDoc.messages.slice(-1)[0]
    // Check if the sender MessageBox Doc Already exists
    let senderMessageDoc = await getUserMsgsBox(userObj.id)
    if (senderMessageDoc) {
      await senderMessageDoc.messages.push({
        chatId: senderChatDoc._id, 
        peerId: peerObj.id, 
        peerName: peerObj.username, 
        senderId: lastMessageObj.user.id,
        senderName: lastMessageObj.user.username, 
        lastMessage: lastMessageObj.message,
        viewed: viewed,
        lastUpdate: Date.now()
      })
      await senderMessageDoc.save()
    } else {
      // Create new messagebox For the sender
      senderMessageDoc = await MessageBox.create({user: userObj})
      await senderMessageDoc.messages.push(
        {
          chatId: senderChatDoc._id, 
          peerId: peerObj.id, 
          peerName: peerObj.username, 
          senderId: lastMessageObj.user.id,
          senderName: lastMessageObj.user.username, 
          lastMessage: lastMessageObj.message,
          viewed: viewed,
          lastUpdate: Date.now()
        })
      await senderMessageDoc.save()
    }
    
  } catch (err) {
    console.error(err)
  } finally {
    return senderChatDoc
  }
}

module.exports = createMsgChatBox