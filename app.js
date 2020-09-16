const express = require('express')
const morgan = require('morgan')
const connect = require('./config/db')

const app = express()

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: './config/.env' })
  app.use(morgan('dev'))
  connect(process.env.MONGO_DEV_URL)
} else {
  connect(process.env.MONGO_PRO_URL)
}

// ----------------------------------- middleware -----------------------------------
// Body parser
app.use(express.json())

// Routes
app.get('/', (req, res, next) => res.send("It's working!"))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/box', require('./routes/message-box'))

// ----------------------------------- middleware -----------------------------------
const port = process.env.PORT || 4000
app.listen(port, console.log(`Server run on port: ${port} in ${process.env.NODE_ENV} mode`))