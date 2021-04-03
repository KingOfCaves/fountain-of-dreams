import React, { useEffect, useState } from 'react';
import WindowBorder from './WindowBorder';

const StatusBox = () => {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timeCC = setInterval(() => setTime(new Date()), 1000);

		return () => {
			clearInterval(timeCC);
		};
	});

	return (
		<WindowBorder helperId="statusbox" extraDecor={true}>
			<div className="status">
				<div className="status__item popout--b" style={{ fontWeight: 'bold' }}>
					fountain
				</div>
				<div className="status__item popout--a">{time.toLocaleTimeString()}</div>
				<div className="status__item popout--a">{time.toLocaleDateString()}</div>
			</div>
		</WindowBorder>
	);
};

export default StatusBox;
