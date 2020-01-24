const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  service_provider_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider'},
  time: Date
})

module.exports = mongoose.model('UserServiceProvider', schema)