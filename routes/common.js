var UserController = require('../src/controllers/UserController')

async function apiRoutes(fastify, opts) {
	// initialize controller
	UserController = new UserController(fastify)

	fastify.get('/', (req, reply) => {
		reply.sendFile('index.html')
	})

	fastify.post('/api/login', UserController.login)
	fastify.post('/api/login-guest', UserController.loginGuest)
	fastify.get('/api/roles', UserController.listRoles)
}

module.exports = apiRoutes