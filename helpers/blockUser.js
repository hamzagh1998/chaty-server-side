const User = require('../models/User')
const MessageBox = require('../models/MessageBox')
const ChatBox = require('../models/ChatBox')
const ObjectId = require('mongoose').Types.ObjectId

async function blockUser(userId, peerId) {
  let response = false
  try {
    const user = await User.findById(userId)
    const peer = await User.findById(peerId)
    if (user && peer) {
      const blocked = user.blockedBy.filter(obj => obj.id.toString() === peerId) // if Peer is already exists
      if (blocked.length === 0) {
        await user.blockedBy.push({id: ObjectId(peerId)})
        await user.save()
        
        const messageBoxs = await MessageBox.find({'user.id': userId})
        await messageBoxs.forEach(box => {
          box.blockedBy.push({id: ObjectId(peerId)})
          box.save()
        })

        const chatBoxs = await ChatBox.find({'user.id': userId})
        await chatBoxs.forEach(box => {
          box.blockedBy.push({id: ObjectId(peerId)})
          box.save()
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

module.exports = blockUser