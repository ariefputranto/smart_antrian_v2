const Loket = require('../models/Loket')
const UserServiceProvider = require('../models/UserServiceProvider')
const Services = require('../models/Services')
const Users = require('../models/Users')

class LoketController {
	async listLoket (req, reply) {
		var page = req.query && req.query.page ? req.query.page : 1
		var perPage = req.query && req.query.perPage ? req.query.perPage : 10
		var name = req.query && req.query.name ? req.query.name : null
		var service = req.query && req.query.service ? req.query.service : null
		var assign_user = req.query && req.query.assign_user ? req.query.assign_user : null

		const options = {
			page: page,
			limit: perPage,
			populate: ['service_id', 'assign_user_id']
		}

		var condition = {service_provider_id: req.user.service_provider}
		if (name !== null) {
			condition.name = name
		}

		if (service !== null) {
			condition.service_id = service
		}

		if (assign_user !== null) {
			condition.assign_user_id = assign_user
		}

		try {
			const loket = await Loket.paginate(condition, options)
			reply.send({'statusCode': 200, 'message': '', 'data': loket})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async listLoketUser (req, reply) {
		var condition = {service_provider_id: req.user.service_provider}

		try {
			const loket = await Loket.find(condition).populate(['service_id', 'assign_user_id'])
			reply.send({'statusCode': 200, 'message': '', 'data': loket})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async checkAssignedUser (req, reply) {
		var params = {
			service_provider_id: req.user.service_provider,
			assign_user_id: req.user._id
		}

		try {
			var loket = await Loket.findOne(params).populate(['service_id', 'assign_user_id'])
			reply.send({'statusCode': 200, 'message': '', 'data': loket})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}
	}

	async singleLoket (req, reply) {
		try {
			const id = req.params.id
			const loket = await Loket.findOne({_id: id, service_provider_id: req.user.service_provider})
			reply.send({'statusCode': 200, 'message': '', 'data': loket})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async addLoket (req, reply) {
		var request = req.body
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.name || !request.service_id || !request.token_expiration_time) {
			reply.send({'statusCode': 500, 'message': 'Name, service and token expiration must defined', 'data': {}})
			return
		}

		try {
			var service = await Services.findById(request.service_id)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': "Services not found", 'data': {}})
			return
		}

		try {
			var loket = await Loket.find({service_provider_id: req.user.service_provider, service_id: service._id})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (loket.length >= service.number_loket) {
			reply.send({'statusCode': 500, 'message': "Maximum number of loket", 'data': {}})
			return
		}

		var data = {
			user_id: req.user._id,
			service_provider_id: req.user.service_provider,
			service_id: service._id,
			name: request.name,
			token_expiration_time: request.token_expiration_time,
			assign_user_id: null,
			time: new Date()
		}

		if (request.assign_user_id) {
			try {
				var user = await Users.findById(request.assign_user_id)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': 'User not found', 'data': {}})
				return
			}

			data.assign_user_id = user._id
		}

		try {
			var loket = await Loket.findOne({service_provider_id: req.user.service_provider, name: data.name})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (loket != null) {
			reply.send({'statusCode': 500, 'message': 'Loket is exist', 'data': {}})
			return
		}

		try {
			const addService = await Loket.create(data)
			reply.send({'statusCode': 200, 'message': 'Successfully add new loket', 'data': {}})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async updateLoket (req, reply) {
		const id = req.params.id
		const request = req.body

		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		try {
			var loket = await Loket.findOne({_id: id, service_provider_id: req.user.service_provider})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (loket == null) {
			reply.send({'statusCode': 500, 'message': 'Loket is not exist', 'data': {}})
			return
		}

		var param = {
			user_id: req.user._id,
			service_provider_id: req.user.service_provider
		}

		if (parseFloat(request.inner_distance) > parseFloat(request.outer_distance)) {
			reply.send({'statusCode': 500, 'message': "Inner distance must be lower or equal to outer distance", 'data': {}})
			return
		}

		if (request.service_id) {
			try {
				var service = await Services.findById(request.service_id)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': "Services not found", 'data': {}})
				return
			}

			try {
				var loket = await Loket.find({service_provider_id: req.user.service_provider, service_id: service._id})
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}

			if (loket.length > service.number_loket) {
				reply.send({'statusCode': 500, 'message': "Maximum number of loket", 'data': {}})
				return
			}

			param.service_id = service._id
		}

		if (request.name) {
			param.name = request.name
		}

		if (request.token_expiration_time) {
			param.token_expiration_time = request.token_expiration_time
		}

		if (request.assign_user_id) {
			try {
				var user = await Users.findById(request.assign_user_id)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': 'User not found', 'data': {}})
				return
			}

			param.assign_user_id = user._id
		} else {
			param.assign_user_id = null
		}

		try {
			const update = await Loket.findByIdAndUpdate(id, param, { new: true, useFindAndModify: false })
			reply.send({'statusCode': 200, 'message': 'Successfully update loket', 'data': update})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async deleteLoket (req, reply) {
		const id = req.params.id

		try {
			var loket = await Loket.findOne({_id: id, service_provider_id: req.user.service_provider})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (loket == null) {
			reply.send({'statusCode': 500, 'message': 'Loket is not exist', 'data': {}})
			return
		}

		try {
			var loket = await Loket.findByIdAndRemove(id, { useFindAndModify: false });
			reply.send({'statusCode': 200, 'message': 'Successfully delete loket', 'data': loket})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}
}

module.exports = LoketController