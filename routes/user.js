const AuthMiddleware = require('../src/middleware/auth')
const UserMiddleware = require('../src/middleware/user')

var LoketController = require('../src/controllers/LoketController')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware);
	fastify.register(UserMiddleware);

	// initialize controller
	LoketController = new LoketController()
	
	fastify.get('/', async (req, reply) => {
		return req.user
	})

	// Loket
	fastify.get('/loket', LoketController.listLoketUser)
	fastify.get('/loket/check-assigned-user', LoketController.checkAssignedUser)
}

module.exports = apiRoutes