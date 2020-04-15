const AuthMiddleware = require('../src/middleware/auth')
const UserMiddleware = require('../src/middleware/user')

var LoketController = require('../src/controllers/LoketController')
var ServicesController = require('../src/controllers/ServicesController')
var QueueController = require('../src/controllers/QueueController')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware);
	fastify.register(UserMiddleware);

	// initialize controller
	LoketController = new LoketController()
	ServicesController = new ServicesController()
	QueueController = new QueueController()
	
	fastify.get('/', async (req, reply) => {
		return {'statusCode': 200, 'message': '', 'data': req.user}
	})

	// Loket
	fastify.get('/loket', LoketController.listLoketUser)
	fastify.get('/loket/check-assigned-user', LoketController.checkAssignedUser)
	fastify.put('/loket/:id', LoketController.updateLoket)

	// Services
	fastify.get('/services', ServicesController.listAllServices)

	// Queue
	fastify.post('/queue/last', QueueController.getQueue)
}

module.exports = apiRoutes