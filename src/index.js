const path = require('path');
const http = require('http');
const express = require('express');
const icy = require('icy');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 8080;

const public_dir = path.join(__dirname, '../public');
app.use(express.static(public_dir));

app.get('/', (req, res) => {
	res.render('index')
});

app.get('/stream', (req, res) => {
	icy.get('http://localhost:8080/stream', (data) => {
		data.on('metadata', (metadata) => {
			const { StreamTitle: info } = icy.parse(metadata);
			io.sockets.emit('metadataUpdate', info);
		});
		data.pipe(res);
	});
});

server.listen(PORT, () => {
	console.log(`Server is running on port ${ PORT }`)
});