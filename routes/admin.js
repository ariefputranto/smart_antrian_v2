var UserController = require('../src/controllers/UserController')
var ServiceProviderController = require('../src/controllers/ServiceProviderController')

async function apiRoutes(fastify, opts, next) {
	UserController = new UserController(fastify)
	ServiceProviderController = new ServiceProviderController(fastify)

	fastify.get('/', { onRequest: [fastify.authenticate] }, async (req, reply) => {
		return req.user
	})

	// Users
	fastify.get('/user', { onRequest: [fastify.authenticate] }, UserController.listUser)
	fastify.get('/user/:id', { onRequest: [fastify.authenticate] }, UserController.singleUser)
	fastify.put('/user/:id', { onRequest: [fastify.authenticate] }, UserController.updateUser)
	fastify.delete('/user/:id', { onRequest: [fastify.authenticate] }, UserController.deleteUser)
	fastify.post('/user/assign-service-provider', { onRequest: [fastify.authenticate] }, UserController.assignServiceProvider)
	fastify.post('/user/remove-service-provider', { onRequest: [fastify.authenticate] }, UserController.removeServiceProvider)
	fastify.post('/user/change-roles', { onRequest: [fastify.authenticate] }, UserController.changeRoles)

	// Service Provider
	fastify.get('/service-provider', { onRequest: [fastify.authenticate] }, ServiceProviderController.listServiceProvider)
	fastify.get('/service-provider/:id', { onRequest: [fastify.authenticate] }, ServiceProviderController.singleServiceProvider)
	fastify.post('/service-provider', { onRequest: [fastify.authenticate] }, ServiceProviderController.addServiceProvider)
	fastify.put('/service-provider/:id', { onRequest: [fastify.authenticate] }, ServiceProviderController.updateServiceProvider)
	fastify.delete('/service-provider/:id', { onRequest: [fastify.authenticate] }, ServiceProviderController.deleteServiceProvider)
}

module.exports = apiRoutes