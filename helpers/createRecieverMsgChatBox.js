const ChatBox = require('../models/ChatBox')
const MessageBox = require('../models/MessageBox')

const getUserMsgsBox = require('./getUserMsgsBox')

async function createRecieverMsgChatBox(userObj, peerObj, messageObj) {
  try {
    const recieverChatDoc = await ChatBox.create(
      {
        user: peerObj, peer: userObj
      })
    await recieverChatDoc.messages.push(messageObj)
    await recieverChatDoc.save()
    // Get last Message from the chetbox
    let lastMessageObj = recieverChatDoc.messages.slice(-1)[0]
    // Check if the sender MessageBox Doc Already exists
    let recieverMessageDoc = await getUserMsgsBox(peerObj.id)
    if (recieverMessageDoc) {
      await recieverMessageDoc.messages.push(
        {
          chatId: recieverChatDoc._id, 
          peerId: userObj.id, 
          peerName: userObj.username, 
          senderId: lastMessageObj.user.id,
          senderName: lastMessageObj.user.username, 
          lastMessage: lastMessageObj.message,
          viewed: false,
          lastUpdate: Date.now()
        })
      await recieverMessageDoc.save()
    } else {
      // Create new messagebox For the reciever
      recieverMessageDoc = await MessageBox.create({user: peerObj})
      await recieverMessageDoc.messages.push(
        {
          chatId: recieverChatDoc._id, 
          peerId: userObj.id, 
          peerName: userObj.username, 
          senderId: lastMessageObj.user.id,
          senderName: lastMessageObj.user.username, 
          lastMessage: lastMessageObj.message,
          viewed: false,
          lastUpdate: Date.now()
        })
        await recieverMessageDoc.save()
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = createRecieverMsgChatBox
