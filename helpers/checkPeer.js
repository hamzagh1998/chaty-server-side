const ChatBox = require('../models/ChatBox')

async function checkPeer(userId, peerId, messageObj) {
  let senderChatDoc = null
    // Update the document for the sender
    senderChatDoc = await ChatBox.findOne({'user.id': userId, 'peer.id': peerId})
    if (senderChatDoc) {
      await senderChatDoc.messages.push(messageObj)
      await senderChatDoc.save()
    }
    // Update the document for the reciever
    recieverChatDoc = await ChatBox.findOne({'user.id': peerId, 'peer.id': userId})
    if (recieverChatDoc) {
      await recieverChatDoc.messages.push(messageObj)
      await recieverChatDoc.save()
    }
    return senderChatDoc
}

module.exports = checkPeer