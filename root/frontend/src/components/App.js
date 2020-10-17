import React, { useState, useEffect, useRef } from 'react';
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

	const fullhouse = !!metadata.artist && !!metadata.album && !!metadata.title;

	const [popUp, setPopUp] = useState({
		text: '',
		active: false,
	});
	let popUpTimerRef = useRef(null);

	useEffect(() => {
		if (environment === 'development') {
			setTimeout(() => {
				setMetadata({
					artist: '中森明菜',
					album: 'Slow Motion スローモーション',
					title: 'スローモーション',
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

	const handleVolumeChange = (e) => {
		setVolume(e.target.value);
	};

	useEffect(() => {
		document.querySelector('.player__audio').volume = volume;
	}, [volume]);

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

	const handleInfoMouse = (e) => {
		if (!!e.target.dataset.info) {
			setEnteredInfo(true);
			setCurrentInfo(e.target.dataset.info);
		} else {
			setEnteredInfo(false);
			setCurrentInfo('');
		}
	};

	const handleInfoMouseMove = (e) => {
		const tooltip = document.querySelector('.player__tooltip');
		if (!!e.target.dataset.info) {
			tooltip.style.left = `${e.clientX + 10}px`;
			tooltip.style.top = `${e.clientY - 40}px`;
		}
	};

	const handleInfoClick = (e) => {
		if (Array.from(e.currentTarget.querySelectorAll('li')).includes(e.target) && fullhouse) {
			const data = e.target.dataset;
			window.getSelection().selectAllChildren(e.target);
			document.execCommand('copy');
			setPopUp({ active: true, text: `${data.info} - copied!` });
		}
	};

	useEffect(() => {
		if (popUpTimerRef.current !== null) {
			clearTimeout(popUpTimerRef.current);
		}
		popUpTimerRef.current = setTimeout(() => setPopUp({ active: false }), 3000);
	}, [popUp]);

	const handleVolumeClick = (state) => {
		setDisplayVolume(state);
	};

	const handleIcon = (playerState) => {
		switch (true) {
			case playerState === 'play':
				return <div className="player__icon__pause"></div>;
			case playerState === 'stop':
				return <div className="player__icon__play"></div>;
			default:
				return <Loader />;
		}
	};

	const volumeFormat = (vol) => {
		const toHundred = +(vol * 100).toFixed(0);
		if (toHundred < 10) return `00${toHundred}%`;
		if (toHundred < 100) return `0${toHundred}%`;
		if (toHundred === 100) return `${toHundred}%`;
	};

	return (
		<div id="desktop" onMouseOver={handleInfoMouse} onMouseMove={handleInfoMouseMove}>
			{/* <img
				className="splash__banner"
				src="/images/fountainofdreamsbanner.gif"
				alt="fountain of dreams banner"
			/> */}
			<WindowBorder title="terminal" type="dark" titlebar={true} extraDecor={true}>
				<ol
					className="player__info"
					onClick={handleInfoClick}
					onMouseLeave={() => setEnteredInfo(false)}
					onContextMenu={(e) => e.preventDefault()}
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
				<div>{`${currentInfo}`}</div>
			</WindowBorder>
			<WindowBorder helperClasses={`player__popup ${popUp.active ? 'active' : ''}`}>
				<div>{popUp.text}</div>
			</WindowBorder>
		</div>
	);
};

export default App;
