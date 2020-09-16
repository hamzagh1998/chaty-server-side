const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

const {checkUser, checkIfUserExits} = require('../middlewares/jwtAuth')

// POST: register
router.post('/register', checkIfUserExits, async (req, res) => {
  let msg = null
  let error = false
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await User.create({username: req.body.username, password: hashedPassword})
    msg = "Success!"
  } catch (err) {
    error = true
    msg = `Unexpected error: ${err}`
  }
  res.json({error, msg})
})

// POST: Login rout 
router.post('/login', checkUser, (req, res) => {
  try {
    const token = jwt.sign(req.user, process.env.TOKEN_ACCESS_KEY)
    res.json({ error: false, token })
  } catch (err) {
    res.json({ error: false, msg: `Unexpected error: ${err}` })
  }

})


module.exports = router