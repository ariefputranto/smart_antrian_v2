const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  service_provider_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider'},
  name: String,
  description: String,
  number_loket: {type: Number, default: 1},
  code: String,
  time: {type: Date, default: Date.now}
})

schema.index({ service_provider_id: 1, name: 1 }, { unique: true })
schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Services', schema)