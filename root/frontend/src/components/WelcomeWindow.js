import React from 'react';
import WindowBorder from './WindowBorder';

const WelcomeWindow = ({ setNewVisitor }) => {
	const closeWindow = () => setNewVisitor(false);

	return (
		<WindowBorder
			handleClose={closeWindow}
			helperClasses="splash"
			type="other"
			title="introduction"
			titlebar={true}
			extraDecor={true}
		>
			<div className="splash__banner"></div>
			<div className="splash__text">
				<h2>Welcome!</h2>
				<p>fountain_of_dreams is an internet radio with a primary focus on 70's and 80's tunes from Japan.</p>
				<p>Enjoy!</p>
			</div>
		</WindowBorder>
	);
};

export default WelcomeWindow;
