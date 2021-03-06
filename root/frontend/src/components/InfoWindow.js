import React, { useContext } from 'react';
import WindowBorder from './WindowBorder';

import AppContext from '../context';

const InfoWindow = ({ type, handleMinimize, handleMax, handleLayering, handleWindowClick, minimize, max, layer }) => {
	const {
		metadata: { artist, album, title }
	} = useContext(AppContext);

	return (
		<WindowBorder
			helperId="window-info"
			type={type}
			titlebar={true}
			extraDecor={true}
			handleMinimize={handleMinimize}
			handleLayering={handleLayering}
			handleWindowClick={handleWindowClick}
			minimize={minimize}
			max={max}
			layer={layer}
		>
			<ol className="player__info">
				<li title="Artist">{artist || '. . .'}</li>
				<li title="Album">{album || '. . .'}</li>
				<li title="Title">{title || '. . .'}</li>
				<div className="player__info__decor">
					<span>info.txt</span>
					<span>[utf-8]</span>
				</div>
			</ol>
		</WindowBorder>
	);
};

export default InfoWindow;
