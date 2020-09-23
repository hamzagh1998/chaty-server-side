const router = require('express').Router()

const { verifyUser, checkUser } = require('../middlewares/jwtAuth')
// Helper functions
const getUser = require('../helpers/getUser')
const getUserChatBox = require('../helpers/getUserChatBox')
const getUserMsgsBox = require('../helpers/getUserMsgsBox')
const checkMsgChatDoc = require('../helpers/checkMsgChatDoc')
const deleteChatMsgBox = require('../helpers/deleteChatMsgBox')

// Get MessagesBox
router.get('/messages', verifyUser, async (req, res) => {
  const messagesBox = await getUserMsgsBox(req.user.id)
  const response = messagesBox ? messagesBox : null
  
  res.json(response)
})

// Get ChatBox
router.get('/chat/:id', verifyUser, async (req, res) => {
  const chatBox = await getUserChatBox(req.params.id, req.user.id)
  chatBox ? res.json(chatBox) : res.sendStatus(403) // Forbidden
})

// Post new message
router.post('/chat', verifyUser, async (req, res) => {
  // Check if the peer id isn't the same is of the user sender
  if (req.user.id.toString() === req.body.peerId) return res.sendStatus(403) // Forbidden

  let response = null
  const messageObj = {user: req.user, message: req.body.message}
  try {
    const peerObj = await getUser(req.body.peerId)
    if (peerObj) {
      const blocked1 = req.user.blockedBy.filter(obj => obj.id.toString() === peerObj.id.toString())
      const blocked2 = peerObj.blockedBy.filter(obj => obj.id.toString() === req.user.id.toString())
      if (blocked1.length === 0 && blocked2.length === 0) {
        // Check if chat/message box already exits or create new one
        const chatBox  = await checkMsgChatDoc(req.user, peerObj, messageObj) 
        if (chatBox) response = chatBox.messages.slice(-1)[0] // Get last message Object
      } else {
        return res.sendStatus(403)
      }
    }
  } catch (err) {
    response = {error: true, msg: `Unexpected error: ${err}`}
  }

  res.json(response)
})

// Delete chatbox and messagebox
router.delete('/chat/:id', verifyUser, async (req, res) => {
  const response = await deleteChatMsgBox(req.user.id, req.params.id)
  response ? res.sendStatus(200) : res.sendStatus(403)
})

module.exports = router