// libs
const moment = require('moment-timezone')
const mongoose = require('mongoose')
const url = require('url')
const WebSocket = require('ws')

// models
const Queue = require('../models/Queue')
const Loket = require('../models/Loket')
const Services = require('../models/Services')

var WsController = (socket, req) => {
	console.log('Client connected.')
	socket.room = req.url.replace('/', '')

	var interval = setInterval(() => {
		pingServer(socket)
	}, 1000)

	socket.on('message', (msg) => {
		try {
			var data = JSON.parse(msg)
			console.log(data.url)
			if (!data.url) {
				socket.send(JSON.stringify({'statusCode': 500, 'message': 'Url not exist', 'data': {}}))
				return
			}

			switch (data.url) {
				case '/':
					pingServer(socket)
					break;

				case '/queue/last-called':
					getLastCalledQueue(socket, data.service_id, data.loket_id)
					break;

				case '/queue/count':
					getUnCalledQueue(socket, data.service_id)
					break;

				case '/queue/last-called-by-loket':
					getLastCalledQueueByLoket(socket, data.service_id, data.loket_id)
					break;

				case '/queue/call':
					callUser(socket, data.loket, data.text)
					break;

				default:
					socket.send(JSON.stringify({'statusCode': 500, 'message': 'Hi client!', 'data': {}}))
					break;
			}
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {}}))
		}
	})

	socket.on('close', () => {
		clearInterval(interval)
		console.log('Client disconnected.')
	})

	function pingServer(socket) {
		socket.send(JSON.stringify({'statusCode': 200, 'message': 'Hi client!', 'data': {}}))
	}

	// get last called number
	async function getLastCalledQueue(socket, service_id, loket_id) {
		try {
			var services = await Services.findOne({ _id: service_id })
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {'url': '/queue/last-called'}}))
			return
		}

		if (services == null) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': 'Service not found', 'data': {'url': '/queue/last-called'}}))
			return
		}

		try {
			var loket = await Loket.findOne({ _id: loket_id })
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {'url': '/queue/last-called'}}))
			return
		}

		if (loket == null) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': 'Loket not found', 'data': {'url': '/queue/last-called'}}))
			return
		}

		var params = { 
			service_id: service_id,
			is_called: true,
			called_loket: loket._id,
			date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD')
		}

		try {
			var queue = await Queue.findOne(params).sort({ number: -1 })
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {'url': '/queue/last-called'}}))
			return
		}

		var lastCall = '-'
		if (queue == null) {
			// lastCall = services.code + '1'
			socket.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'last_call': lastCall, 'url': '/queue/last-called'}}))
			return
		}

		lastCall = queue.code + '' + queue.number
		socket.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'last_call': lastCall, 'url': '/queue/last-called'}}))
	}

	// get last called number by loket
	async function getLastCalledQueueByLoket(socket, service_id, loket_id) {
		var url = '/queue/last-called-by-loket'
		try {
			var services = await Services.findOne({ _id: service_id })
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {'url': url}}))
			return
		}

		if (services == null) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': 'Service not found', 'data': {'url': url}}))
			return
		}

		try {
			var loket = await Loket.findOne({ _id: loket_id })
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {'url': url}}))
			return
		}

		if (loket == null) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': 'Loket not found', 'data': {'url': url}}))
			return
		}

		var params = { 
			service_id: service_id,
			is_called: true,
			called_loket: loket._id,
			date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD')
		}

		try {
			var queue = await Queue.findOne(params).sort({ number: -1 })
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {'url': url}}))
			return
		}

		var lastCall = '-'
		if (queue == null) {
			// lastCall = services.code + '1'
			socket.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'last_call': lastCall, 'url': url}}))
			return
		}

		lastCall = queue.code + '' + queue.number
		socket.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'last_call': lastCall, 'loket': loket._id, 'url': url}}))
	}

	// get not called
	async function getUnCalledQueue(socket, service_id) {
		try {
			var services = await Services.findOne({ _id: service_id })
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {'url': '/queue/count'}}))
			return
		}

		if (services == null) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': 'Service not found', 'data': {'url': '/queue/count'}}))
			return
		}

		const condition = { 
			service_id: services._id,
			is_called: false,
			date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD') 
		}

		try {
			var countQueue = await Queue.countDocuments(condition)
			// countQueue = countQueue > 0 && countInit > 0 ? countQueue - 1 : countQueue
			socket.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'count_queue': countQueue, 'url': '/queue/count'}}))
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {'url': '/queue/count'}}))
		}
	}

	// call user
	async function callUser(socket, loket_id, text) {
		var url = '/queue/call'
		try {
			var loket = await Loket.findOne({_id: loket_id})
		} catch(e) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': e.message, 'data': {'url': url}}))
			return
		}

		if (loket == null) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': 'Loket not found', 'data': {'url': url}}))
			return
		}

		if (text.length == 0) {
			socket.send(JSON.stringify({'statusCode': 500, 'message': 'Text is empty', 'data': {'url': url}}))
			return
		}

		// broadcast call user
		fastify.ws.clients.forEach(function each(client) {
	    if (client.readyState === WebSocket.OPEN && client.room == loket.service_provider_id) {
	      client.send(JSON.stringify({'statusCode': 200, 'message': '', 'data': {'url': url, 'text': text}}))
	    }
	  })

	}
}

module.exports = WsController