import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import WelcomeWindow from './WelcomeWindow';
import HelpWindow from './HelpWindow';
import StylistWindow from './StylistWindow';
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
				type: 'other',
				icon: 'text-x-java.png',
				alt: 'welcome',
				minimize: false,
				max: false,
				layer: 1,
			},
			{
				component: HelpWindow,
				type: 'dark',
				icon: 'accessories-dictionary.png',
				alt: 'help',
				minimize: true,
				max: false,
				layer: 0,
			},
			{
				component: StylistWindow,
				type: 'light',
				icon: 'preferences-desktop.png',
				alt: 'stylist',
				minimize: true,
				max: false,
				layer: 0,
			},
			{
				component: InfoWindow,
				type: 'dark',
				icon: 'applications-office.png',
				alt: 'track-Info',
				minimize: false,
				max: false,
				layer: 0,
			},
			{
				component: ControlsWindow,
				type: 'light',
				icon: 'media-playback.png',
				alt: 'player controls',
				minimize: false,
				max: false,
				layer: 0,
			},
			{
				component: CoverartWindow,
				type: 'light',
				icon: 'image-x-generic.png',
				alt: 'coverart',
				minimize: false,
				max: false,
				layer: 0,
			},
		]
	);
	const [customStyles, setCustomStyles] = useState({
		background: {
			light: ['#dcdcd0', '#e6e6da'],
			dark: ['#8b9186', '#677267'],
			image: '',
		},
		windowLight: {
			light: '#dbe0d7',
			medium: '#9fa696',
			dark: '#52564e',
			title: '#4b4c48',
		},
		windowDark: {
			light: '#8a9489',
			medium: '#646c63',
			dark: '#353835',
			title: '#ddded2',
		},
		windowOther: {
			light: '#7a739b',
			medium: '#5b576d',
			dark: '#313136',
			title: '#ddded2',
		},
	});
	const [mDown, setmDown] = useState(false);
	const clickedWindow = useRef(null);

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
		const currentWindow = e.target.closest('main > .window');
		if (holding && currentWindow) {
			if (e.target.classList.contains('window__titlebar__name')) {
				clickedWindow.current = currentWindow;
				// refPoint.current = currentWindow.querySelector('');
			}
		} else {
			clickedWindow.current = null;
		}
	};

	const handleMinimize = (w) => {
		const update = windows.map((win, index) => {
			if (index === w) win.minimize = !win.minimize;
			return win;
		});
		setWindows(update);
	};

	const handleMax = (w) => {
		const update = windows.map((win, index) => {
			if (index === w) win.max = !win.max;
			return win;
		});
		setWindows(update);
	};

	const generateStyle = () => {
		const { background, windowLight, windowDark, windowOther } = customStyles;

		return [
			':root {',
			background.light[0] && `	--bg-light-color-1: ${background.light[0]};`,
			background.light[1] && `	--bg-light-color-2: ${background.light[1]};`,
			background.dark[0] && `	--bg-dark-color-1: ${background.dark[0]};`,
			background.dark[1] && `	--bg-dark-color-2: ${background.dark[1]};`,
			'}',
			'body {',
			background.image &&
				`	background-image: url(${background.image});\nbackground-size: cover;\nbackground-repeat: none;\nbackground-position: center;`,
			'}',
			'.window--light {',
			windowLight.light && `	--border-light: ${windowLight.light};`,
			windowLight.medium && `	--border-medium: ${windowLight.medium};`,
			windowLight.dark && `	--border-dark: ${windowLight.dark};`,
			windowLight.title && `	--border-title: ${windowLight.title};`,
			'}',
			'.window--dark {',
			windowDark.light && `	--border-light: ${windowDark.light};`,
			windowDark.medium && `	--border-medium: ${windowDark.medium};`,
			windowDark.dark && `	--border-dark: ${windowDark.dark};`,
			windowDark.title && `	--border-title: ${windowDark.title};`,
			'}',
			'.window--other {',
			windowOther.light && `	--border-light: ${windowOther.light};`,
			windowOther.medium && `	--border-medium: ${windowOther.medium};`,
			windowOther.dark && `	--border-dark: ${windowOther.dark};`,
			windowOther.title && `	--border-title: ${windowOther.title};`,
			'}',
		];
	};

	return (
		<>
			<style>{generateStyle()}</style>
			<div
				id="desktop"
				onMouseDown={(e) => handleDesktopClick(e, true)}
				onMouseUp={(e) => handleDesktopClick(e, false)}
				onMouseMove={handleDesktopMouseMove}
			>
				<AppContext.Provider
					value={{ windowSet: [windows, setWindows], colorSet: [customStyles, setCustomStyles], metadata }}
				>
					<main
						onMouseOver={handleInfoMouse}
						onMouseMove={handleInfoMouseMove}
						onMouseLeave={() => setEnteredInfo(false)}
					>
						{windows.map((win, index) => (
							<win.component
								key={`${win.component}`}
								type={win.type}
								handleMinimize={() => handleMinimize(index)}
								handleMax={() => handleMax(index)}
								minimize={win.minimize}
								max={win.max}
								layer={win.layer}
							/>
						))}
					</main>
					<LauncherWindow />
					<TooltipWindow enteredInfo={enteredInfo} currentInfo={currentInfo} />
				</AppContext.Provider>
			</div>
		</>
	);
};

export default App;
