const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mm = require('music-metadata');
const fg = require('fast-glob');
const { pipeline } = require('stream');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const build_dir = path.join(__dirname, '../frontend/build');
app.use(express.static(build_dir));

require('dotenv').config();

const PORT = process.env.PORT || 8000;
const ICECAST_PORT = process.env.ICECAST_PORT || 8080;
const IP_ADDRESS = process.env.IP_ADDRESS || '0.0.0.0';
const MOUNTPOINT = process.env.MOUNTPOINT || 'radio';
const URL = `http://${IP_ADDRESS}:${ICECAST_PORT}/${MOUNTPOINT}`;

let currentMetadata = {};

http.get(URL, (src) => {
	src.on('end', () => console.log('stream ended...'));
	src.on('error', (error) => console.log('stream crashed...\n', error));

	const siftThrough = async () => {
		return await mm
			.parseStream(src, 'audio/ogg', {
				skipPostHeaders: true,
				skipCovers: true,
				observer: (update) => {
					const { artist, title, album, comment } = update.metadata.common;
					const allTags = artist && title && album && comment;
					const changed =
						currentMetadata.artist !== artist ||
						currentMetadata.album !== album ||
						currentMetadata.title !== title;

					if (allTags && changed) {
						const coverFind =
							fg.sync('../frontend/public/images/covers/*').find((item) => {
								const fixedFormat = (text) => {
									return text
										.replace(/\//g, '-')
										.replace(/,/g, '_-_')
										.replace(/[|]/g)
										.replace(/　/, ' ')
										.replace(/\s\s+/g, ' ')
										.normalize();
								};
								const fixedAlbum = fixedFormat(album);
								const fixedArtist = fixedFormat(artist);

								return item.includes(fixedAlbum);
							}) || 'unknown.gif';
						const cover = `/images/covers/${path.basename(coverFind)}`;
						const url =
							comment || !comment.length === 0
								? comment
										.find((item) => item.includes('http'))
										.match(/\bhttps?:\/\/\S+/gm)[0] || 'N/A'
								: 'N/A';
						currentMetadata = {
							title,
							album,
							artist,
							url,
							cover,
						};
						io.emit('metadataUpdate', currentMetadata);
						console.log(currentMetadata);
					}
				},
			})
			.then(() => siftThrough())
			.catch((error) => console.log(error));
	};
	siftThrough();
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
	console.log(`Server is running on port ${PORT}`);
});
