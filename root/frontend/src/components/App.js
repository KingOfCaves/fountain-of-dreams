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
	const [volume, setVolume] = useState(localStorage.getItem('userVolume') || 0.1);
	const [currentInfo, setCurrentInfo] = useState('');
	const [enteredInfo, setEnteredInfo] = useState(false);
	const [acceptedSrc, setAcceptedSrc] = useState('');
	const [action, setAction] = useState('stop');
	const [muted, setMuted] = useState(false);
	const [newVisitor, setNewVisitor] = useState(
		localStorage.getItem('newVisitor') ? JSON.parse(localStorage.getItem('newVisitor')) : true
	);

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
		localStorage.setItem('userVolume', volume);
	}, [volume]);

	useEffect(() => {
		const radio = document.querySelector('.player__audio');

		if (radio.canPlayType('audio/ogg')) {
			setAcceptedSrc('/ogg');
		} else {
			setAcceptedSrc('/mp3');
		}
	}, []);

	const handlePlay = () => {
		const radio = document.querySelector('.player__audio');

		if (action === 'play') {
			radio.src = '';
			radio.currentTime = 0;
			setAction('stop');
		} else if (action === 'stop') {
			radio.src = acceptedSrc;
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
			// document.execCommand('copy');
			// setPopUp({ active: true, text: `${data.info} - copied!` });
		}
	};

	useEffect(() => {
		if (popUpTimerRef.current !== null) {
			clearTimeout(popUpTimerRef.current);
		}
		popUpTimerRef.current = setTimeout(() => setPopUp({ active: false }), 3000);
	}, [popUp]);

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

	const handleExit = () => {
		setNewVisitor(false);
	};

	useEffect(() => {
		localStorage.setItem('newVisitor', newVisitor);
	}, [newVisitor]);

	return (
		<div
			id="desktop"
			onMouseOver={handleInfoMouse}
			onMouseMove={handleInfoMouseMove}
			onMouseLeave={() => setEnteredInfo(false)}
		>
			{newVisitor && (
				<WindowBorder
					closable={{ enabled: true, fn: handleExit }}
					helperClasses="splash"
					type="other"
					title="introduction"
					titlebar={true}
				>
					<div className="splash__banner"></div>
					<div className="splash__text">
						<p>Welcome!</p>
						<p>fountain_of_dreams is an internet radio with a primary focus on 80's tunes from Japan.</p>
						<h2>tips & tricks</h2>
						<p>
							There is a minimize button on the left and an exit button on the right for every window that has a
							titlebar enabled.
						</p>
						<WindowBorder
							helperClasses="splash__test"
							type="dark"
							title="clickme!"
							titlebar={true}
							extraDecor={true}
						/>
						<p>
							For most windows they don't do anything, but the intro window you are looking at right now can be
							closed.
						</p>
						<p></p>
						<p>Enjoy!</p>
					</div>
				</WindowBorder>
			)}
			<WindowBorder helperClasses="arranged-a" type="dark" titlebar={true} extraDecor={true}>
				<ol className="player__info" onClick={handleInfoClick}>
					<li className="player__info__artist" data-info="artist">
						{metadata.artist || '. . .'}
					</li>
					<li className="player__info__album" data-info="album">
						{metadata.album || '. . .'}
					</li>
					<li className="player__info__title" data-info="title">
						{metadata.title || '. . .'}
					</li>
					<div className="player__info__decor">
						<span>info.txt</span>
						<span>[utf-8]</span>
					</div>
				</ol>
			</WindowBorder>
			<WindowBorder helperClasses="arranged-b">
				<div className="player__controls">
					<input
						className="player__volume"
						type="range"
						value={volume}
						max="1"
						step="0.01"
						onChange={handleVolumeChange}
					></input>
					<div className={`player__volume__display`}>
						<span>Volume</span>
						<span>{(volume * 100).toFixed(0) + '%'}</span>
					</div>
					<div className="player__playpause player__button" onClick={handlePlay}>
						{handleIcon(action)}
					</div>
					<div className="player__mutetoggle player__button" onClick={handleMute}>
						{muted ? (
							<img src="/images/icons/sound_off.svg" alt="umute" />
						) : (
							<img src="/images/icons/sound_on.svg" alt="mute" />
						)}
					</div>
					<audio className="player__audio" muted={muted} preload="auto"></audio>
				</div>
			</WindowBorder>
			<WindowBorder helperClasses="arranged-c" title="coverart" titlebar={true} extraDecor={true}>
				<div className="player__coverart">
					<img src="/images/covers/unknown.jpg" alt={metadata.album} data-info="Coming soon!" />
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
