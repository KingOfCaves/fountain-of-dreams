import React from 'react';
import WindowBorder from './WindowBorder';

const WelcomeWindow = ({ handleExit }) => {
	return (
		<WindowBorder
			closable={{ enabled: true, fn: handleExit }}
			helperClasses="splash"
			type="other"
			title="introduction"
			titlebar={true}
		>
			<div className="splash__banner"></div>
			<div className="splash__text">
				<p>Welcome!</p>
				<p>fountain_of_dreams is an internet radio with a primary focus on 70's and 80's tunes from Japan.</p>
				<h2>tips & tricks</h2>
				<p>Just some neat features of the radio that you may want to use or look into!</p>
				<h3>external use</h3>
				<p>
					There is a minimize button in the upper-left and an exit button in the upper-right for every window that has
					a titlebar enabled.
				</p>
				<WindowBorder helperClasses="splash__test" type="dark" title="clickme!" titlebar={true} extraDecor={true} />
				<p>For most windows they don't do anything, but the intro window you are looking at right now can be closed.</p>
				<p></p>
				<p>Enjoy!</p>
			</div>
		</WindowBorder>
	);
};

export default WelcomeWindow;
