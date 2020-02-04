const AuthMiddleware = require('../src/middleware/auth')
const AdministratorMiddleware = require('../src/middleware/administrator')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware);
	fastify.register(AdministratorMiddleware);
	
	fastify.get('/', async (req, reply) => {
		return req.user
	})
}

module.exports = apiRoutes