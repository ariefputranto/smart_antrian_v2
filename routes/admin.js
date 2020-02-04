const AuthMiddleware = require('../src/middleware/auth')
const AdminMiddleware = require('../src/middleware/admin')

var UserController = require('../src/controllers/UserController')
var ServiceProviderController = require('../src/controllers/ServiceProviderController')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware)
	fastify.register(AdminMiddleware)

	// initialize controller
	UserController = new UserController(fastify)
	ServiceProviderController = new ServiceProviderController(fastify)

	fastify.get('/', async (req, reply) => {
		return req.user
	})

	// Users
	fastify.get('/user', UserController.listUser)
	fastify.get('/user/:id', UserController.singleUser)
	fastify.put('/user/:id', UserController.updateUser)
	fastify.delete('/user/:id', UserController.deleteUser)
	fastify.post('/user/assign-service-provider', UserController.assignServiceProvider)
	fastify.post('/user/remove-service-provider', UserController.removeServiceProvider)
	fastify.post('/user/change-roles', UserController.changeRoles)

	// Service Provider
	fastify.get('/service-provider', ServiceProviderController.listServiceProvider)
	fastify.get('/service-provider/:id', ServiceProviderController.singleServiceProvider)
	fastify.post('/service-provider', ServiceProviderController.addServiceProvider)
	fastify.put('/service-provider/:id', ServiceProviderController.updateServiceProvider)
	fastify.delete('/service-provider/:id', ServiceProviderController.deleteServiceProvider)
}

module.exports = apiRoutes