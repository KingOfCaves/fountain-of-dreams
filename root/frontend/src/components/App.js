import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import WelcomeWindow from './WelcomeWindow';
import InfoWindow from './InfoWindow';
import ControlsWindow from './ControlsWindow';
import CoverartWindow from './CoverartWindow';
import LauncherWindow from './LauncherWindow';
import TooltipWindow from './TooltipWindow';

import AppContext from '../context/AppContext';

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
	const [windows, setWindows] = useState(
		// localStorage.getItem('windows')
		// 	? JSON.parse(localStorage.getItem('windows'))
		// 	:
		[
			{
				component: WelcomeWindow,
				icon: 'text-x-java.png',
				open: true,
			},
		]
	);
	const [mDown, setmDown] = useState(false);

	const clickedWindow = useRef(null);
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

	useEffect(() => {
		localStorage.setItem('windows', windows);
	}, [windows]);

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

	const handleDesktopMouseMove = (e) => {
		const { movementX, movementY } = e;

		if (mDown && clickedWindow.current) {
			const currentWindow = clickedWindow.current;
			const parseTransform = window
				.getComputedStyle(currentWindow)
				.transform.split(/\(|,|\)/)
				.slice(1, -1)
				.map((v) => parseFloat(v));
			const [transX, transY] = parseTransform.slice(Math.max(parseTransform.length - 2, 0));
			currentWindow.style.transform = `translate(${transX + movementX}px, ${transY + movementY}px)`;
		}
	};

	const handleDesktopClick = (e, holding) => {
		setmDown(holding);
		const currentWindow = e.target.closest('.window');
		if (holding && currentWindow) {
			if (e.target.classList.contains('window__titlebar__name')) {
				clickedWindow.current = currentWindow;
				// refPoint.current = currentWindow.querySelector('');
			}
			const oldOrder = Array.from(document.querySelectorAll('.window:not(.player__tooltip)')).sort(
				(a, b) => a.style.zIndex - b.style.zIndex
			);
			const currentIndex = oldOrder.findIndex((el) => el === currentWindow);
			oldOrder.splice(currentIndex, 1);
			oldOrder.push(currentWindow);
			oldOrder.forEach((el, index) => (el.style.zIndex = index + 1));
		} else {
			clickedWindow.current = null;
		}
	};

	return (
		<div
			id="desktop"
			onMouseDown={(e) => handleDesktopClick(e, true)}
			onMouseUp={(e) => handleDesktopClick(e, false)}
			onMouseMove={handleDesktopMouseMove}
		>
			<AppContext.Provider value={{ windowSet: [windows, setWindows] }}>
				<main
					onMouseOver={handleInfoMouse}
					onMouseMove={handleInfoMouseMove}
					onMouseLeave={() => setEnteredInfo(false)}
				>
					{windows.map((win) => win.open && <win.component />)}
					<InfoWindow metadata={metadata} fullhouse={fullhouse} />
					<ControlsWindow />
					<CoverartWindow metadata={metadata} />
				</main>
				<LauncherWindow />
				<TooltipWindow enteredInfo={enteredInfo} currentInfo={currentInfo} />
			</AppContext.Provider>
		</div>
	);
};

export default App;
