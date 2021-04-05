import React, { useState, useEffect } from 'react';
import WindowBorder from './WindowBorder';
import Loader from './Loader';

const ControlsWindow = ({ type, handleMinimize, handleMax, handleLayering, handleWindowClick, minimize, max, layer }) => {
	const [volume, setVolume] = useState(localStorage.getItem('volume') || 0.1);
	const [acceptedSrc, setAcceptedSrc] = useState('');
	const [action, setAction] = useState('stop');
	const [muted, setMuted] = useState(false);
	let radio = null;

	const handleVolumeChange = (e) => {
		setVolume(e.target.value);
	};

	useEffect(() => {
		radio.volume = volume;
		localStorage.setItem('volume', volume);
	}, [radio, volume]);

	useEffect(() => {
		if (radio.canPlayType('audio/ogg')) {
			setAcceptedSrc('/ogg');
		} else {
			setAcceptedSrc('/mp3');
		}
	}, [radio]);

	const handlePlay = () => {
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
			handleLayering={handleLayering}
			handleWindowClick={handleWindowClick}
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
				<button className="player__playpause player__button" onClick={handlePlay}>
					{handleIcon(action)}
				</button>
				<button className="player__mutetoggle player__button" onClick={handleMute}>
					{muted ? (
						<img src="/images/icons/sound_off.svg" alt="umute" />
					) : (
						<img src="/images/icons/sound_on.svg" alt="mute" />
					)}
				</button>
				<audio
					ref={(audio) => {
						radio = audio;
					}}
					className="player__audio"
					muted={muted}
					preload="auto"
				></audio>
			</div>
		</WindowBorder>
	);
};

export default ControlsWindow;
