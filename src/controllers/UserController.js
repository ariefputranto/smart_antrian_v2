const Users = require('../models/Users')
const Hash = require('password-hash')

class UserController {
	constructor (fastify) {
		this.fastify = fastify
		this.login = this.login.bind(this)
	}

	async signUp (req, reply) {
		if (!req.body) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
		}

		var request = req.body
		if (!request.username && !request.password && !request.email && request.name) {
			reply.send({'statusCode': 500, 'message': 'Check user input again', 'data': {}})
		}

		if (request.username.indexOf(' ') !== -1) {
			reply.send({'statusCode': 500, 'message': 'Username must be no space', 'data': {}})
		}

		try {
			var user = await Users.find({email: request.email, username: request.username})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
		}

		if (user.length > 0) {
			reply.send({'statusCode': 500, 'message': 'User already exist', 'data': {}})
		}

		var data = {
			username: request.username,
			password: Hash.generate(request.password),
			email: request.email,
			name: request.name,
			time: new Date()
		}

		try {
			user = new Users(data)
			user.save()
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
		}

		reply.send({'statusCode': 200, 'message': 'Successfully create users', 'data': {}})
	}

	async login (req, reply) {
		if (!req.body) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
		}

		var request = req.body
		if (!request.username && !request.password) {
			reply.send({'statusCode': 500, 'message': 'Check user input again', 'data': {}})
		}

		try {
			var user = await Users.findOne({username : request.username})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
		}

		if (user.length == 0) {
			reply.send({'statusCode': 500, 'message': 'User not found', 'data': {}})
		}

		if (!Hash.verify(request.password, user.password)) {
			reply.send({'statusCode': 500, 'message': 'wrong password', 'data': {}})
		}

		user = JSON.parse(JSON.stringify(user))
		const token = this.fastify.jwt.sign(user, {expiresIn: 86400})

		reply.send({'statusCode': 200, 'message': 'Successfully login', 'data': {'token': token}})
	}

	async listUser (req, reply) {
		var page = req.query && req.query.page ? req.query.page : 1
		var perPage = req.query && req.query.perPage ? req.query.perPage : 10

		const options = {
			page: page,
			limit: perPage
		}

		try {
			const user = await Users.paginate({}, options)
			reply.send({'statusCode': 200, 'message': '', 'data': user})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async singleUser (req, reply) {
		try {
			const id = req.params.id
			const user = await Users.findById(id)
			reply.send({'statusCode': 200, 'message': '', 'data': user})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async updateUser (req, reply) {
		const id = req.params.id
	    const data = req.body

	    if (!data) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
	    }

	    try {
	    	var users = await Users.findById(id);
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
	    }

	    var param = {}

		if (data.username) {
			param.username = data.username
		}

		if (data.password) {
			param.password = Hash.generate(data.password)
		}

		if (data.email) {
			param.email = data.email
		}

		try {
		    const update = await Users.findByIdAndUpdate(id, param, { new: true })
			reply.send({'statusCode': 200, 'message': 'Successfully update users', 'data': update})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async deleteUser (req, reply) {
		const id = req.params.id

	    try {
	    	var users = await Users.findByIdAndRemove(id);
			reply.send({'statusCode': 200, 'message': 'Successfully delete users', 'data': users})
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
	    }
	}
}

module.exports = UserController