const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  service_provider_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider'},
  service_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Services'},
  assign_user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  name: String,
  token_expiration_time: Number, // in second
  latitude: Number,
  longitude: Number,
  outer_distance: Number,
  inner_distance: Number,
  time: {type: Date, default: Date.now}
})

schema.index({ service_provider_id: 1, name: 1 }, { unique: true })
schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Loket', schema)