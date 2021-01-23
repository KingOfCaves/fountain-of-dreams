import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import WelcomeWindow from './WelcomeWindow';
import InfoWindow from './InfoWindow';
import ControlsWindow from './ControlsWindow';
import CoverartWindow from './CoverartWindow';
import TooltipWindow from './TooltipWindow';

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
	const [currentInfo, setCurrentInfo] = useState('');
	const [enteredInfo, setEnteredInfo] = useState(false);
	const [newVisitor, setNewVisitor] = useState(
		localStorage.getItem('newVisitor') ? JSON.parse(localStorage.getItem('newVisitor')) : true
	);

	const fullhouse = !!metadata.artist && !!metadata.album && !!metadata.title && !!metadata.coverart;

	useEffect(() => {
		if (environment === 'development') {
			setTimeout(() => {
				setMetadata({
					artist: '中森明菜',
					album: 'Slow Motion (スローモーション)',
					title: 'スローモーション',
					coverart: '[1982.05.01] Slow Motion (スローモーション).jpg',
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
		console.log(e.clientX, e.clientY);
		const tooltip = document.querySelector('.player__tooltip');
		if (!!e.target.dataset.info) {
			tooltip.style.left = `${e.clientX + 10}px`;
			tooltip.style.top = `${e.clientY - 40}px`;
		}
	};

	const handleInfoClick = (e) => {
		if (Array.from(e.currentTarget.querySelectorAll('li')).includes(e.target) && fullhouse) {
			window.getSelection().selectAllChildren(e.target);
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
			{newVisitor && <WelcomeWindow handleExit={handleExit} />}
			<InfoWindow metadata={metadata} handleInfoClick={handleInfoClick} />
			<ControlsWindow />
			<CoverartWindow metadata={metadata} />
			<TooltipWindow enteredInfo={enteredInfo} currentInfo={currentInfo} />
		</div>
	);
};

export default App;
