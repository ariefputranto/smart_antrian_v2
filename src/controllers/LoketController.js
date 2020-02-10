const Loket = require('../models/Loket')
const UserServiceProvider = require('../models/UserServiceProvider')
const Services = require('../models/Services')
const Users = require('../models/Users')

class LoketController {
	async listLoket (req, reply) {
		var page = req.query && req.query.page ? req.query.page : 1
		var perPage = req.query && req.query.perPage ? req.query.perPage : 10

		const options = {
			page: page,
			limit: perPage,
			populate: ['service_id', 'assign_user_id']
		}

		try {
			const loket = await Loket.paginate({service_provider_id: req.user.service_provider}, options)
			reply.send({'statusCode': 200, 'message': '', 'data': loket})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
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

		if (!request.name || !request.service_id || !request.token_expiration_time || !request.latitude || !request.longitude ) {
			reply.send({'statusCode': 500, 'message': 'Name, service, token expiration, latitude and longitude must defined', 'data': {}})
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
			latitude: request.latitude,
			longitude: request.longitude,
			time: new Date()
		}

		if (request.inner_distance) {
			data.inner_distance = request.inner_distance
		}

		if (request.outer_distance) {
			data.outer_distance = request.outer_distance
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

		if (request.latitude) {
			param.latitude = request.latitude
		}

		if (request.longitude) {
			param.longitude = request.longitude
		}

		if (request.inner_distance) {
			data.inner_distance = request.inner_distance
		}

		if (request.outer_distance) {
			data.outer_distance = request.outer_distance
		}

		if (request.assign_user_id) {
			try {
				var user = await Users.findById(request.assign_user_id)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': 'User not found', 'data': {}})
				return
			}

			param.assign_user_id = user._id
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
	    	var loket = await Loket.findByIdAndRemove(id);
			reply.send({'statusCode': 200, 'message': 'Successfully delete loket', 'data': loket})
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
	    }
	}
}

module.exports = LoketController