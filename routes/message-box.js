const User = require('../models/User')
const router = require('express').Router()

const { verifyUser } = require('../middlewares/jwtAuth')
// Helper functions
const checkPeer = require('../helpers/checkPeer')
const createChatMsgDoc = require('../helpers/createChatMsgDoc')

router.post('/chat', verifyUser, async (req, res) => {
  // Check if the peer id isn't the same is of the user sender
  if (req.user.id.toString() === req.body.peerId) return res.sendStatus(403) // Forbidden

  let response = null
  const messageObj = {user: req.user, message: req.body.message}
  try {
    const peer = await User.findById({_id: req.body.peerId})
    const peerObj = {id: peer._id, username: peer.username, blockedBy: peer.blockedBy}
    // Check if chat box already exits
    const chatBox  = await checkPeer(req.user.id, peerObj.id, messageObj) 
    // Update if chat box Already exists OR Crete New chatbox doc for the sender
    const chatObj = chatBox ? chatBox : await createChatMsgDoc(req.user, peerObj, messageObj)
    if (chatObj) response = chatObj.messages.slice(-1)[0] // Get last message Object
  } catch (err) {
    response = {error: true, msg: "Peer not found"}
  }

  res.json(response)
})

module.exports = router