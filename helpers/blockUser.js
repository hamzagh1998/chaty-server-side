const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId

async function blockUser(userId, peerId) {
  let response = false
  try {
    const user = await User.findById(userId)
    const peer = await User.findById(peerId)
    if (user && peer) {
      const blocked = user.blockedBy.filter(obj => obj.id.toString() === peerId)
      if (blocked.length === 0) {
        await user.blockedBy.push({id: ObjectId(peerId)})
        await user.save()
        response = true
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    return response
  }
}

module.exports = blockUser