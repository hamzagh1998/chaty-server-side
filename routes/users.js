const router = require('express').Router()

const { verifyUser } = require('../middlewares/jwtAuth')

// helper function
const getAllUsers = require('../helpers/getAllUsers')
const unblockUser = require('../helpers/unblockUser')
const blockUser = require('../helpers/blockUser')

// Get all users
router.get('/all', verifyUser, async (req, res) => {
  const response = []
  const users = await getAllUsers()
  users.forEach(userObj => response.push({id: userObj._id, username: userObj.username}))
  res.json(response)
})

// Block user
router.post('/block', verifyUser, async (req, res) => {
  const response = blockUser(req.user.id, req.body.peerId)
  if (response) res.json({error: false, msg: 'User had been blocked!'})
  else res.json({error: true, msg: 'Failed please check peer id!'})
})

router.post('/unblock', verifyUser, async (req, res) => {
  const response = unblockUser(req.user.id, req.body.peerId)
  if (response) res.json({error: false, msg: 'User had been unblocked!'})
  else res.json({error: true, msg: 'Failed please check peer id!'})
})

module.exports = router