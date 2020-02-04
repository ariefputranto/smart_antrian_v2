const AuthMiddleware = require('../src/middleware/auth')
const UserMiddleware = require('../src/middleware/user')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware);
	fastify.register(UserMiddleware);
	
	fastify.get('/', async (req, reply) => {
		return req.user
	})
}

module.exports = apiRoutes