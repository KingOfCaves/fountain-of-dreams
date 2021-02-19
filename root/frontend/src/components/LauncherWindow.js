import React, { useContext, useState } from 'react';
import WindowBorder from '../components/WindowBorder';

import AppContext from '../context/AppContext';

const LauncherWindow = ({ type, handleMinimize, handleMax, minimize, max, layer }) => {
	const {
		windowSet: [windows, setWindows],
	} = useContext(AppContext);
	const [collapsed, setCollapsed] = useState(true);

	const handleOpen = (w) => {
		const zMax = Math.max(...windows.map((win) => win.layer));
		const update = windows.map((win, index) => {
			if (index === w && win.minimize) {
				win.minimize = false;
				win.layer = zMax + 1;
			}
			return win;
		});
		setWindows(update);
		setCollapsed(true);
	};

	const handleToggle = () => {
		setCollapsed(!collapsed);
	};

	return (
		<WindowBorder helperId="window-launcher" helperClasses={collapsed ? '' : 'active'} layer={layer}>
			<div className="launcher__drawer" onClick={handleToggle}>
				<div className="launcher__drawer__icon"></div>
			</div>
			<ul className="launcher">
				{windows.map((win, index) => (
					<div key={win.icon + index} className="launcher__item" onClick={() => handleOpen(index)}>
						<img src={`/images/icons/${win.icon}`} alt={`${win.alt}`} />
					</div>
				))}
			</ul>
		</WindowBorder>
	);
};

export default LauncherWindow;
