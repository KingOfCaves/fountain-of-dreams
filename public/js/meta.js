(function(){
	const socket = io();

	// ELEMENTS
	const $infoArtist = document.querySelector('#artist');
	const $infoTitle = document.querySelector('#title');
	const $radio = document.querySelector('#radio');

	// FUNCTIONS
	function infoUpdate(info) {
		const [artist, title] = info.split('//').map(i => i.trim());

		$infoArtist.textContent = artist;
		$infoTitle.textContent = title;
	}
	
	// EVENTS
	socket.on('metadataUpdate', (info) => infoUpdate(info));
})();