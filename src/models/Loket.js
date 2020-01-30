const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  service_provider_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider'},
  service_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Services'},
  assign_user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: String,
  token_expiration_time: Number, // in second
  time: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Loket', schema)