import React, { useContext } from 'react';
import WindowBorder from './WindowBorder';
import Loader from './Loader';

import AppContext from '../context/AppContext';

const CoverartWindow = ({ type, handleMinimize, handleMax, minimize, max, layer }) => {
	const {
		metadata: { album, coverart },
	} = useContext(AppContext);

	return (
		<WindowBorder
			helperId="window-coverart"
			title="coverart"
			type={type}
			titlebar={true}
			extraDecor={true}
			handleMinimize={handleMinimize}
			handleMax={handleMax}
			minimize={minimize}
			max={max}
			layer={layer}
		>
			{coverart ? <img src={`/images/covers/${coverart}`} alt={album} /> : <Loader />}
		</WindowBorder>
	);
};

export default CoverartWindow;
