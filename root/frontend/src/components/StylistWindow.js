import React, { useState, useEffect, useContext } from 'react';
import WindowBorder from './WindowBorder';

import AppContext from '../context/AppContext';

const StylistWindow = ({ type, handleMinimize, handleMax, minimize, max, layer }) => {
	const {
		colorSet: [customStyles, setCustomStyles],
	} = useContext(AppContext);
	const [queueStyles, setQueueStyles] = useState({ ...customStyles });
	const [currentTab, setCurrentTab] = useState(Object.keys(queueStyles)[0]);

	const handleColor = (e, color, subindex = null) => {
		const newColor = e.currentTarget.value;
		let update;

		if (typeof subindex === 'number') {
			return setQueueStyles({
				...queueStyles,
				[currentTab]: {
					...queueStyles[currentTab],
					[color]: queueStyles[currentTab][color].map((original, index) => {
						if (index === subindex) return newColor;
						return original;
					}),
				},
			});
		} else {
			if (e.currentTarget.files) {
				const reader = new FileReader();
				const file = e.currentTarget.files[0];
				if (file) {
					reader.readAsDataURL(file);
					reader.onload = () => {
						setQueueStyles({
							...queueStyles,
							[currentTab]: { ...queueStyles[currentTab], [color]: reader.result },
						});
					};
				}
			}
			return setQueueStyles({ ...queueStyles, [currentTab]: { ...queueStyles[currentTab], [color]: newColor } });
		}
	};

	const handleColorApply = () => {
		setCustomStyles(queueStyles);
		document.querySelector('input[type="file"]').value = null;
	};

	const handleColorReset = () => {
		setCustomStyles({
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
		setQueueStyles({ ...customStyles });
	};

	useEffect(() => setQueueStyles({ ...customStyles }), [customStyles]);

	const handleTab = (tab) => {
		setCurrentTab(tab);
	};

	const inputChooser = (k, v) => {
		let queue = [<h3>{`${k}`}</h3>];

		if (Array.isArray(v)) {
			queue = [
				...queue,
				...v.map((color, subindex) => (
					<input type="color" value={color} onChange={(e) => handleColor(e, k, subindex)}></input>
				)),
			];
		} else if (k.includes('image')) {
			queue = [
				...queue,
				<input type="file" onChange={(e) => handleColor(e, k)} accept="image/x-png,image/gif,image/jpeg"></input>,
			];
		} else {
			queue = [...queue, <input type="color" value={v} onChange={(e) => handleColor(e, k)}></input>];
		}
		return queue;
	};

	return (
		<WindowBorder
			helperClasses="stylist"
			type={type}
			titlebar={true}
			title="stylist"
			extraDecor={true}
			handleMinimize={handleMinimize}
			minimize={minimize}
			layer={layer}
		>
			<nav className="stylist__tabs">
				{Object.entries(queueStyles).map(([key, value]) => (
					<a
						key={`${key}-${value}`}
						className={currentTab === key ? 'active' : ''}
						role="navigation"
						onClick={() => handleTab(key)}
					>
						{key.replace('window', '')}
					</a>
				))}
			</nav>
			<div className="stylist__colors">
				{Object.entries(queueStyles).map(([key, value]) => (
					<div className={`stylist__colors__section ${currentTab === key ? 'active' : ''}`}>
						{Object.entries(value).map(([key, value]) => (
							<article>{inputChooser(key, value)}</article>
						))}
					</div>
				))}
			</div>
			<div className="stylist__actions">
				<div onClick={handleColorReset}>Reset Styles</div>
				<div onClick={handleColorApply}>Apply Styles</div>
			</div>
		</WindowBorder>
	);
};

export default StylistWindow;
