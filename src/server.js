'use strict'

const fastify = require('fastify')({ logger: true })
const mongoose = require('mongoose')

// register
fastify.register(require('../config/config.js'))

// web socket
fastify.ready(err => {
	if (err) throw err

	console.log('Server started.')
 
	fastify.ws.on('connection', socket => {
		console.log('Client connected.')

		socket.on('message', msg => socket.send("Hi client")) // Creates an echo server
		socket.on('close', () => console.log('Client disconnected.'))
	})
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

// run
fastify.listen(3000, err => {
	if (err) throw err
})