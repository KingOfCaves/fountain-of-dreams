import React from 'react';
import WindowBorder from './WindowBorder';

const TooltipWindow = ({ enteredInfo, currentInfo }) => {
	return (
		<WindowBorder helperClasses={`player__tooltip ${enteredInfo ? 'active' : ''}`}>
			<div>{`${currentInfo}`}</div>
		</WindowBorder>
	);
};

export default TooltipWindow;
