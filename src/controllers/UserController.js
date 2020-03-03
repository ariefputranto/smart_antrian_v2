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
		this.updateUser = this.updateUser.bind(this)
		this.listRoles = this.listRoles.bind(this)
	}

	async addUser (req, reply) {
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
			user = await Users.create(data)
			reply.send({'statusCode': 200, 'message': 'Successfully create users', 'data': {}})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
		}
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

		try {
			var userServiceProvider = await UserServiceProvider.findOne({user_id : user._id})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
			return
		}

		user = JSON.parse(JSON.stringify(user))
		if (userServiceProvider !== null) {
			user.service_provider = userServiceProvider.service_provider_id
		}

		const token = this.fastify.jwt.sign(user, {expiresIn: 86400})
		const roles = this.roles()
		var data = {
			name: user.name,
			roles: roles[user.roles],
			token: token,
			time: user.time
		}

		reply.send({'statusCode': 200, 'message': 'Successfully login', 'data': data})
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

		try {
			var userServiceProvider = await UserServiceProvider.findOne({user_id : user._id})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
			return
		}

		if (userServiceProvider !== null) {
			user.service_provider = userServiceProvider.service_provider_id
		}

		const token = this.fastify.jwt.sign(user, {expiresIn: expiredIn})

		reply.send({'statusCode': 200, 'message': 'Successfully login', 'data': {'token': token}})
	}

	async listUser (req, reply) {
		var page = req.query && req.query.page ? req.query.page : 1
		var perPage = req.query && req.query.perPage ? req.query.perPage : 10
		var username = req.query && req.query.username ? req.query.username : null
		var name = req.query && req.query.name ? req.query.name : null
		var email = req.query && req.query.email ? req.query.email : null
		var role = req.query && req.query.role ? req.query.role : null

		const options = {
			page: page,
			limit: perPage
		}

		var condition = {}
		if (username !== null) {
			condition.username = username
		}

		if (name !== null) {
			condition.name = name
		}

		if (email !== null) {
			condition.email = email
		}

		if (role !== null) {
			condition.roles = role
		}

		try {
			const user = await Users.paginate(condition, options)
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
		const roles = this.roles()
		const rolesIndex = Object.keys(roles)

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

		if (data.name) {
			param.name = data.name
		}

		if (data.username) {
			param.username = data.username
		}

		if (data.password) {
			param.password = Hash.generate(data.password)
		}

		if (data.email) {
			param.email = data.email
		}

		if (rolesIndex.indexOf(data.role.toString()) !== -1) {
			param.roles = data.role
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
	    	user.update({roles: request.role})
			reply.send({'statusCode': 200, 'message': 'Successfully update user role', 'data': user})
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
	    }
	}

	async addUserAdmin (req, reply) {
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

		if (req.user.service_provider == null) {
			reply.send({'statusCode': 500, 'message': 'Service provider not set', 'data': {}})
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
			user = await Users.create(data)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
			return
		}

		var data = {
			user_id: user._id,
			service_provider_id: req.user.service_provider
		}

		try {
			var userServiceProvider = await UserServiceProvider.findOne(data)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider != null) {
			reply.send({'statusCode': 500, 'message': 'User already assign to service provider', 'data': {}})
			return
		}

		try {
			userServiceProvider = await UserServiceProvider.create(data)
			reply.send({'statusCode': 200, 'message': 'Successfully create users', 'data': {}})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async listUserAdmin (req, reply) {
		var page = req.query && req.query.page ? req.query.page : 1
		var perPage = req.query && req.query.perPage ? req.query.perPage : 10
		var username = req.query && req.query.username ? req.query.username : null
		var name = req.query && req.query.name ? req.query.name : null
		var email = req.query && req.query.email ? req.query.email : null

		const options = {
			page: page,
			limit: perPage
		}

		try {
			var userServiceProvider = await UserServiceProvider.find({ service_provider_id: req.user.service_provider })
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider.length == 0) {
			reply.send({'statusCode': 500, 'message': 'User Service Provider not found!', 'data': {}})
			return
		}

		var listUserId = [];
		userServiceProvider.forEach( function(element, index) {
			listUserId.push(element.user_id)
		});

		var condition = {}
		if (username !== null) {
			condition.username = username
		}

		if (name !== null) {
			condition.name = name
		}

		if (email !== null) {
			condition.email = email
		}
		
		condition._id = { $in: listUserId }

		try {
			const user = await Users.paginate(condition, options)
			reply.send({'statusCode': 200, 'message': '', 'data': user})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async listAllUserAdmin (req, reply) {
		try {
			var userServiceProvider = await UserServiceProvider.find({ service_provider_id: req.user.service_provider })
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider.length == 0) {
			reply.send({'statusCode': 500, 'message': 'User Service Provider not found!', 'data': {}})
			return
		}

		var listUserId = [];
		userServiceProvider.forEach( function(element, index) {
			listUserId.push(element.user_id)
		}); 

		try {
			const user = await Users.find({ _id: { $in: listUserId } })
			reply.send({'statusCode': 200, 'message': '', 'data': user})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async singleUserAdmin (req, reply) {
		try {
			var userServiceProvider = await UserServiceProvider.findOne({ service_provider_id: req.user.service_provider, user_id: req.params.id })
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider == null) {
			reply.send({'statusCode': 500, 'message': 'User Service Provider not found!', 'data': {}})
			return
		}

		try {
			const id = req.params.id
			const user = await Users.findById(id)
			reply.send({'statusCode': 200, 'message': '', 'data': user})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async updateUserAdmin (req, reply) {
		const id = req.params.id
	    const data = req.body

	    if (!data) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
	    }

	    try {
			var userServiceProvider = await UserServiceProvider.findOne({ service_provider_id: req.user.service_provider, user_id: id })
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider == null) {
			reply.send({'statusCode': 500, 'message': 'User Service Provider not found!', 'data': {}})
			return
		}

	    try {
	    	var users = await Users.findById(id);
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
	    }

	    var param = {}

		if (data.name) {
			param.name = data.name
		}

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

	async deleteUserAdmin (req, reply) {
		const id = req.params.id
		
		try {
			var userServiceProvider = await UserServiceProvider.findOne({ service_provider_id: req.user.service_provider, user_id: id })
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider == null) {
			reply.send({'statusCode': 500, 'message': 'User Service Provider not found!', 'data': {}})
			return
		}

	    try {
	    	var users = await Users.findByIdAndRemove(id);
			reply.send({'statusCode': 200, 'message': 'Successfully delete users', 'data': users})
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
	    }
	}

	async listRoles (req, reply) {
		const roles = this.roles()
		reply.send({'statusCode': 200, 'message': '', 'data': roles})
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