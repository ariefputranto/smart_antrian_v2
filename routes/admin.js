var UserController = require('../src/controllers/UserController')

async function apiRoutes(fastify, opts, next) {
	UserController = new UserController(fastify)

	fastify.get('/', { onRequest: [fastify.authenticate] }, async (req, reply) => {
		return req.user
	})

	// Users
	fastify.get('/user', { onRequest: [fastify.authenticate] }, UserController.listUser)
	fastify.get('/user/:id', { onRequest: [fastify.authenticate] }, UserController.singleUser)
	fastify.put('/user/:id', { onRequest: [fastify.authenticate] }, UserController.updateUser)
	fastify.delete('/user/:id', { onRequest: [fastify.authenticate] }, UserController.deleteUser)
}

module.exports = apiRoutes