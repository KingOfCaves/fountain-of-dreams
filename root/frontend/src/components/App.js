import React, { useState, useEffect, Fragment } from 'react';
import Loader from './Loader';
import io from 'socket.io-client';
import WindowBorder from './WindowBorder';

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
	const [volume, setVolume] = useState(0);
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
		<Fragment>
			{/* <img
				className="splash__banner"
				src="/images/fountainofdreamsbanner.gif"
				alt="fountain of dreams banner"
			/> */}
			<WindowBorder title="terminal" type="dark" titlebar={true} extraDecor={true}>
				<ol className="player__info">
					<li className="player__info__artist">{metadata.artist ? metadata.artist : ' '}</li>
					<li className="player__info__album">{metadata.album ? metadata.album : ' '}</li>
					<li className="player__info__title">{metadata.title ? metadata.title : ' '}</li>
					<div className="player__info__decor">
						<span>info.txt</span>
						<span>[utf-8]</span>
					</div>
				</ol>
			</WindowBorder>
			<WindowBorder>
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
					<div className={`player__volume__display ${muted ? 'muted' : ''}`} onClick={handleMute}>
						{(volume * 100).toFixed(0)}%
					</div>
					{action === 'load' ? <Loader /> : <div className="player__playpause" onClick={handlePlay}></div>}
				</div>
			</WindowBorder>
			<WindowBorder title="coverart" titlebar={true} extraDecor={true}>
				<div className="player__coverart">
					{metadata.cover ? <img src={metadata.cover} alt={metadata.album} /> : <Loader />}
				</div>
			</WindowBorder>
		</Fragment>
	);
};

export default App;
