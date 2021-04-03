import React, { useContext, useState } from 'react';
import WindowBorder from '../components/WindowBorder';

import AppContext from '../context';

const LauncherWindow = ({ handleLayering }) => {
	const {
		windowSet: [windows, setWindows]
	} = useContext(AppContext);
	const [collapsed, setCollapsed] = useState(true);

	const handleOpen = (w) => {
		const update = windows.map((win, index) => {
			if (index === w && win.minimize) {
				win.minimize = false;
				handleLayering(w);
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
		<WindowBorder helperId="window-launcher" helperClasses={collapsed ? '' : 'active'} type="b">
			<div className="launcher__drawer" onClick={handleToggle}>
				<div className="launcher__drawer__icon"></div>
			</div>
			<ul className="launcher popout--b">
				{windows.map((win, index) => (
					<div key={win.icon + index} title={win.alt} className="launcher__item" onClick={() => handleOpen(index)}>
						<img src={`/images/icons/${win.icon}`} alt={win.alt} />
					</div>
				))}
			</ul>
		</WindowBorder>
	);
};

export default LauncherWindow;
