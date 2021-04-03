import React from 'react';
import WindowBorder from './WindowBorder';

const WelcomeWindow = ({ type, handleMinimize, handleMax, handleLayering, handleWindowClick, minimize, max, layer }) => {
	return (
		<WindowBorder
			helperClasses="splash"
			type={type}
			title="introduction"
			titlebar={true}
			extraDecor={true}
			handleMinimize={handleMinimize}
			handleLayering={handleLayering}
			handleWindowClick={handleWindowClick}
			minimize={minimize}
			layer={layer}
		>
			<div className="splash__banner" style={{ backgroundImage: 'url("/images/fountainofdreamsbanner.gif")' }}></div>
			<div className="splash__text">
				<h2>Welcome!</h2>
				<p>fountain_of_dreams is an internet radio with a primary focus on 70's and 80's tunes from Japan.</p>
				<p>Enjoy!</p>
			</div>
		</WindowBorder>
	);
};

export default WelcomeWindow;
