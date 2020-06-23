const ServiceProvider = require('../models/ServiceProvider')
const mv = require('mv');
const fs = require('fs');

class ServiceProviderController {
	async listServiceProvider (req, reply) {
		var page = req.query && req.query.page ? req.query.page : 1
		var perPage = req.query && req.query.perPage ? req.query.perPage : 10
		var name = req.query && req.query.name ? req.query.name : null
		var description = req.query && req.query.description ? req.query.description : null
		var type = req.query && req.query.type ? req.query.type : null

		const options = {
			page: page,
			limit: perPage
		}

		var condition = {}
		if (name !== null) {
			condition.name = { $regex: name, $options: "i" }
		}

		if (description !== null) {
			condition.description = { $regex: '.*' + description + '.*' }
		}

		if (type !== null) {
			condition.type = { $regex: type, $options: "i" }
		}

		try {
			const serviceProvider = await ServiceProvider.paginate(condition, options)
			reply.send({'statusCode': 200, 'message': '', 'data': serviceProvider})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async listUserServiceProvider (req, reply) {
		try {
			const serviceProvider = await ServiceProvider.find()
			reply.send({'statusCode': 200, 'message': '', 'data': serviceProvider})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async singleServiceProvider (req, reply) {
		try {
			const id = req.params.id
			const serviceProvider = await ServiceProvider.findById(id)
			reply.send({'statusCode': 200, 'message': '', 'data': serviceProvider})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async addServiceProvider (req, reply) {
		var request = req.body
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.name || !request.description || !request.type || !request.latitude || !request.longitude) {
			reply.send({'statusCode': 500, 'message': 'Name, description, type, latitude and longitude must defined', 'data': {}})
			return
		}

		var data = {
			name: request.name,
			description: request.description,
			type: request.type,
			latitude: request.latitude,
			longitude: request.longitude,
			time: new Date()
		}

		if (parseFloat(request.inner_distance) > parseFloat(request.outer_distance)) {
			reply.send({'statusCode': 500, 'message': "Inner distance must be lower or equal to outer distance", 'data': {}})
			return
		}

		if (request.inner_distance) {
			data.inner_distance = request.inner_distance
		}

		if (request.outer_distance) {
			data.outer_distance = request.outer_distance
		}

		if (request.icon && typeof request.icon.name == 'string') {
			if (request.icon.mimetype.indexOf('image') === -1) {
				reply.send({'statusCode': 500, 'message': 'File must be image', 'data': {}})
				return
			}

			var path = __dirname + '/../../public/uploads/'
			var extension = request.icon.name.split('.').pop()
			extension = request.icon.name == extension ? '' : '.' + extension
			var fileName = new Date().getTime() + Math.round(Math.random() * 10000) + extension

			// Upload file
			var oldpath = request.icon.tempFilePath
			var newpath = path + fileName

			mv(oldpath, newpath, {mkdirp: true, clobber: false}, function (err) {
				if (err) {console.log(err)}
			})

			data.icon = fileName
		}

		try {
			var serviceProvider = await ServiceProvider.findOne({name: data.name})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
			return
		}

		if (serviceProvider != null) {
			reply.send({'statusCode': 500, 'message': 'Service Provider is exist', 'data': {}})
			return
		}

		try {
			const addService = await ServiceProvider.create(data)
			reply.send({'statusCode': 200, 'message': 'Successfully add new service provider', 'data': {}})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': 'DB error', 'data': {}})
		}
	}

	async updateServiceProvider (req, reply) {
		const id = req.params.id
		const request = req.body

		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		try {
			var serviceProvider = await ServiceProvider.findById(id);
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (serviceProvider == null) {
			reply.send({'statusCode': 500, 'message': 'Service Provider is not exist', 'data': {}})
			return
		}

		// validate inner and outer distance
		if (parseFloat(request.inner_distance) > parseFloat(request.outer_distance)) {
			reply.send({'statusCode': 500, 'message': "Inner distance must be lower or equal to outer distance", 'data': {}})
			return
		}

		var param = {}

		if (request.name) {
			param.name = request.name
		}

		if (request.description) {
			param.description = request.description
		}

		if (request.type) {
			param.type = request.type
		}

		if (request.latitude) {
			param.latitude = request.latitude
		}

		if (request.longitude) {
			param.longitude = request.longitude
		}

		if (request.inner_distance) {
			param.inner_distance = request.inner_distance
		}

		if (request.outer_distance) {
			param.outer_distance = request.outer_distance
		}

		if (request.icon && typeof request.icon.name == 'string') {
			if (request.icon.mimetype.indexOf('image') === -1) {
				reply.send({'statusCode': 500, 'message': 'File must be image', 'data': {}})
				return
			}

			var path = __dirname + '/../../public/uploads/'
			var extension = request.icon.name.split('.').pop()
			extension = request.icon.name == extension ? '' : '.' + extension
			var fileName = new Date().getTime() + Math.round(Math.random() * 10000) + extension

			// Upload file
			var oldpath = request.icon.tempFilePath
			var newpath = path + fileName

			mv(oldpath, newpath, {mkdirp: true, clobber: false}, function (err) {
				if (err) {console.log(err)}
			})

			param.icon = fileName

			if (serviceProvider.icon !== null) {
				var path = __dirname + '/../../public/uploads/'
				fs.unlink(path + serviceProvider.icon, (err) => {
					if (err) console.log(err)
				});
			}
		}

		try {
			const update = await ServiceProvider.findByIdAndUpdate(id, param, { new: true, useFindAndModify: false })
			reply.send({'statusCode': 200, 'message': 'Successfully update service provider', 'data': update})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async deleteServiceProvider (req, reply) {
		const id = req.params.id

		try {
			var serviceProvider = await ServiceProvider.findByIdAndRemove(id, { useFindAndModify: false });

			if (serviceProvider.icon !== null && typeof serviceProvider.icon !== 'undefined') {
				var path = __dirname + '/../../public/uploads/'
				fs.unlink(path + serviceProvider.icon, (err) => {
					if (err) console.log(err)
				});
			}
			
			reply.send({'statusCode': 200, 'message': 'Successfully delete service provider', 'data': serviceProvider})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}
}

module.exports = ServiceProviderController