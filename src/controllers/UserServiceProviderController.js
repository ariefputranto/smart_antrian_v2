const Users = require('../models/Users')
const ServiceProvider = require('../models/ServiceProvider')
const UserServiceProvider = require('../models/UserServiceProvider')

class UserServiceProviderController {
	async listUserServiceProvider (req, reply) {
		var page = req.query && req.query.page ? req.query.page : 1
		var perPage = req.query && req.query.perPage ? req.query.perPage : 10

		const options = {
			page: page,
			limit: perPage,
			populate: ['user_id', 'service_provider_id']
		}

		try {
			const serviceProvider = await UserServiceProvider.paginate({}, options)
			reply.send({'statusCode': 200, 'message': '', 'data': serviceProvider})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async singleUserServiceProviderByUser (req, reply) {
		const request = req.params
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.id) {
			reply.send({'statusCode': 500, 'message': 'User is needed', 'data': {}})
			return
		}

		try {
			var user = await Users.findById(request.id)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (user == null) {
			reply.send({'statusCode': 500, 'message': 'User not exist', 'data': {}})
			return
		}

		try {
			const userServiceProvider = await UserServiceProvider.findOne({user_id: user._id}).populate(['user_id', 'service_provider_id'])
			reply.send({'statusCode': 200, 'message': '', 'data': userServiceProvider})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async listUserServiceProviderByServiceProvider (req, reply) {
		const request = req.params
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.id) {
			reply.send({'statusCode': 500, 'message': 'Service Provider is needed', 'data': {}})
			return
		}

		try {
			var serviceProvider = await ServiceProvider.findById(request.id)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (serviceProvider == null) {
			reply.send({'statusCode': 500, 'message': 'Service Provider not exist', 'data': {}})
			return
		}

		try {
			const userServiceProvider = await UserServiceProvider.find({service_provider_id: serviceProvider._id}).populate(['user_id', 'service_provider_id'])
			reply.send({'statusCode': 200, 'message': '', 'data': userServiceProvider})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async assignUserServiceProvider (req, reply) {
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
			var userServiceProvider = await UserServiceProvider.findOne({user_id: params.user_id})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider != null) {
			reply.send({'statusCode': 500, 'message': 'User already assign to service provider', 'data': {}})
			return
		}

		try {
			userServiceProvider = await UserServiceProvider.create(params)
			reply.send({'statusCode': 500, 'message': 'Successfully assign ' + user.name + ' to ' + serviceProvider.name, 'data': {}})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async changeUserServiceProvider (req, reply) {
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
			var userServiceProvider = await UserServiceProvider.findOne({user_id: params.user_id})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider != null) {
			try {
				userServiceProvider = await UserServiceProvider.findByIdAndRemove(userServiceProvider._id)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}
		}

		try {
			userServiceProvider = await UserServiceProvider.create(params)
			reply.send({'statusCode': 200, 'message': 'Successfully assign ' + user.name + ' to ' + serviceProvider.name, 'data': {}})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async removeUserServiceProvider (req, reply) {
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
}

module.exports = UserServiceProviderController