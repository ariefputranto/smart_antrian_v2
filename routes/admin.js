const AuthMiddleware = require('../src/middleware/auth')
const AdminMiddleware = require('../src/middleware/admin')

var ServicesController = require('../src/controllers/ServicesController')

async function apiRoutes(fastify, opts) {
	// regis middleware
	fastify.register(AuthMiddleware)
	fastify.register(AdminMiddleware)

	// initialize controller
	ServicesController = new ServicesController()

	fastify.get('/', async (req, reply) => {
		return req.user
	})

	// Service Provider
	fastify.get('/services', ServicesController.listServices)
	fastify.get('/services/:id', ServicesController.singleServices)
	fastify.post('/services', ServicesController.addServices)
	fastify.put('/services/:id', ServicesController.updateServices)
	fastify.delete('/services/:id', ServicesController.deleteServices)
}

module.exports = apiRoutes