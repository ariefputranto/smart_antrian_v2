const Services = require('../models/Services')
const UserServiceProvider = require('../models/UserServiceProvider')

class ServicesController {
	constructor () {
		this.listServices = this.listServices.bind(this)
		this.singleServices = this.singleServices.bind(this)
		this.addServices = this.addServices.bind(this)
		this.updateServices = this.updateServices.bind(this)
		this.deleteServices = this.deleteServices.bind(this)
	}

	async checkUserServiceProvider (req, reply) {
		// check user service provider
		try {
			var userServiceProvider = await UserServiceProvider.findOne({user_id: req.user._id})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (userServiceProvider == null) {
			reply.send({'statusCode': 500, 'message': 'User not assign to service provider', 'data': {}})
			return
		}

		this.userServiceProvider = userServiceProvider
	}

	async listServices (req, reply) {
		await this.checkUserServiceProvider(req, reply)
		var page = req.query && req.query.page ? req.query.page : 1
		var perPage = req.query && req.query.perPage ? req.query.perPage : 10

		const options = {
			page: page,
			limit: perPage
		}

		try {
			const services = await Services.paginate({service_provider_id: this.userServiceProvider._id}, options)
			reply.send({'statusCode': 200, 'message': '', 'data': services})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async singleServices (req, reply) {
		await this.checkUserServiceProvider(req, reply)
		try {
			const id = req.params.id
			const services = await Services.findOne({_id: id, service_provider_id: this.userServiceProvider._id})
			reply.send({'statusCode': 200, 'message': '', 'data': services})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async addServices (req, reply) {
		await this.checkUserServiceProvider(req, reply)
		var request = req.body
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.name || !request.number_loket || !request.code ) {
			reply.send({'statusCode': 500, 'message': 'Name, description, number loket and code must defined', 'data': {}})
			return
		}

		var data = {
			user_id: req.user._id,
			service_provider_id: this.userServiceProvider._id,
			name: request.name,
			number_loket: request.number_loket,
			code: request.code,
			time: new Date()
		}

		if (request.description) {
			data.description = request.description
		}

		try {
			var services = await Services.findOne({service_provider_id: this.userServiceProvider._id, name: data.name})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (services != null) {
			reply.send({'statusCode': 500, 'message': 'Service is exist', 'data': {}})
			return
		}

		try {
			const addService = new Services(data)
			addService.save()
			reply.send({'statusCode': 200, 'message': 'Successfully add new service', 'data': {}})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async updateServices (req, reply) {
		await this.checkUserServiceProvider(req, reply)
		const id = req.params.id
	    const request = req.body

	    if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
	    }

	    try {
	    	var services = await Services.findOne({_id: id, service_provider_id: this.userServiceProvider._id})
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
	    }

	    if (services == null) {
			reply.send({'statusCode': 500, 'message': 'Services is not exist', 'data': {}})
			return
		}

	    var param = {
	    	user_id: req.user._id,
			service_provider_id: this.userServiceProvider._id
	    }

		if (request.name) {
			param.name = request.name
		}

		if (request.description) {
			param.description = request.description
		}

		if (request.number_loket) {
			param.number_loket = request.number_loket
		}

		if (request.code) {
			param.code = request.code
		}

		try {
		    const update = await Services.findByIdAndUpdate(id, param, { new: true, useFindAndModify: false })
			reply.send({'statusCode': 200, 'message': 'Successfully update services', 'data': update})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async deleteServices (req, reply) {
		await this.checkUserServiceProvider(req, reply)
		const id = req.params.id

	    try {
	    	var services = await Services.findOne({_id: id, service_provider_id: this.userServiceProvider._id})
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
	    }

	    if (services == null) {
			reply.send({'statusCode': 500, 'message': 'Services is not exist', 'data': {}})
			return
		}

	    try {
	    	var services = await Services.findByIdAndRemove(id);
			reply.send({'statusCode': 200, 'message': 'Successfully delete services', 'data': services})
	    } catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
	    }
	}
}

module.exports = ServicesController