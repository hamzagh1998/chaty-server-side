const ChatBox = require('../models/ChatBox')

async function createChatBox(userObj, peerObj, messageObj) {
  let senderChatDoc = null
  try {
    // For the sender
    senderChatDoc = await ChatBox.create({user: userObj, peer: {id: peerObj._id, username: peerObj.username}})
    await senderChatDoc.messages.push(messageObj)
    await senderChatDoc.save()

    // New chatbox doc for the reciever
    const recieverChatDoc = await ChatBox.create({user: {id: peerObj._id, username: peerObj.username}, peer: userObj})
    await recieverChatDoc.messages.push(messageObj)
    await recieverChatDoc.save()
  } catch (err) {
    console.error(err)
  }
  return senderChatDoc
}

module.exports = createChatBox