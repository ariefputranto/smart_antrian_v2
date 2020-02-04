const AuthMiddleware = require('../src/middleware/auth')
const AdminMiddleware = require('../src/middleware/admin')

var UserController = require('../src/controllers/UserController')
var ServiceProviderController = require('../src/controllers/ServiceProviderController')
var UserServiceProviderController = require('../src/controllers/UserServiceProviderController')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware)
	fastify.register(AdminMiddleware)

	// initialize controller
	UserController = new UserController(fastify)
	ServiceProviderController = new ServiceProviderController(fastify)
	UserServiceProviderController = new UserServiceProviderController(fastify)

	fastify.get('/', async (req, reply) => {
		return req.user
	})
}

module.exports = apiRoutes