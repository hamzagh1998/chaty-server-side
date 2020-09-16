const User = require('../models/User')
const ChatBox = require('../models/ChatBox')
const router = require('express').Router()

const { verifyUser } = require('../middlewares/jwtAuth')
const checkPeer = require('../helpers/checkPeer')

router.post('/chat', verifyUser, async (req, res) => {
  if (req.user.id.toString() === req.body.peerId) return res.sendStatus(403)

  const messageObj = {user: req.user, message: req.body.message}
  const peer = await User.findById({_id: req.body.peerId})
  let senderChatDoc = await checkPeer(req.user.id, peer._id, messageObj) // Check if chat box already exits
  if (senderChatDoc) { // If chat box Already exists
    return res.json(senderChatDoc)
  } else { // New chatbox doc for the sender
    // For the sender
    senderChatDoc = await ChatBox.create({user: req.user, peer: {id: peer._id, username: peer.username}})
    await senderChatDoc.messages.push(messageObj)
    await senderChatDoc.save()

    // New chatbox doc for the reciever
    const recieverChatDoc = await ChatBox.create({user: {id: peer._id, username: peer.username}, peer: req.user})
    await recieverChatDoc.messages.push(messageObj)
    await recieverChatDoc.save()
    
    return res.json(senderChatDoc)
  }
  
})

module.exports = router