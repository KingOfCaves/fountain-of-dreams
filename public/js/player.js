const socket = io.connect();

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

function initPlayer() {
	$radio.volume = .1;
}

// EVENTS
window.addEventListener('load', initPlayer);
socket.on('metadataUpdate', (info) => infoUpdate(info));