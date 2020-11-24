const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');
const mm = require('music-metadata');
const { pipeline } = require('stream');
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ICECAST_PORT = process.env.ICECAST_PORT || 8000;
const CERT_LOC = process.env.CERT_LOC;
const OGG_MOUNTPOINT = 'ogg';
const MPEG_MOUNTPOINT = 'mp3';
const URL = `http://localhost:${ICECAST_PORT}`;

const app = express();
const server = https.createServer(
	{
		key: fs.readFileSync(`${CERT_LOC}/privkey.pem`, 'utf-8'),
		cert: fs.readFileSync(`${CERT_LOC}/fullchain.pem`, 'utf-8'),
	},
	app
);
const io = socketio.listen(server);

const build_dir = path.join(__dirname, '../frontend/build');
app.use(express.static(build_dir, { dotFiles: 'allow' }));

let currentMetadata = {};

http.get(`${URL}/${OGG_MOUNTPOINT}`, async (src) => {
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
	console.log(io.sockets.clients.length);
	socket.emit('metadataUpdate', currentMetadata);
});

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/ogg', (req, res) => {
	res.set({ 'Content-Type': 'audio/ogg' });
	http.get(`${URL}/${OGG_MOUNTPOINT}`, (src) => {
		pipeline(src, res, (error) => {
			if (error.message === 'Premature close') return;
			console.log('/radio\n', error);
		});
	});
});

app.get('/mp3', (req, res) => {
	res.set({ 'Content-Type': 'audio/mpeg' });
	http.get(`${URL}/${MPEG_MOUNTPOINT}`, (src) => {
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
