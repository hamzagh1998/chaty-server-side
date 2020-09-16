const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = {
  async checkUser(req, res, next) {
    try {
      const username  = req.body.username
      const hashedPassword  = req.body.password
      // Get user from db
      const user = await User.findOne({username: username})
      if (user) {
        const password = await bcrypt.compare(hashedPassword, user.password)
        if (password) {
          req.user = {id: user._id, username: user.name, blockedBy: user.blockedBy} 
          next()
        }
        else res.json({error: true, msg: 'Invalid password!'})
      } else res.json({error: true, msg: 'Invalid username!'})
    } catch (err) {
      res.json({error: true, msg: `Unexpected error: ${err}`})
    }
  },
  async checkIfUserExits(req, res, next) {
    try {
      const username = req.body.username
      // Check if username Already exits
      const user = await User.findOne({ username: username })
      if (user) {
        res.json({error: true, msg: "This username Already exists!"})
      } else {
        next()
      }
    } catch (err) {
      res.json({error: true, msg: `Unexpected error: ${err}`})
    }
  },
  async verifyUser(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded  = jwt.verify(token, process.env.TOKEN_ACCESS_KEY)
      if (decoded ) {
        const user = await User.findById({_id: decoded.id})
        if (user) {
          req.user = {id: user._id, username: user.username, blockedBy: user.blockedBy}
          next()
        } else {
          res.sendStatus(401)
        }
      } else {
        res.sendStatus(400)
      }
    } catch (err) {
      res.json({error: true, msg: `Unexpected error: ${err}`})
    }
  }
}