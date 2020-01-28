async function apiRoutes(fastify, opts, next) {
	fastify.get('/', { onRequest: [fastify.authenticate] }, async (req, reply) => {
		return req.user
	})
}

module.exports = apiRoutes