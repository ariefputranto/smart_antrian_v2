const AuthMiddleware = require('../src/middleware/auth')

var ServiceProviderController = require('../src/controllers/ServiceProviderController')
var ServicesController = require('../src/controllers/ServicesController')
var QueueController = require('../src/controllers/QueueController')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware);

	// initialize controller
	ServiceProviderController = new ServiceProviderController()
	ServicesController = new ServicesController()
	QueueController = new QueueController()
	
	fastify.get('/', async (req, reply) => {
		return {'statusCode': 200, 'message': '', 'data': req.user}
	})

	// Service Provider
	fastify.get('/service-provider', ServiceProviderController.listUserServiceProvider)

	// Services
	fastify.get('/services-by-provider/:service_provider', ServicesController.listAllServicesByProvider)

	// Queue
	fastify.post('/queue/last', QueueController.getQueue)
	fastify.post('/queue/call', QueueController.callQueue)
	fastify.get('/queue/get-list/:id', QueueController.getListQueue)
	fastify.post('/queue/get-hold', QueueController.holdQueue)
	fastify.post('/queue/get-fixed', QueueController.fixedQueue)
	fastify.post('/queue/cancel', QueueController.cancelQueue)
}

module.exports = apiRoutes