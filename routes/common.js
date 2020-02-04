var UserController = require('../src/controllers/UserController')

async function apiRoutes(fastify, opts) {
	// initialize controller
	UserController = new UserController(fastify)

	fastify.get('/', (req, reply) => {
		reply.sendFile('index.html')
	})

	fastify.post('/sign-up', UserController.signUp)
	fastify.post('/login', UserController.login)
	fastify.post('/login-guest', UserController.loginGuest)
}

module.exports = apiRoutes