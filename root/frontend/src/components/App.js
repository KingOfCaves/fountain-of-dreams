import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

const App = () => {
	const [metadata, setMetadata] = useState({
		artist: '...',
		track: '...'
	});
	const [play, setPlay] = useState(false);
	const environment = 'production';
	const radioURL = environment === 'dev' ? '' : 'http://localhost:8000/radio';

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
			<p>{metadata.track}</p>
			<p>{metadata.artist}</p>
			<audio src={radioURL} controls></audio>
		</div>
	);
};

export default App;
