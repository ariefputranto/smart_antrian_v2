'use strict'

global.fastify = require('fastify')({ logger: false })
const mongoose = require('mongoose')

// register
fastify.register(require('../config/config.js'))

// web socket
fastify.ready((err) => {
	if (err) throw err

	console.log('Server started.')
 
 	// init websocket
	fastify.ws.on('connection', require('./controllers/WsController.js'))
})

// init mongodb
mongoose.connect('mongodb://localhost:27017/smart_antrian', { useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('MongoDB connected…'))
 .catch(err => console.log(err))
mongoose.set('useCreateIndex', true)

// route
fastify.register(require('../routes/common.js'))
fastify.register(require('../routes/administrator.js'), { prefix: "api/administrator" })
fastify.register(require('../routes/admin.js'), { prefix: "api/admin" })
fastify.register(require('../routes/user.js'), { prefix: "api/user" })
fastify.register(require('../routes/guest.js'), { prefix: "api/guest" })

// run
fastify.listen(3000, err => {
	if (err) throw err
})