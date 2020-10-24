const User = require('../models/User')

async function getAllUsers() {
 let users = null
  try {
  users = await User.find({})
 } catch (err) {
   console.error(err)
 } finally {
   return users
 }
}

module.exports = getAllUsers