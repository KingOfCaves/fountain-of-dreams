const path = require('path');
const http = require('http');
const express = require('express');
const icy = require('icy');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 8000;
const IP_ADDRESS = process.env.IP_ADDRESS || 'localhost';

const public_dir = path.join(__dirname, '../public');
app.use(express.static(public_dir));

app.get('/', (req, res) => {
	res.render('index')
});

app.get('/radio', (req, res) => {
	icy.get({
		port: 8080,
		path: '/radio',
		headers: { 'Content-Type': 'audio/mpeg' }
	}, (src) => {
		src.on('metadata', (metadata) => {
			const { StreamTitle: info } = icy.parse(metadata);
			io.emit('metadataUpdate', info);
		});
		src.on('error', (error) => {
			console.log(`woops ${error}`)
		});
		src.on('end', () => {
		});

		src.pipe(res);
	});
});

app.get('*', (req, res) => {
	res.redirect('/')
});

server.listen(PORT, IP_ADDRESS, () => {
	console.log(`Server is running on port ${PORT}`);
});