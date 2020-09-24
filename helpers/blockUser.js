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
        
        const messageBox = await MessageBox.findOne({'user.id': userId, 'peer.id': peerId})
        await messageBox.blockedBy.push({id: ObjectId(peerId)})
        await messageBox.save()

        const chatBox = await ChatBox.findOne({'user.id': userId, 'peer.id': peerId})
        await chatBox.blockedBy.push({id: ObjectId(peerId)})
        await chatBox.save()

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