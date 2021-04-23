const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mm = require('music-metadata');
const { pipeline } = require('stream');
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ICECAST_PORT = process.env.ICECAST_PORT || 8000;
const OGG_MOUNTPOINT = 'ogg';
const MPEG_MOUNTPOINT = 'mp3';
const URL = `http://localhost:${ICECAST_PORT}`;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

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
					const { artist, title, album, comment } = update.metadata.common;
					const allTags = artist && title && album && comment;

					if (allTags) {
						const changed =
							currentMetadata.artist !== artist ||
							currentMetadata.album !== album ||
							currentMetadata.title !== title ||
							currentMetadata.coverart !== comment[0];

						if (changed) {
							const coverart = comment[0] || 'unknown.jpg';
							currentMetadata = {
								title,
								album,
								artist,
								coverart
							};
							io.emit('metadataUpdate', currentMetadata);
							console.log(currentMetadata);
						}
					}
				}
			});
		} catch (error) {
			console.log(error);
		}
	}
});

io.on('connection', (socket) => {
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

app.get('*', (req, res) => {
	res.redirect('/');
});

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}\n`);
});
