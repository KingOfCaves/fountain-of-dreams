(function(){
	const socket = io();

	// ELEMENTS
	const $infoArtist = document.querySelector('#artist');
	const $infoTitle = document.querySelector('#title');
	const $player = document.querySelector('#player');

	// FUNCTIONS
	function infoUpdate(info) {
		const [artist, title] = info.split('-').map(i => i.trim());

		$infoArtist.textContent = artist;
		$infoTitle.textContent = title;
	}

	function playerInit() {
		$player.volume = 0.25;
	}
	
	// EVENTS
	window.addEventListener('load', playerInit);
	socket.on('metadataUpdate', (info) => infoUpdate(info));
})();