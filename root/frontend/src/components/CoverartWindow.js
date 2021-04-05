import React, { useContext } from 'react';
import WindowBorder from './WindowBorder';
// import Loader from './Loader';

import AppContext from '../context';

const CoverartWindow = ({ type, handleMinimize, handleMax, handleLayering, handleWindowClick, minimize, max, layer }) => {
	const {
		// metadata: { album, coverart }
		metadata: { album }
	} = useContext(AppContext);

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
			{/* {coverart ? (
				<img style={{ imageRendering: 'pixelated' }} src={`/images/covers/${coverart}`} alt={album} />
			) : (
				<Loader />
			)} */}
			<img style={{ imageRendering: 'auto' }} src="/images/covers/unknown.jpg" alt={album} />
		</WindowBorder>
	);
};

export default CoverartWindow;
