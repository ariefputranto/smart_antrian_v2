const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema({
  service_provider_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider'},
  service_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Services'},
  token: String, // imei on guest, _id on user
  code: String,
  number: Number,
  date: String,
  called_loket: String,
  called_user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  is_hold: {type: Boolean, default: false},
  is_called: {type: Boolean, default: false},
  time: {type: Date, default: Date.now}
})

schema.index({ service_id: 1, date: 1, number: 1, code: 1 }, { unique: true })
schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Queue', schema)