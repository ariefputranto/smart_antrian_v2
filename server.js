'use strict'

const fastify = require('fastify')({ logger: true })
const path = require('path')

// register
fastify.register(require('fastify-ws'))
fastify.register(require('./config/jwt_auth.js'))
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
})

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

// route
fastify.register(require('./routes/common.js'))
fastify.register(require('./routes/admin.js'), { prefix: "admin" })
fastify.register(require('./routes/user.js'), { prefix: "user" })

// run
fastify.listen(3000, err => {
	if (err) throw err
})