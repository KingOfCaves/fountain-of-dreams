import React, { useState, useEffect } from 'react';
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
	const [displayVolume, setDisplayVolume] = useState(false);
	const [currentInfo, setCurrentInfo] = useState('');
	const [enteredInfo, setEnteredInfo] = useState(false);
	const [action, setAction] = useState('stop');
	const [muted, setMuted] = useState(false);

	useEffect(() => {
		if (environment === 'development') {
			setTimeout(() => {
				setMetadata({
					artist: '間宮貴子',
					album: 'Love Trip',
					title: '真夜中のジョーク',
					cover: '/images/covers/unknown.jpg',
				});
			}, 4000);
			setTimeout(() => {
				setMetadata({
					artist: '山下達郎',
					album: 'Melodies',
					title: 'Christmas Eve',
					cover: '/images/covers/unknown.jpg',
				});
			}, 8000);
		} else {
			socket.connect();
			socket.on('metadataUpdate', (metadata) => setMetadata(metadata));
		}

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, []);

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

	const handleInfoMouseEnter = (e) => {
		if (Array.from(e.currentTarget.querySelectorAll('li')).includes(e.target)) {
			setEnteredInfo(true);
			setCurrentInfo(e.target.dataset.info);
		} else {
			setEnteredInfo(false);
		}
	};

	const handleInfoMouseLeave = (e) => {
		setEnteredInfo(false);
		setCurrentInfo('');
	};

	const handleInfoMouseMove = (e) => {
		const tooltip = document.querySelector('.player__tooltip');
		if (Array.from(e.currentTarget.querySelectorAll('li')).includes(e.target)) {
			tooltip.style.left = `${e.clientX + 10}px`;
			tooltip.style.top = `${e.clientY - 25}px`;
		}
	};

	const handleInfoClick = (e) => {
		if (Array.from(e.currentTarget.querySelectorAll('li')).includes(e.target)) {
			window.getSelection().selectAllChildren(e.target);
		}
	};

	const handleVolumeClick = (state) => {
		setDisplayVolume(state);
	};

	const handleIcon = (playerState) => {
		switch (true) {
			case playerState === 'play':
				return '⏸';
			case playerState === 'stop':
				return '▶';
			default:
				return <Loader />;
		}
	};

	const volumeFormat = (v) => {
		const toHundred = +(v * 100).toFixed(0);
		if (toHundred < 10) return `00${toHundred}%`;
		if (toHundred < 100) return `0${toHundred}%`;
		if (toHundred === 100) return `${toHundred}%`;
	};

	return (
		<div id="desktop">
			{/* <img
				className="splash__banner"
				src="/images/fountainofdreamsbanner.gif"
				alt="fountain of dreams banner"
			/> */}
			<WindowBorder title="terminal" type="dark" titlebar={true} extraDecor={true}>
				<ol
					className="player__info"
					onMouseOver={handleInfoMouseEnter}
					onMouseLeave={handleInfoMouseLeave}
					onMouseMove={handleInfoMouseMove}
					onClick={handleInfoClick}
				>
					<li className="player__info__artist" data-info="artist">
						{metadata.artist}
					</li>
					<li className="player__info__album" data-info="album">
						{metadata.album}
					</li>
					<li className="player__info__title" data-info="title">
						{metadata.title}
					</li>
					<div className="player__info__decor">
						<span>info.txt</span>
						<span>[utf-8]</span>
					</div>
				</ol>
			</WindowBorder>
			<WindowBorder>
				<div className="player__controls">
					<input
						className="player__volume"
						type="range"
						value={volume}
						max="1"
						step="0.01"
						onChange={handleVolumeChange}
						onMouseEnter={() => handleVolumeClick(true)}
						onMouseLeave={() => handleVolumeClick(false)}
						onTouchStart={() => handleVolumeClick(true)}
						onTouchEnd={() => handleVolumeClick(false)}
					></input>
					<div
						className={`player__volume__display ${muted ? 'muted' : ''} ${displayVolume ? 'active' : ''}`}
						onClick={handleMute}
					>
						<span>Volume</span>
						<span>{(volume * 100).toFixed(0) + '%'}</span>
					</div>
					<div className="player__playpause player__button" onClick={handlePlay}>
						{handleIcon(action)}
					</div>
					<audio className="player__audio" muted={muted} preload="auto"></audio>
				</div>
			</WindowBorder>
			<WindowBorder title="coverart" titlebar={true} extraDecor={true}>
				<div className="player__coverart">
					{metadata.cover ? <img src={metadata.cover} alt={metadata.album} /> : <Loader />}
				</div>
			</WindowBorder>
			<WindowBorder helperClasses={`player__tooltip ${enteredInfo ? 'active' : ''}`}>
				<div>{currentInfo}</div>
			</WindowBorder>
		</div>
	);
};

export default App;
