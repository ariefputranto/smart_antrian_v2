'use strict'

const fastify = require('fastify')()

// register jwt auth
fastify.register(require('fastify-jwt'), {
	// AriefPutrantoSmartAntrianProjectTa2020
	secret: 'ca19505eede3d142766672bfd4504fd7'
})

// register websockets
fastify.register(require('fastify-ws'))

fastify.ready(err => {
	if (err) throw err

	console.log('Server started.')
 
	fastify.ws.on('connection', socket => {
		console.log('Client connected.')

		socket.on('message', msg => socket.send("Hi client")) // Creates an echo server
		socket.on('close', () => console.log('Client disconnected.'))
	})
})

// in order to get the user use request.user
fastify.addHook("onRequest", async (request, reply) => {
	try {
		await request.jwtVerify()
	} catch (err) {
		reply.send(err)
	}
})


fastify.post('/signup', (req, reply) => {
	// some code
	const token = fastify.jwt.sign({ payload })
	reply.send({ token })
})
 
fastify.listen(3000, err => {
	if (err) throw err
})