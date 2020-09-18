const router = require('express').Router()

const { verifyUser, checkUser } = require('../middlewares/jwtAuth')
// Helper functions
const getUser = require('../helpers/getUser')
const checkMsgChatDoc = require('../helpers/checkMsgChatDoc')
const getUserMsgsBox = require('../helpers/getUserMsgsBox')

router.get('/messages', verifyUser, async (req, res) => {
  const messagesBox = await getUserMsgsBox(req.user.id)
  const response = messagesBox ? messagesBox.messages : null
  
  res.json(response)
})


router.post('/chat', verifyUser, async (req, res) => {
  // Check if the peer id isn't the same is of the user sender
  if (req.user.id.toString() === req.body.peerId) return res.sendStatus(403) // Forbidden

  let response = null
  const messageObj = {user: req.user, message: req.body.message}
  try {
    const peerObj = await getUser(req.body.peerId)
    if (peerObj) {
      // Check if chat/message box already exits or create new one
      const chatBox  = await checkMsgChatDoc(req.user, peerObj, messageObj) 
      if (chatBox) response = chatBox.messages.slice(-1)[0] // Get last message Object
    }
  } catch (err) {
    response = {error: true, msg: err}
  }

  res.json(response)
})

module.exports = router