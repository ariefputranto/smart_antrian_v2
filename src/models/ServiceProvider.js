const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema({
  name: String,
  description: String,
  type: String,
  icon: String,
  latitude: Number,
  longitude: Number,
  outer_distance: Number,
  inner_distance: Number,
  time: {type: Date, default: Date.now}
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model('ServiceProvider', schema)