var mongooseObserver = require('mongoose-observer')

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
					socket.send('Hi client!')
					break;

				default:
					socket.send('Hi client!')
					break;
			}
		} catch(e) {
			socket.send(e.message)
		}
	})

	socket.on('close', () => console.log('Client disconnected.'))
}

module.exports = WsController