var mongooseObserver = require('mongoose-observer')
const Queue = require('../models/Queue')
const Services = require('../models/Services')
const moment = require('moment-timezone')

var WsController = (socket, req) => {
	console.log('Client connected.')

	socket.on('message', (msg) => {
		try {
			var data = JSON.parse(msg)
			console.log(data.url)
			if (!data.url) {
				socket.send('Url not exist')
				return
			}

			switch (data.url) {
				case '/':
					pingServer(socket)
					break;

				case '/queue/last-called':
					getLastCalledQueue(socket, data.service_id)
					break;

				default:
					socket.send(JSON.stringify({'statusCode': 500, 'message': 'Hi client!', 'data': {}}))
					break;
			}
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {}}))
		}
	})

	socket.on('close', () => console.log('Client disconnected.'))

	function pingServer(socket) {
		socket.send(JSON.stringify({'statusCode': 200, 'message': 'Hi client!', 'data': {}}))
	}

	// get last called number
	async function getLastCalledQueue(socket, service_id) {
		try {
			var services = await Services.findOne({ _id: service_id })
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {}}))
			return
		}

		if (services == null) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': 'Service not found', 'data': {}}))
			return
		}

		try {
			var currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD')
			var queue = await Queue.findOne({ service_id: service_id, called_loket: { $exists: false }, time: { $gt: currentTime } }).sort({ number: -1 })
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {}}))
			return
		}

		var lastCall = ''
		if (queue == null) {
			lastCall = services.code + '1'
			socket.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'last_call': lastCall}}))
			return
		}

		lastCall = queue.code + '' + queue.number
		socket.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'last_call': lastCall}}))
	}
}

module.exports = WsController