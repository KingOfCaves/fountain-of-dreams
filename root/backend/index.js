const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const icy = require('icy');
const Parser = require('icecast-parser');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

require('dotenv').config();

const PORT = process.env.PORT || 8000;
const ICECAST_PORT = process.env.ICECAST_PORT || 8080;
const IP_ADDRESS = process.env.IP_ADDRESS || 'localhost';
const radioInfo = new Parser(`http://${IP_ADDRESS}:${ICECAST_PORT}/radio`);

radioInfo.on('metadata', ({ StreamTitle }) => {
	const [artist, track] = StreamTitle.split('//').map((tag) => tag.trim());
	io.emit('metadataUpdate', { artist, track });
});

const build_dir = path.join(__dirname, '../frontend/build');
app.use(express.static(build_dir));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/radio', (req, res) => {
	res.setHeader('Content-Type', 'audio/mpeg');
	icy.get({ port: ICECAST_PORT, path: '/radio' }, (src) => src.pipe(res));
});

app.get('*', (req, res) => {
	res.redirect('/');
});

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
