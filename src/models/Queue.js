const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

// another libs
const WebSocket = require('ws')
const moment = require('moment-timezone')

const schema = new mongoose.Schema({
  service_provider_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider'},
  service_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Services'},
  token: String, // imei on guest, _id on user
  code: String,
  number: Number,
  date: String,
  called_loket: {type: mongoose.Schema.Types.ObjectId, ref: 'Loket'},
  called_user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  is_mobile: {type: Boolean, default: false},
  is_fixed: {type: Boolean, default: false},
  is_called: {type: Boolean, default: false},
  time: {type: Date, default: Date.now}
})

schema.index({ service_id: 1, date: 1, number: 1, code: 1 }, { unique: true })
schema.plugin(mongoosePaginate)

// save observer
schema.post('save', function (doc) {
  // init websocket
  fastify.ws.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN && client.room == doc.service_provider_id) {
      client.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'url': '/queue/new', 'queue': doc}}))
    }
  })
})

// update observer
schema.post('updateOne', async function () {
  // get data
  var doc = await this.model.findOne(this.getQuery())

  // count uncalled
  const condition = { 
    service_id: doc.service_id,
    is_called: false,
    date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD') 
  }
  var countQueue = await this.model.countDocuments(condition)
  
  // notify if user called
  if (doc.is_called) {
    fastify.ws.clients.forEach(async function each(client) {
      if (client.readyState === WebSocket.OPEN && client.room == doc.service_provider_id) {
        var lastCall = doc.code + '' + doc.number

        // send to monitor.vue
        var url = '/queue/last-called-by-loket'
        client.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'last_call': lastCall, 'loket': doc.called_loket, 'url': url}}))

        // send to loket.vue
        url = '/queue/last-called'
        client.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'last_call': lastCall, 'url': url}}))

        // send to loket.vue
        url = '/queue/count'
        client.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'count_queue': countQueue, 'url': url}}))
      }
    })
    
  }
})

module.exports = mongoose.model('Queue', schema)