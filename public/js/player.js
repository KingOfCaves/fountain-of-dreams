(function() {
	const socket = io.connect();

	// VARIABLES
	const $infoArtist = document.querySelector('#artist');
	const $infoTitle = document.querySelector('#title');
	const $radio = document.querySelector('#radio');
	const $volume = document.querySelector('#volume');
	const $volumeDisplay = document.querySelector('#volume__display');

	let volumeStored;

	if (!localStorage.getItem('volume')) {
		volumeStored = 0.1;
		localStorage.setItem('volume', volumeStored);
		volumeStored = +localStorage.getItem('volume');
	} else {
		volumeStored = +localStorage.getItem('volume');
	}

	// FUNCTIONS
	function infoUpdate(info) {
		const [artist, title] = info.split('//').map((i) => i.trim());

		$infoArtist.textContent = artist;
		$infoTitle.textContent = title;
	}

	function initPlayer() {
		$volume.value = volumeStored;
		updateVolume();
		updateVolumeDisplay();
	}

	function updateVolume() {
		const val = $volume.value;

		$radio.volume = val;
		localStorage.setItem('volume', val);
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
			case 'h':
				console.log('help');
			case 'c':
				const [artist, title] = [
					$infoArtist.textContent,
					$infoTitle.textContent
				];
				const formatted = `${artist} - ${title}`;

				navigator.clipboard.writeText(formatted).then(
					function() {
						console.log(formatted, 'copied!');
					},
					function() {
						console.log('woops!');
					}
				);
		}
	}

	// EVENTS
	window.addEventListener('load', initPlayer);
	window.addEventListener('keydown', shortcuts);
	$volume.addEventListener('input', updateVolume);

	// SOCKET.IO EVENTS
	socket.on('metadataUpdate', (info) => infoUpdate(info));
})();
