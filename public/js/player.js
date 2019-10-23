(function() {
	const socket = io.connect();

	// ELEMENTS
	const $infoArtist = document.querySelector('#artist');
	const $infoTitle = document.querySelector('#title');
	const $radio = document.querySelector('#radio');
	const $volume = document.querySelector('#volume');
	const $volumeDisplay = document.querySelector('#volume__display');

	// FUNCTIONS
	function infoUpdate(info) {
		const [artist, title] = info.split('//').map((i) => i.trim());

		$infoArtist.textContent = artist;
		$infoTitle.textContent = title;
	}

	function initPlayer() {
		updateVolume();
		updateVolumeDisplay();
	}

	function updateVolume() {
		$radio.volume = $volume.value;
		updateVolumeDisplay();
	}

	function updateVolumeDisplay() {
		const displayValue = parseInt($volume.value * 100);
		$volumeDisplay.textContent = `${displayValue}%`;
	}

	function shortcuts(e) {
		const current = Math.round(parseFloat($volume.value) * 100) / 100;
		const step = e.shiftKey ? 0.1 : 0.01;
		switch (e.key) {
			case 'ArrowDown':
			case 'ArrowLeft':
				$volume.value = current - step;
				updateVolume();
				break;
			case 'ArrowUp':
			case 'ArrowRight':
				$volume.value = current + step;
				updateVolume();
				break;
			case 'p':
				console.log('play');
				break;
			case 'm':
				$radio.muted = !$radio.muted;
				$volumeDisplay.classList.toggle('muted');
				break;
		}
	}

	// EVENTS
	window.addEventListener('load', initPlayer);
	window.addEventListener('keydown', shortcuts);
	$volume.addEventListener('input', updateVolume);

	// SOCKET.IO EVENTS
	socket.on('metadataUpdate', (info) => infoUpdate(info));
})();
