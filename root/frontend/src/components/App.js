import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import io from 'socket.io-client';

const environment = process.env.NODE_ENV;
const socket =
	environment === 'development'
		? {
				emit: () => {},
				off: () => {},
				on: () => {}
		  }
		: io({
				autoConnect: false
		  });

const App = () => {
	const [metadata, setMetadata] = useState({});
	const [volume, setVolume] = useState(0.01);
	const [action, setAction] = useState('stop');
	const [muted, setMuted] = useState(false);
	const [listeners, setListeners] = useState(null);

	useEffect(() => {
		if (environment === 'development') {
			setTimeout(() => {
				setMetadata({
					artist: 'Front End Developer',
					title: 'MERN - Mongo/Express/React/Node',
					album: 'Fullstack',
					url: 'https://github.com/KingOfCaves',
					cover: '/images/covers/unknown.gif'
				});
				setListeners(100);
			}, 3000);
		} else {
			socket.connect();
			socket.on('metadataUpdate', (metadata) => setMetadata(metadata));
			socket.on('listeners', (listenerCount) => setListeners(listenerCount));
		}

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, []);

	useEffect(() => {
		document.querySelector('audio').volume = volume;
	}, [volume]);

	const handleVolumeChange = (e) => {
		setVolume(e.target.value);
	};

	const handlePlay = () => {
		const radio = document.querySelector('audio');

		if (action === 'play') {
			radio.src = '';
			radio.currentTime = 0;
			setAction('stop');
		} else if (action === 'stop') {
			radio.src = '/radio';
			radio.load();
			setAction('load');
			const playPromise = radio.play();
			if (playPromise !== undefined) {
				playPromise
					.then(function() {
						setAction('play');
					})
					.catch(function(error) {
						console.log('woah!', error);
						setAction('stop');
					});
			}
		}
	};

	const handleMute = () => {
		setMuted(!muted);
	};

	return (
		<div className="player">
			<div className="player__header">
				{listeners ? (
					<div className="player__listeners">clients : {listeners}</div>
				) : (
					<Loader />
				)}
			</div>
			<div className="player__info">
				<a
					className="player__art"
					href={metadata.url}
					target="_blank"
					rel="noopener noreferrer"
				>
					{!!metadata.cover ? (
						<img src={metadata.cover} alt="cover art" />
					) : (
						<Loader />
					)}
				</a>
				<div className="player__text">
					<div className="player__field">
						<div className="player__subtitle">Track</div>
						<div className="player__title">
							{!!metadata.title ? metadata.title : <Loader />}
						</div>
					</div>
					<div className="player__field">
						<div className="player__subtitle">Album</div>
						<div className="player__title">
							{!!metadata.album ? metadata.album : <Loader />}
						</div>
					</div>
					<div className="player__field">
						<div className="player__subtitle">Artist</div>
						<div className="player__title">
							{!!metadata.artist ? metadata.artist : <Loader />}
						</div>
					</div>
				</div>
			</div>
			<div className="player__controls">
				<audio muted={muted} preload="auto"></audio>
				<input
					type="range"
					value={volume}
					max="1"
					step="0.01"
					onChange={handleVolumeChange}
					className="player__volume"
				></input>

				<div
					className={`player__volume__display ${muted ? 'muted' : ''}`}
					onClick={handleMute}
				>
					{(volume * 100).toFixed(0)}%
				</div>
				{action === 'load' ? (
					<Loader />
				) : (
					<div className="player__playpause" onClick={handlePlay}>
						{action === 'play' ? '▌▌' : '▶'}
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
