import React, { useState, useEffect } from 'react';
import WindowBorder from './WindowBorder';
import Loader from './Loader';

const ControlsWindow = ({ type, handleMinimize, handleMax, minimize, max, layer }) => {
	const [volume, setVolume] = useState(localStorage.getItem('userVolume') || 0.1);
	const [acceptedSrc, setAcceptedSrc] = useState('');
	const [action, setAction] = useState('stop');
	const [muted, setMuted] = useState(false);

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

	return (
		<WindowBorder
			helperId="window-controls"
			type={type}
			titlebar={true}
			title="controls"
			extraDecor={false}
			handleMinimize={handleMinimize}
			minimize={minimize}
			layer={layer}
		>
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
	);
};

export default ControlsWindow;
