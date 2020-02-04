const AuthMiddleware = require('../src/middleware/auth')
const AdminMiddleware = require('../src/middleware/admin')

var ServicesController = require('../src/controllers/ServicesController')
var LoketController = require('../src/controllers/LoketController')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware)
	fastify.register(AdminMiddleware)

	// initialize controller
	ServicesController = new ServicesController()
	LoketController = new LoketController()

	fastify.get('/', async (req, reply) => {
		return req.user
	})

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
}

module.exports = apiRoutes