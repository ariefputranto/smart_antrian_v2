const Users = require('../models/Users')
const Hash = require('password-hash')

class UserController {
	constructor (fastify) {
		this.fastify = fastify
		this.login = this.login.bind(this)
	}

	async signUp (req, reply) {
		if (!req.body) {
			return {'statusCode': 404, 'message': 'body empty', 'data': {}}
		}

		var request = req.body
		if (!request.username && !request.password && !request.email) {
			return {'statusCode': 404, 'message': 'check user input again', 'data': {}}
		}

		try {
			var user = await Users.find({email : request.email})
		} catch(e) {
			return {'statusCode': 404, 'message': 'DB error', 'data': {}}
		}

		if (user.length > 0) {
			return {'statusCode': 404, 'message': 'user already exist', 'data': {}}
		}

		var data = {
			username: request.username,
			password: Hash.generate(request.password),
			email: request.email,
		}

		try {
			user = new Users(data)
			user.save()
		} catch(e) {
			return {'statusCode': 405, 'message': 'DB error', 'data': {}}
		}

		return {'statusCode': 200, 'message': 'Successfully create users', 'data': {}}
	}

	async login (req, reply) {
		if (!req.body) {
			return {'statusCode': 404, 'message': 'body empty', 'data': {}}
		}

		var request = req.body
		if (!request.username && !request.password) {
			return {'statusCode': 404, 'message': 'check user input again', 'data': {}}
		}

		try {
			var user = await Users.findOne({email : request.email})
		} catch(e) {
			return {'statusCode': 404, 'message': 'DB error', 'data': {}}
		}

		if (user.length == 0) {
			return {'statusCode': 404, 'message': 'user not found', 'data': {}}
		}

		if (!Hash.verify(request.password, user.password)) {
			return {'statusCode': 404, 'message': 'wrong password', 'data': {}}
		}

		user = JSON.parse(JSON.stringify(user))
		const token = this.fastify.jwt.sign(user, {expiresIn: 120})

		return {'statusCode': 200, 'message': 'Successfully login', 'data': {'token': token}}
	}

	async listUser (req, reply) {
		try {
			const user = await Users.find()
			return user
		} catch(e) {
			reply.send({'statusCode': 405, 'message': e})
		}
	}
}

module.exports = UserController