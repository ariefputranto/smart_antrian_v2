const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  roles: {type: Number, default: 1},
  time: Date
})

schema.plugin(mongoosePaginate);


module.exports = mongoose.model('Users', schema)