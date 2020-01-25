import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import io from 'socket.io-client';

const environment = 'production';
let socket;

const App = () => {
	const [metadata, setMetadata] = useState({
		artist: '',
		track: ''
	});

	const initRadio = () => {};

	useEffect(() => {
		socket =
			environment === 'dev'
				? {
						emit: () => {},
						off: () => {},
						on: () => {}
				  }
				: io();

		socket.on('metadataUpdate', ({ artist, track }) => {
			setMetadata({ artist, track });
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, []);

	return (
		<div className="player">
			<p>{!!metadata.track ? metadata.track : <Loader />}</p>
			<p>{!!metadata.artist ? metadata.artist : <Loader />}</p>
			<audio src="/radio" controls></audio>
		</div>
	);
};

export default App;
