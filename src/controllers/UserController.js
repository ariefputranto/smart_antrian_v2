const Users = require('../models/Users')
const ServiceProvider = require('../models/ServiceProvider')
const UserServiceProvider = require('../models/UserServiceProvider')
const Hash = require('password-hash')

class UserController {
	constructor (fastify) {
		this.fastify = fastify
		this.login = this.login.bind(this)
		this.loginGuest = this.loginGuest.bind(this)
		this.changeRoles = this.changeRoles.bind(this)
	}

	async signUp (req, reply) {
		if (!req.body) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		var request = req.body
		if (!request.username && !request.password && !request.email && request.name) {
			reply.send({'statusCode': 500, 'message': 'Check user input again', 'data': {}})
			return
		}

		if (request.username.indexOf(' ') !== -1) {
			reply.send({'statusCode': 500, 'message': 'Username must be no space', 'data': {}})
			return
		}

		try {
			var user = await Users.find({email: request.email, username: request.username})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
			return
		}

		if (user.length > 0) {
			reply.send({'statusCode': 500, 'message': 'User already exist', 'data': {}})
			return
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
			return
		}

		var request = req.body
		if (!request.username && !request.password) {
			reply.send({'statusCode': 500, 'message': 'Check user input again', 'data': {}})
			return
		}

		try {
			var user = await Users.findOne({username : request.username})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
			return
		}

		if (user == null) {
			reply.send({'statusCode': 500, 'message': 'User not found', 'data': {}})
			return
		}

		if (!Hash.verify(request.password, user.password)) {
			reply.send({'statusCode': 500, 'message': 'wrong password', 'data': {}})
			return
		}

		user = JSON.parse(JSON.stringify(user))
		const token = this.fastify.jwt.sign(user, {expiresIn: 86400})

		reply.send({'statusCode': 200, 'message': 'Successfully login', 'data': {'token': token}})
	}

	async loginGuest (req, reply) {
		if (!req.body) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		var request = req.body
		if (!request.imei && !request.expired_in) {
			reply.send({'statusCode': 500, 'message': 'Imei and Expired is needed', 'data': {}})
			return
		}

		var expiredIn = request.expired_in
		var user = {
			name: "Guest " + request.imei,
			username: "Guest#" + request.imei,
			roles: 0,
			time: new Date(),
		}
		const token = this.fastify.jwt.sign(user, {expiresIn: expiredIn})

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
			return
	    }

	    try {
	    	var users = await Users.findById(id);
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
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
		    const update = await Users.findByIdAndUpdate(id, param, { new: true, useFindAndModify: false })
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

	async assignServiceProvider (req, reply) {
		const request = req.body
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.user_id || !request.service_provider_id) {
			reply.send({'statusCode': 500, 'message': 'User and Service Provider is needed', 'data': {}})
			return
		}

		try {
			var user = await Users.findById(request.user_id)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (user == null) {
			reply.send({'statusCode': 500, 'message': 'User not exist', 'data': {}})
			return
		}

		try {
			var serviceProvider = await ServiceProvider.findById(request.service_provider_id)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (serviceProvider == null) {
			reply.send({'statusCode': 500, 'message': 'Service Provider not exist', 'data': {}})
			return
		}

		var params = {
			user_id: user._id,
			service_provider_id: serviceProvider._id
		}

		try {
			var userServiceProvider = await UserServiceProvider.findOne({ user_id: params.user_id, service_provider_id: params.service_provider_id })
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider != null) {
			reply.send({'statusCode': 500, 'message': 'User already assign to service provider', 'data': {}})
			return
		}

		try {
			userServiceProvider = new UserServiceProvider(params)
			userServiceProvider.save()
			reply.send({'statusCode': 500, 'message': 'Successfully assign ' + user.name + ' to ' + serviceProvider.name, 'data': {}})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async removeServiceProvider (req, reply) {
		const request = req.body
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.user_id || !request.service_provider_id) {
			reply.send({'statusCode': 500, 'message': 'User and Service Provider is needed', 'data': {}})
			return
		}

		try {
			var user = await Users.findById(request.user_id)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (user == null) {
			reply.send({'statusCode': 500, 'message': 'User not exist', 'data': {}})
			return
		}

		try {
			var serviceProvider = await ServiceProvider.findById(request.service_provider_id)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (serviceProvider == null) {
			reply.send({'statusCode': 500, 'message': 'Service Provider not exist', 'data': {}})
			return
		}

		var params = {
			user_id: user._id,
			service_provider_id: serviceProvider._id
		}

		try {
			var userServiceProvider = await UserServiceProvider.findOne(params)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider == null) {
			reply.send({'statusCode': 500, 'message': 'Not assigned to that service provider', 'data': {}})
			return
		}

		try {
			userServiceProvider = await UserServiceProvider.findByIdAndRemove(userServiceProvider._id)
			reply.send({'statusCode': 500, 'message': 'Successfully remove ' + user.name + ' from ' + serviceProvider.name, 'data': {}})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async changeRoles (req, reply) {
		const request = req.body
		const roles = this.roles()
		const rolesIndex = Object.keys(roles)

		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.role || !request.user_id) {
			reply.send({'statusCode': 500, 'message': 'User and Role must defined', 'data': {}})
			return
		}

		if (rolesIndex.indexOf(request.role.toString()) === -1) {
			reply.send({'statusCode': 500, 'message': 'Roles not found', 'data': {}})
			return
		}

	    try {
	    	var user = await Users.findById(request.user_id)
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
	    }

	    if (user == null) {
			reply.send({'statusCode': 500, 'message': 'User not exist', 'data': {}})
			return
	    }

	    if (user.roles == request.role) {
			reply.send({'statusCode': 500, 'message': 'User has the same role', 'data': {}})
			return
	    }

	    try {
		    user.roles = request.role
	    	user.save()
			reply.send({'statusCode': 200, 'message': 'Successfully update user role', 'data': user})
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
	    }
	}

	roles () {
		return [
			"Guest",
			"User",
			"Admin Web",
			"Administrator"
		]
	}
}

module.exports = UserController