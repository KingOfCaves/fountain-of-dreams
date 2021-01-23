import React from 'react';
import WindowBorder from './WindowBorder';
import Loader from './Loader';

const CoverartWindow = ({ metadata }) => {
	return (
		<WindowBorder helperId="window-coverart" title="coverart" titlebar={true} extraDecor={true}>
			<div className="player__coverart">
				{metadata.coverart ? <img src={`/images/covers/${metadata.coverart}`} alt={metadata.album} /> : <Loader />}
			</div>
		</WindowBorder>
	);
};

export default CoverartWindow;
