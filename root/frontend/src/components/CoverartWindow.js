import React, { useContext, useRef, useState } from 'react';
import WindowBorder from './WindowBorder';
import Loader from './Loader';

import AppContext from '../context';

const CoverartWindow = ({ type, handleMinimize, handleMax, handleLayering, handleWindowClick, minimize, max, layer }) => {
	const {
		metadata: { album, coverart }
	} = useContext(AppContext);
	const [artPlaceholder, setArtPlaceholder] = useState(coverart);

	const replaceUnknown = (e) => setArtPlaceholder('unknown.jpg');

	return (
		<WindowBorder
			helperId="window-coverart"
			title="coverart"
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
			{coverart ? (
				<img
					style={{ imageRendering: 'auto' }}
					src={`/images/covers/${artPlaceholder}`}
					alt={album}
					onError={replaceUnknown}
				/>
			) : (
				<Loader />
			)}
		</WindowBorder>
	);
};

export default CoverartWindow;
