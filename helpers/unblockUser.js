const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId

async function unblockUser(userId, peerId) {
  let response = false
  try {
    const user = await User.findById(userId)
    const peer = await User.findById(peerId)
    if (user && peer) {
      const blocked = user.blockedBy.filter(obj => obj.id.toString() === peerId)
      if (blocked.length > 0) {
        await User.updateOne(
            {
              'blockedBy.id': ObjectId(peerId)
            },
            {
              '$pull': 
              {
                'blockedBy': {'id': ObjectId(peerId)}
              }
            }, (err, data) => {
              if (err) console.error(err)
            })
        response = true
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    return response
  }
}

module.exports = unblockUser