const fp = require("fastify-plugin")
const path = require('path')
const fileUpload = require('fastify-file-upload')

async function plugin (fastify, opts) {
  // register websocket
  fastify.register(require('fastify-ws'))

  // register jwt auth
  fastify.register(require("fastify-jwt"), {
    // AriefPutrantoSmartAntrianProjectTa2020
    secret: "ca19505eede3d142766672bfd4504fd7"
  })

  // register file upload
  fastify.register(fileUpload, {
    useTempFiles : true,
    tempFileDir : '/tmp/'
  })

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