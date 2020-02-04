const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  service_provider_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider'},
  time: {type: Date, default: Date.now}
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model('UserServiceProvider', schema)