const AuthMiddleware = require('../src/middleware/auth')
const AdministratorMiddleware = require('../src/middleware/administrator')

var UserController = require('../src/controllers/UserController')
var ServiceProviderController = require('../src/controllers/ServiceProviderController')
var UserServiceProviderController = require('../src/controllers/UserServiceProviderController')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware);
	fastify.register(AdministratorMiddleware);

	// initialize controller
	UserController = new UserController()
	ServiceProviderController = new ServiceProviderController(fastify)
	UserServiceProviderController = new UserServiceProviderController(fastify)
	
	fastify.get('/', async (req, reply) => {
		return req.user
	})

	// Users
	fastify.get('/user', UserController.listUser)
	fastify.post('/user', UserController.addUser)
	fastify.get('/user/:id', UserController.singleUser)
	fastify.put('/user/:id', UserController.updateUser)
	fastify.delete('/user/:id', UserController.deleteUser)
	fastify.post('/user/change-roles', UserController.changeRoles)

	// Service Provider
	fastify.get('/service-provider', ServiceProviderController.listServiceProvider)
	fastify.get('/service-provider/all', ServiceProviderController.listUserServiceProvider)
	fastify.get('/service-provider/:id', ServiceProviderController.singleServiceProvider)
	fastify.post('/service-provider', ServiceProviderController.addServiceProvider)
	fastify.put('/service-provider/:id', ServiceProviderController.updateServiceProvider)
	fastify.delete('/service-provider/:id', ServiceProviderController.deleteServiceProvider)

	// User Service Provider
	fastify.get('/user-service-provider', UserServiceProviderController.listUserServiceProvider)
	fastify.get('/user-service-provider/user/:id', UserServiceProviderController.singleUserServiceProviderByUser)
	fastify.get('/user-service-provider/service-provider/:id', UserServiceProviderController.listUserServiceProviderByServiceProvider)
	fastify.post('/user-service-provider/assign', UserServiceProviderController.assignUserServiceProvider)
	fastify.post('/user-service-provider/remove', UserServiceProviderController.removeUserServiceProvider)
	fastify.post('/user-service-provider/change', UserServiceProviderController.changeUserServiceProvider)
}

module.exports = apiRoutes