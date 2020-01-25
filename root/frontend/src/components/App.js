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
			<p style={{ fontFamily: 'serif', fontStyle: 'italic' }}>
				Metadata isn't available for now.
			</p>
			<p className="player__subtitle">Track</p>
			<p className="player__info">
				{!!metadata.track ? metadata.track : <Loader />}
			</p>
			<p className="player__subtitle">Artist</p>
			<p className="player__info">
				{!!metadata.artist ? metadata.artist : <Loader />}
			</p>
			<audio className="player__controls" src="/radio" controls></audio>
		</div>
	);
};

export default App;
