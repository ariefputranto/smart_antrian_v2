const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  service_provider_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider'},
  name: String,
  description: String,
  number_counter: {type:Number, default:1},
  code: String,
  time: Date
})

module.exports = mongoose.model('Services', schema)