const ChatBox = require('../models/ChatBox')
const MessageBox = require('../models/MessageBox')

const createSenderMsgChatBox = require('./createSenderMsgChatBox')
const createRecieverMsgChatBox = require('./createRecieverMsgChatBox')


async function checkPeer(userObj, peerObj, messageObj) {
  const userId = userObj.id
  const peerId = peerObj.id
  let senderChatDoc = null
  const lastUpdate = Date.now()
    try {
      // ======================= Update the document for the sender =======================
      senderChatDoc = await ChatBox.findOne({'user.id': userId, 'peer.id': peerId})
      if (senderChatDoc) {
        await senderChatDoc.messages.push(messageObj)
        await senderChatDoc.save()
        // Update message box for the sender
        await MessageBox.updateOne(
          {
            'messages.chatId': senderChatDoc._id
          }, 
          {'$set': {
            'messages.$.senderId': messageObj.user.id,
            'messages.$.senderName': messageObj.user.username,
            'messages.$.lastMessage': messageObj.message,
            'messages.$.lastUpdate': lastUpdate
          }}, err => {
            if (err) console.error(err)
          }) // Find Message Object inside messages Array
      } else {
        senderChatDoc = await createSenderMsgChatBox(userObj, peerObj, messageObj)
      }
      // ======================= Update the document for the reciever =======================
      const recieverChatDoc = await ChatBox.findOne({'user.id': peerId, 'peer.id': userId})
      if (recieverChatDoc) {
        await recieverChatDoc.messages.push(messageObj)
        await recieverChatDoc.save()
        // Update message box for the reciever
        await MessageBox.updateOne(
          {
            'messages.chatId': recieverChatDoc._id
          }, 
          {'$set': {
            'messages.$.senderId': messageObj.user.id,
            'messages.$.senderName': messageObj.user.username,
            'messages.$.lastMessage': messageObj.message,
            'messages.$.lastUpdate': lastUpdate
          }}, err => {
            if (err) console.error(err)
          }) // Find Message Object inside messages Array
        
      } else { // in case one of users delete his chatbox doc
        createRecieverMsgChatBox(userObj, peerObj, messageObj)
      }
    } catch (err) {
      console.error(err)
    } finally {
      return senderChatDoc
    }
}

module.exports = checkPeer