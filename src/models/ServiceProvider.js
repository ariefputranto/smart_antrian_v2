const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  description: String,
  type: String,
  icon: String,
  time: Date
})

module.exports = mongoose.model('ServiceProvider', schema)