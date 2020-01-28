var UserController = require('../src/controllers/UserController')

async function apiRoutes(fastify, opts, next) {
	// initialize controller
	UserController = new UserController(fastify)

	fastify.get('/', (req, reply) => {
		reply.sendFile('index.html')
	})

	fastify.post('/sign-up', UserController.signUp)
	fastify.get('/user/list', UserController.listUser)
	fastify.post('/login', UserController.login)
}

module.exports = apiRoutes