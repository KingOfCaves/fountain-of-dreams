import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import tinycolor from 'tinycolor2';

import WelcomeWindow from './WelcomeWindow';
import HelpWindow from './HelpWindow';
import StylistWindow from './StylistWindow';
import InfoWindow from './InfoWindow';
import ControlsWindow from './ControlsWindow';
import CoverartWindow from './CoverartWindow';
import LauncherWindow from './LauncherWindow';
import TooltipWindow from './TooltipWindow';

import AppContext from '../context';
import defaults from '../data/defaults';

const environment = process.env.NODE_ENV;
const socket =
	environment === 'development'
		? {
				emit: () => {},
				off: () => {},
				on: () => {}
		  }
		: io({
				autoConnect: false
		  });

const App = () => {
	const [metadata, setMetadata] = useState({});
	const [windows, setWindows] = useState(
		localStorage.getItem('windows') ? JSON.parse(localStorage.getItem('windows')) : defaults.windows
	);
	const [customColors, setCustomColors] = useState(
		localStorage.getItem('customColors') ? JSON.parse(localStorage.getItem('customColors')) : defaults.customColors
	);
	const [customBackground, setCustomBackground] = useState(
		localStorage.getItem('customBackground')
			? JSON.parse(localStorage.getItem('customBackground'))
			: defaults.customBackground
	);
	const componentLegend = {
		WelcomeWindow: WelcomeWindow,
		HelpWindow: HelpWindow,
		StylistWindow: StylistWindow,
		InfoWindow: InfoWindow,
		ControlsWindow: ControlsWindow,
		CoverartWindow: CoverartWindow
	};
	const windowTemplate = (win, index) => {
		return React.createElement(componentLegend[win.component], {
			key: `${win.component}`,
			type: win.type,
			handleMinimize: () => handleMinimize(index),
			handleMax: () => handleMax(index),
			handleLayering: () => handleLayering(index),
			handleWindowClick,
			minimize: win.minimize,
			max: win.max,
			layer: win.layer
		});
	};
	const [lightFactor, darkFactor] = [24, 48];
	const [generatedColorStyle, setGeneratedColorStyle] = useState([]);
	const [generatedBackgroundStyle, setGeneratedBackgroundStyle] = useState([]);

	const [mDown, setmDown] = useState(false);
	const clickedWindow = useRef(null);

	useEffect(() => {
		if (environment === 'development') {
			setTimeout(() => {
				setMetadata({
					artist: '中森明菜',
					album: 'Slow Motion (スローモーション)',
					title: 'スローモーション',
					coverart: '[1982.05.01] Slow Motion (スローモーション).jpg'
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
		localStorage.setItem('windows', JSON.stringify(windows));
	}, [windows]);
	useEffect(() => {
		localStorage.setItem('customColors', JSON.stringify(customColors));
	}, [customColors]);
	useEffect(() => {
		try {
			localStorage.setItem('customBackground', JSON.stringify(customBackground));
		} catch (error) {
			alert(error);
		}
	}, [customBackground]);

	useEffect(() => {
		setGeneratedColorStyle([
			':root {',
			`--bg-window: ${customColors.colors[3]};`,
			`--bg-inner: ${customColors.colors[5]};`,
			`--window-text-color: ${tinycolor(customColors.colors[3]).isDark() ? 'white' : 'black'};`,
			'}',

			'.popout, button {',
			`background-color: ${customColors.colors[5]};`,
			'border: 1px solid;',
			`border-top-color: ${tinycolor(customColors.colors[5]).lighten(lightFactor)};`,
			`border-right-color: ${tinycolor(customColors.colors[5]).darken(darkFactor)};`,
			`border-bottom-color: ${tinycolor(customColors.colors[5]).darken(darkFactor)};`,
			`border-left-color: ${tinycolor(customColors.colors[5]).lighten(lightFactor)};`,
			`color: ${tinycolor(customColors.colors[5]).isDark() ? 'white' : 'black'};`,
			'}',

			'.popout--alt {',
			`background-color: ${customColors.colors[4]};`,
			'border: 1px solid;',
			`border-top-color: ${tinycolor(customColors.colors[4]).lighten(lightFactor)};`,
			`border-right-color: ${tinycolor(customColors.colors[4]).darken(darkFactor)};`,
			`border-bottom-color: ${tinycolor(customColors.colors[4]).darken(darkFactor)};`,
			`border-left-color: ${tinycolor(customColors.colors[4]).lighten(lightFactor)};`,
			`color: ${tinycolor(customColors.colors[4]).isDark() ? 'white' : 'black'};`,
			'}',

			'section {',
			`border-color: var(--bg-inner);`,
			'}',

			'.window--a {',
			`--border-light: ${tinycolor(customColors.colors[0]).lighten(lightFactor)};`,
			`--border-medium: ${customColors.colors[0]};`,
			`--border-dark: ${tinycolor(customColors.colors[0]).darken(darkFactor)};`,
			`--border-title: ${tinycolor(customColors.colors[0]).isDark() ? 'white' : 'black'};`,
			'}',

			'.window--b {',
			`--border-light: ${tinycolor(customColors.colors[1]).lighten(lightFactor)};`,
			`--border-medium: ${customColors.colors[1]};`,
			`--border-dark: ${tinycolor(customColors.colors[1]).darken(darkFactor)};`,
			`--border-title: ${tinycolor(customColors.colors[1]).isDark() ? 'white' : 'black'};`,
			'}',

			'.window--c {',
			`--border-light: ${tinycolor(customColors.colors[2]).lighten(lightFactor)};`,
			`--border-medium: ${customColors.colors[2]};`,
			`--border-dark: ${tinycolor(customColors.colors[2]).darken(darkFactor)};`,
			`--border-title: ${tinycolor(customColors.colors[2]).isDark() ? 'white' : 'black'};`,
			'}',

			'.window__content {',
			`background-color: ${customColors.colors[3]};`,
			'}',

			'.player__volume__display {',
			`box-shadow: 
			inset calc(var(--border-sizing) * -1) calc(var(--border-sizing) * -1) 0 
				${tinycolor(customColors.colors[6]).darken(darkFactor)},
			inset var(--border-sizing) var(--border-sizing) 0 
				${tinycolor(customColors.colors[6]).lighten(lightFactor)};`,
			`background-color: ${customColors.colors[6]};`,
			`color: ${tinycolor(customColors.colors[6]).isDark() ? 'white' : 'black'};`,
			'}',

			'select {',
			`background-color: ${customColors.colors[3]};`,
			`color: ${tinycolor(customColors.colors[3]).isDark() ? 'white' : 'black'};`,
			'border: 2px solid;',
			`border-left-color: ${tinycolor(customColors.colors[3]).darken(20)};`,
			`border-top-color: ${tinycolor(customColors.colors[3]).darken(20)};`,
			`border-right-color: ${tinycolor(customColors.colors[3]).brighten(20)};`,
			`border-bottom-color: ${tinycolor(customColors.colors[3]).brighten(20)};`,
			'}',

			'.help a {',
			`color: ${tinycolor.mostReadable(customColors.colors[4], ['pink', 'mediumpurple', 'darkmagenta'])};`,
			'}',
			'.help h3 {',
			`color: ${tinycolor.mostReadable(customColors.colors[4], ['palegreen', 'mediumseagreen', 'darkgreen'])};`,
			'}'
		]);
	}, [customColors, lightFactor, darkFactor]);

	useEffect(() => {
		setGeneratedBackgroundStyle([
			'body {',
			`background-color: ${customBackground.color};`,
			`background-image: url(${customBackground.image});`,
			'background-size: cover;',
			'background-position: center;',
			customBackground.rendering === 'pixelated'
				? [
						'image-rendering: pixelated;',
						'image-rendering: -moz-crisp-edges;',
						'-ms-interpolation-mode: nearest-neighbor;'
				  ].join('\n')
				: ['image-rendering: auto;', 'image-rendering: smooth;', 'image-rendering: high-quality;'].join('\n'),
			'}'
		]);
	}, [customBackground]);

	const handleDesktopMouseMove = (e) => {
		const { clientX, clientY, movementX, movementY } = e;
		if (mDown && clickedWindow.current) {
			const currentWindow = clickedWindow.current;

			const parseTransform = window
				.getComputedStyle(currentWindow)
				.transform.split(/\(|,|\)/)
				.slice(1, -1)
				.map((v) => parseFloat(v));
			const [transX, transY] = parseTransform.slice(Math.max(parseTransform.length - 2, 0));
			currentWindow.style.transform = `translate(${transX + movementX}px, ${transY + movementY}px)`;

			// const { x: winX, y: winY } = currentWindow.getBoundingClientRect();
			// const desktopXBound = Math.min(Math.max(0, clientX + (winX - clientX) + movementX), document.inn);
			// const desktopYBound = Math.min(Math.max(0, clientY + (winY - clientY) + movementY), document.innerHeight);
			// currentWindow.style.left = desktopXBound + 'px';
			// currentWindow.style.top = desktopYBound + 'px';
		}
	};

	const handleWindowClick = (target, holding) => {
		setmDown(holding);
		if (target && holding) {
			clickedWindow.current = target;
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

	const handleLayering = (w) => {
		const zMax = Math.max(...windows.map((win) => win.layer));
		console.log(zMax);
		const update = windows.map((win, index) => {
			if (index === w) {
				console.log(win);
				win.layer = zMax + 1;
			}
			return win;
		});
		setWindows(update);
	};

	const windowSeparator = () => {
		const m = [];
		const d = windows
			.map((win, index) => {
				if (win.main) {
					m.push([win, index]);
					return null;
				}
				return [win, index];
			})
			.filter((i) => i);

		return (
			<>
				<main>{m.map(([win, index]) => windowTemplate(win, index))}</main>
				{d.map(([win, index]) => windowTemplate(win, index))}
			</>
		);
	};

	return (
		<>
			<style>{generatedColorStyle}</style>
			<style>{generatedBackgroundStyle}</style>
			<div id="desktop" onMouseMove={handleDesktopMouseMove} onMouseUp={() => handleWindowClick(null, false)}>
				<AppContext.Provider
					value={{
						windowSet: [windows, setWindows],
						colorSet: [customColors, setCustomColors],
						backgroundSet: [customBackground, setCustomBackground],
						factorSet: [lightFactor, darkFactor],
						metadata
					}}
				>
					<aside></aside>
					{windowSeparator()}
					<LauncherWindow handleLayering={handleLayering} />
					<TooltipWindow />
				</AppContext.Provider>
			</div>
		</>
	);
};

export default App;
