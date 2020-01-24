const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  service_provider_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider'},
  service_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Services'},
  token: Number,
  number: Number,
  is_hold: {type: Boolean, default: false},
  is_called: {type: Boolean, default: false},
  time: Date
})

module.exports = mongoose.model('Queue', schema)