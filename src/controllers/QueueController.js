const moment = require('moment-timezone')
const Queue = require('../models/Queue')
const Services = require('../models/Services')
const Loket = require('../models/Loket')

class QueueController {
	async listQueue (req, reply) {
		var page = req.query && req.query.page ? req.query.page : 1
		var perPage = req.query && req.query.perPage ? req.query.perPage : 10

		const options = {
			page: page,
			limit: perPage
		}

		try {
			const queue = await Queue.paginate({service_provider_id: req.user.service_provider}, options)
			reply.send({'statusCode': 200, 'message': '', 'data': queue})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	// Get queue for on the spot (using pc)
	async getQueue (req, reply) {
		var request = req.body
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.service_id ) {
			reply.send({'statusCode': 500, 'message': 'Service id must defined', 'data': {}})
			return
		}

		try {
			var services = await Services.findOne({ service_provider_id: req.user.service_provider, _id: request.service_id })
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (services == null) {
			reply.send({'statusCode': 500, 'message': 'Service not found', 'data': {}})
			return
		}

		var params = { 
			service_provider_id: req.user.service_provider, 
			service_id: request.service_id,
			date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
		}

		try {
			var queue = await Queue.findOne(params).sort({ number: -1 })
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		var currentTime = moment().unix()
		// prevent multiple click
		if (queue && currentTime - moment(queue.time).unix() <= 5) {
			reply.send({'statusCode': 500, 'message': 'Please wait! do not multiple click', 'data': {}})
			return
		}

		var number = queue == null ? 1 : queue.number + 1

		var data = {
			token: req.user._id,
			service_provider_id: req.user.service_provider,
			service_id: services._id,
			code: services.code,
			number: number,
			date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
			time: new Date()
		}

		try {
			var queue = await Queue.create(data)
			reply.send({'statusCode': 200, 'message': '', 'data': queue})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	async callQueue (req, reply) {
		var request = req.body
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.loket_id) {
			reply.send({'statusCode': 500, 'message': 'Loket id must defined', 'data': {}})
			return
		}

		try {
			var loket = await Loket.findOne({ service_provider_id: req.user.service_provider, _id: request.loket_id })
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (loket == null) {
			reply.send({'statusCode': 500, 'message': 'Loket not found', 'data': {}})
			return
		}

		if (loket.assign_user_id == null) {
			reply.send({'statusCode': 500, 'message': 'Loket not assigned to any user', 'data': {}})
			return
		}

		var params = { 
			service_provider_id: req.user.service_provider, 
			service_id: loket.service_id,
			is_called: false,
			date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
		}

		try {
			var queue = await Queue.findOne(params)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (queue == null) {
			reply.send({'statusCode': 500, 'message': 'Next queue not found', 'data': {}})
			return
		}

		params = {
			is_called: true,
			called_loket: loket._id,
			called_user: req.user._id
		}

		try {
			queue = await Queue.updateOne({ _id: queue._id }, params, { new: true, useFindAndModify: false })
			reply.send({'statusCode': 200, 'message': 'Successfully call user', 'data': queue})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}
}

module.exports = QueueController