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
			is_fixed: true,
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
			is_fixed: true,
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
			called_user: req.user._id,
			time: new Date()
		}

		try {
			queue = await Queue.updateOne({ _id: queue._id }, params, { new: true, useFindAndModify: false })
			reply.send({'statusCode': 200, 'message': 'Successfully call user', 'data': queue})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	// Get list queue
	async getListQueue (req, reply) {
		var serviceId = req.params.id

		try {
			var services = await Services.findById(serviceId)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (services == null) {
			reply.send({'statusCode': 500, 'message': 'Service not found', 'data': {}})
			return
		}

		var params = {
			service_id: serviceId,
			is_called: false,
			is_fixed: true,
			date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
		}

		try {
			var queue = await Queue.find(params).sort({ number: 1 })
			reply.send({'statusCode': 200, 'message': '', 'data': queue})
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
		}
	}

	// Get hold queue based on number predicted
	async holdQueue (req, reply) {
		var request = req.body
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.number_queue || !request.service_id) {
			reply.send({'statusCode': 500, 'message': 'Number queue and service id is required', 'data': {}})
			return
		}

		// if it has hold id
		if (request.queue_id) {
			try {
				var queue = await Queue.findById(request.queue_id)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}

			if (queue === null) {
				reply.send({'statusCode': 500, 'message': 'Queue not found', 'data': {}})
				return
			}

			// if fixed change to hold
			if (queue.is_fixed) {
				try {
					queue = await Queue.updateOne({ _id: queue._id }, { is_fixed:false }, { new: true, useFindAndModify: false })
				} catch(e) {
					reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
					return
				}
			}

			// if queue is called
			if (queue.is_called) {
				reply.send({'statusCode': 200, 'message': '', 'data': {'queue' : null}})
				return
			}

			reply.send({'statusCode': 200, 'message': '', 'data': {'queue' : queue}})

		} else {
			// generate new hold
			try {
				var service = await Services.findById(request.service_id)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}

			if (service == null) {
				reply.send({'statusCode': 500, 'message': 'Service not found', 'data': {}})
				return
			}

			// get last queue
			var condition = {
				service_id: service._id,
				is_mobile: false,
				is_called: false,
				date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
			}

			try {
				var lastQueue = await Queue.find(condition).sort({_id: -1}).limit(1)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}

			// get list hold
			condition = {
				service_id: service._id,
				is_mobile: true,
				date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
			}

			try {
				var listHoldQueue = await Queue.find(condition)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}

			// extract number from list hold queue
			var listNumber = []
			if (listHoldQueue.length > 0) {
				listNumber = listHoldQueue.map(function(el, index) {
					return el.number
				})

			}

			// get number
			var foundCounter = 0
			var number = lastQueue.length > 0 ? lastQueue[0].number : 0
			while (foundCounter < request.number_queue) {
				number++

				if (listNumber.indexOf(number) === -1) {
					foundCounter++
				}
			}

			var data = {
				token: req.user.imei,
				service_provider_id: service.service_provider_id,
				service_id: service._id,
				code: service.code,
				number: number,
				is_mobile: true,
				is_fixed: false,
				date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
				time: new Date()
			}

			try {
				var queue = await Queue.create(data)
				reply.send({'statusCode': 200, 'message': '', 'data': {'queue' : queue}})
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			}

		}
	}

	// Get fixed queue based on number predicted
	async fixedQueue (req, reply) {
		var request = req.body
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.service_id) {
			reply.send({'statusCode': 500, 'message': 'Service id is required', 'data': {}})
			return
		}

		// if it has hold id
		if (request.queue_id) {
			try {
				var queue = await Queue.findById(request.queue_id)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}

			if (queue === null) {
				reply.send({'statusCode': 500, 'message': 'Queue not found', 'data': {}})
				return
			}

			// if fixed change to hold
			if (!queue.is_fixed) {
				try {
					queue = await Queue.updateOne({ _id: queue._id }, { is_fixed:true }, { new: true, useFindAndModify: false })
				} catch(e) {
					reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
					return
				}
			}

			// if queue is called
			if (queue.is_called) {
				reply.send({'statusCode': 200, 'message': '', 'data': {'queue' : null}})
				return
			}

			reply.send({'statusCode': 200, 'message': '', 'data': {'queue' : queue}})

		} else {
			// generate new hold
			try {
				var service = await Services.findById(request.service_id)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}

			if (service == null) {
				reply.send({'statusCode': 500, 'message': 'Service not found', 'data': {}})
				return
			}

			// get last queue
			var condition = {
				service_id: service._id,
				is_mobile: false,
				is_called: false,
				date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
			}

			try {
				var lastQueue = await Queue.find(condition).sort({_id: -1}).limit(1)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}

			// get list hold
			condition = {
				service_id: service._id,
				is_mobile: true,
				date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
			}

			try {
				var listHoldQueue = await Queue.find(condition)
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}

			// extract number from list hold queue
			var listNumber = []
			if (listHoldQueue.length > 0) {
				listNumber = listHoldQueue.map(function(el, index) {
					return el.number
				})

			}

			// get number
			var foundCounter = 0
			var number = lastQueue.length > 0 ? lastQueue[0].number : 0
			while (foundCounter <= 1) {
				number++

				if (listNumber.indexOf(number) === -1) {
					foundCounter++
				}
			}

			var data = {
				token: req.user.imei,
				service_provider_id: service.service_provider_id,
				service_id: service._id,
				code: service.code,
				number: number,
				is_mobile: true,
				is_fixed: true,
				date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
				time: new Date()
			}

			try {
				var queue = await Queue.create(data)
				reply.send({'statusCode': 200, 'message': '', 'data': {'queue' : queue}})
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			}

		}
	}

	// Get cancel queue
	async cancelQueue (req, reply) {
		var request = req.body
		if (!request) {
			reply.send({'statusCode': 500, 'message': 'Body empty', 'data': {}})
			return
		}

		if (!request.queue_id || !request.service_id) {
			reply.send({'statusCode': 500, 'message': 'Service id is required', 'data': {}})
			return
		}

		try {
			var queue = await Queue.findById(request.queue_id)
		} catch(e) {
			reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
			return
		}

		if (queue === null) {
			reply.send({'statusCode': 500, 'message': 'Queue not found', 'data': {}})
			return
		}

		// if fixed change to hold
		if (queue.is_fixed) {
			try {
				queue = await Queue.updateOne({ _id: queue._id }, { is_fixed:false }, { new: true, useFindAndModify: false })
			} catch(e) {
				reply.send({'statusCode': 500, 'message': e.message, 'data': {}})
				return
			}
		}

		reply.send({'statusCode': 200, 'message': '', 'data': {'queue' : queue}})
	}
}

module.exports = QueueController