const mongoose = require('mongoose')

async function connect(url) {
  try {
    const conn = await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    console.log(`Mongodb connected: ${conn.connection.host}`)
  } catch (err) {
    console.log('Error: ', err)
    process.exit(1)
  }
}

module.exports = connect