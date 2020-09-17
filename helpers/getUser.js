const User = require('../models/User')

async function getUser(userId) {
  let userObj = null
  try {
    const user = await User.findById({_id: userId})
    userObj = {id: user._id, username: user.username}
  } catch (err) {
    console.error(err)
  } finally {
    return userObj
  }
}

module.exports = getUser