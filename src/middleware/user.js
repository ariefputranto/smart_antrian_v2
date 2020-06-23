const fp = require("fastify-plugin")

async function plugin (fastify, opts) {
	fastify.addHook('preValidation', async (request, reply) => {
		try {
	    	var login = request.user
	    	if (login.roles != 1 || login.service_provider == null) {
	    		reply.send({'statusCode': 500, 'message': "You are not allowed!", 'data': {}})
				return
	    	}
	    } catch(e) {
	    	reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
	    }
	})
}

module.exports = fp(plugin, {
  name: 'user-middleware'
})