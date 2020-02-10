const AuthMiddleware = require('../src/middleware/auth')
const AdminMiddleware = require('../src/middleware/admin')

var UserController = require('../src/controllers/UserController')
var ServicesController = require('../src/controllers/ServicesController')
var LoketController = require('../src/controllers/LoketController')
var QueueController = require('../src/controllers/QueueController')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware)
	fastify.register(AdminMiddleware)

	// initialize controller
	UserController = new UserController(fastify)
	ServicesController = new ServicesController()
	LoketController = new LoketController()
	QueueController = new QueueController()

	fastify.get('/', async (req, reply) => {
		return req.user
	})

	// Users
	fastify.get('/user', UserController.listUserAdmin)
	fastify.post('/user', UserController.addUserAdmin)
	fastify.get('/user/:id', UserController.singleUserAdmin)
	fastify.put('/user/:id', UserController.updateUserAdmin)
	fastify.delete('/user/:id', UserController.deleteUserAdmin)

	// Services
	fastify.get('/services', ServicesController.listServices)
	fastify.get('/services/:id', ServicesController.singleServices)
	fastify.post('/services', ServicesController.addServices)
	fastify.put('/services/:id', ServicesController.updateServices)
	fastify.delete('/services/:id', ServicesController.deleteServices)

	// Loket
	fastify.get('/loket', LoketController.listLoket)
	fastify.get('/loket/:id', LoketController.singleLoket)
	fastify.post('/loket', LoketController.addLoket)
	fastify.put('/loket/:id', LoketController.updateLoket)
	fastify.delete('/loket/:id', LoketController.deleteLoket)

	// Queue
	fastify.get('/queue', QueueController.listQueue)
	fastify.post('/queue/last', QueueController.getQueue)
	fastify.post('/queue/call', QueueController.callQueue)

}

module.exports = apiRoutes