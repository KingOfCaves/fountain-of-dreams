import React from 'react';
import WindowBorder from './WindowBorder';

const InfoWindow = ({ metadata, fullhouse }) => {
	const handleInfoClick = (e) => {
		if (Array.from(e.currentTarget.querySelectorAll('li')).includes(e.target) && fullhouse) {
			window.getSelection().selectAllChildren(e.target);
		}
	};

	return (
		<WindowBorder helperId="window-info" type="dark" titlebar={true} extraDecor={true}>
			<ol className="player__info" onClick={handleInfoClick}>
				<li className="player__info__artist" data-info="artist">
					{metadata.artist || '. . .'}
				</li>
				<li className="player__info__album" data-info="album">
					{metadata.album || '. . .'}
				</li>
				<li className="player__info__title" data-info="title">
					{metadata.title || '. . .'}
				</li>
				<div className="player__info__decor">
					<span>info.txt</span>
					<span>[utf-8]</span>
				</div>
			</ol>
		</WindowBorder>
	);
};

export default InfoWindow;
