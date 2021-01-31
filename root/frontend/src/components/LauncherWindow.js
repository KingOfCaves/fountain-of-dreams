import React, { useContext } from 'react';
import WindowBorder from '../components/WindowBorder';

import AppContext from '../context/AppContext';

const LauncherWindow = () => {
	const {
		windowSet: [windows, setWindows],
	} = useContext(AppContext);

	return (
		<WindowBorder helperId="window-launcher">
			<ul className="launcher">
				{windows.map((win) => (
					<div className="launcher__item">
						<img src={`/images/icons/${win.icon}`} />
					</div>
				))}
			</ul>
		</WindowBorder>
	);
};

export default LauncherWindow;
