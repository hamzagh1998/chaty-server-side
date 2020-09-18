const MessageBox = require('../models/MessageBox')

async function getUserMsgsBox(userId) {
  let messageBox = null
  try {
    messageBox = await MessageBox.findOne({'user.id': userId})
  } catch (err) {
    console.error(err);
  } finally {
    return messageBox
  }
}


module.exports = getUserMsgsBox