import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import io from 'socket.io-client';

const environment = process.env.NODE_ENV;
const socket =
	environment === 'development'
		? {
				emit: () => {},
				off: () => {},
				on: () => {},
		  }
		: io({
				autoConnect: false,
		  });

const App = () => {
	const [metadata, setMetadata] = useState({});
	const [volume, setVolume] = useState(0.01);
	const [action, setAction] = useState('stop');
	const [muted, setMuted] = useState(false);

	useEffect(() => {
		if (environment === 'development') {
			setTimeout(() => {
				setMetadata({
					artist: '間宮貴子',
					title: '真夜中のジョーク',
					album: 'Love Trip',
					cover: '/images/covers/unknown.jpg',
				});
			}, 5000);
		} else {
			socket.connect();
			socket.on('metadataUpdate', (metadata) => setMetadata(metadata));
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
					.then(function () {
						setAction('play');
					})
					.catch(function (error) {
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
		<div className="wrapper">
			{/* <img
				className="splash__banner"
				src="/images/fountainofdreamsbanner.gif"
				alt="fountain of dreams banner"
			/> */}
			<div className="window">
				<div className="player">
					{metadata.artist ? <p>{metadata.artist}</p> : <Loader />}
					{metadata.album ? <p>{metadata.album}</p> : <Loader />}
					{metadata.title ? <p>{metadata.title}</p> : <Loader />}
					{metadata.cover ? (
						<img src={metadata.cover} alt={metadata.album} />
					) : (
						<Loader />
					)}
					<div className="player__controls">
						<audio muted={muted} preload="auto"></audio>
						<input
							className="player__volume"
							type="range"
							value={volume}
							max="1"
							step="0.01"
							onChange={handleVolumeChange}
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
			</div>
		</div>
	);
};

export default App;
