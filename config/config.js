const fp = require("fastify-plugin")
const path = require('path')

async function plugin (fastify, opts) {
  // register websocket
  fastify.register(require('fastify-ws'))

  // register jwt auth
  fastify.register(require('./jwt_auth.js'))

  // register html
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '/../public'),
    prefix: '/public/', // optional: default '/'
  })

  // register cors
  fastify.register(require('fastify-cors'), {
     origin: '*',
     credentials: true
  })
}

module.exports = fp(plugin, {
  name: 'config'
})