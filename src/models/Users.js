const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  roles: {type: String, default: 1},
  time: Date
})

module.exports = mongoose.model('Users', schema)