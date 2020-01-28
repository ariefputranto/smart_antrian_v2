const fp = require("fastify-plugin")

async function plugin (fastify, opts) {
  // register jwt auth
  fastify.register(require("fastify-jwt"), {
    // AriefPutrantoSmartAntrianProjectTa2020
    secret: "ca19505eede3d142766672bfd4504fd7"
  })
 
  fastify.decorate("authenticate", async function(request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
}

module.exports = fp(plugin, {
  name: 'jwt-auth'
})