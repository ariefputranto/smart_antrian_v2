const fp = require("fastify-plugin")

async function plugin (fastify, opts) {
	fastify.addHook('preValidation', async (request, reply) => {
		try {
			await request.jwtVerify()
	    } catch (e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
	    }
	})
}

module.exports = fp(plugin, {
  name: 'auth-middleware'
})