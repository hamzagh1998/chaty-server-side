const User = require('../models/User')
const router = require('express').Router()

const { verifyUser } = require('../middlewares/jwtAuth')
// Helper functions
const checkPeer = require('../helpers/checkPeer')
const createChatBox = require('../helpers/createChatBox')

router.post('/chat', verifyUser, async (req, res) => {
  // Check if the peer id isn't the same is of the user sender
  if (req.user.id.toString() === req.body.peerId) return res.sendStatus(403) // Forbidden

  let response = null
  const messageObj = {user: req.user, message: req.body.message}
  try {
    const peer = await User.findById({_id: req.body.peerId})
    // Check if chat box already exits
    const chatBox  = await checkPeer(req.user.id, peer._id, messageObj) 
    // Update if chat box Already exists OR Crete New chatbox doc for the sender
    response = chatBox ? chatBox : await createChatBox(req.user, peer, messageObj)
  } catch (err) {
    response = {error: true, msg: "Peer not found"}
  }

  res.json(response)
})

module.exports = router