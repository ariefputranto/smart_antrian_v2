function apiRoutes(fastify, opts, next) {
	fastify.get('/', { preValidation: [fastify.authenticate] }, (req, reply) => {
		return req.user
	})

	next()
}

module.exports = apiRoutes