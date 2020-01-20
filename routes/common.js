function apiRoutes(fastify, opts, next) {
	fastify.get('/', (req, reply) => {
		reply.sendFile('index.html')
	})

	fastify.post('/signup', (req, reply) => {
		// some code
		const token = fastify.jwt.sign({ payload })
		reply.send({ token })
	})

	next()
}

module.exports = apiRoutes