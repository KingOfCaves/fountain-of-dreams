const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');
const mm = require('music-metadata');
const { pipeline } = require('stream');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const build_dir = path.join(__dirname, '../frontend/build');
app.use(express.static(build_dir));

require('dotenv').config();

const PORT = process.env.PORT || 8000;
const ICECAST_PORT = process.env.ICECAST_PORT || 8080;
const MOUNTPOINT = process.env.MOUNTPOINT || 'radio';
const URL = `http://localhost:${ICECAST_PORT}/${MOUNTPOINT}`;

let currentMetadata = {};

http.get(URL, async (src) => {
	let keepParsing = true;

	src.on('end', () => {
		keepParsing = false;
		console.log('stream ended...');
	});
	src.on('error', (error) => {
		keepParsing = false;
		console.log('stream crashed...\n', error);
	});

	while (keepParsing) {
		try {
			await mm.parseStream(src, 'audio/ogg', {
				skipPostHeaders: true,
				skipCovers: true,
				observer: (update) => {
					const { artist, title, album } = update.metadata.common;
					const allTags = artist && title && album;
					const changed =
						currentMetadata.artist !== artist || currentMetadata.album !== album || currentMetadata.title !== title;

					if (allTags && changed) {
						currentMetadata = {
							title,
							album,
							artist,
						};
						io.emit('metadataUpdate', currentMetadata);
						console.log(currentMetadata);
					}
				},
			});
		} catch (error) {
			console.log(error);
		}
	}
});

io.on('connection', (socket) => {
	io.emit('listeners', io.sockets.clients.length);
	socket.emit('metadataUpdate', currentMetadata);
});

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/radio', (req, res) => {
	res.set({ 'Content-Type': 'audio/ogg' });
	http.get(URL, (src) => {
		pipeline(src, res, (error) => {
			if (error.message === 'Premature close') return;
			console.log('/radio\n', error);
		});
	});
});

app.get('/info', (req, res) => {
	res.set({ 'Content-Type': 'application/json' });
	res.send(currentMetadata);
});

app.get('*', (req, res) => {
	res.redirect('/');
});

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}\n`);
});
