const User = require('../models/User')
const router = require('express').Router()

const { verifyUser } = require('../middlewares/jwtAuth')
// Helper function
const checkPeer = require('../helpers/checkPeer')
const createChatBox = require('../helpers/createChatBox')

router.post('/chat', verifyUser, async (req, res) => {
  // Check if the peer id isn't the same is of the user sender
  if (req.user.id.toString() === req.body.peerId) return res.sendStatus(403) // Forbidden

  let senderChatDoc = null
  const messageObj = {user: req.user, message: req.body.message}
  const peer = await User.findById({_id: req.body.peerId})
  const chatBox  = await checkPeer(req.user.id, peer._id, messageObj) // Check if chat box already exits
  if (chatBox) { // If chat box Already exists
    senderChatDoc = chatBox
  } else { // New chatbox doc for the sender
    senderChatDoc = await createChatBox(req.user, peer, messageObj)
  }
  res.json(senderChatDoc)
})

module.exports = router