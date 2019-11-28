(function() {
	const socket = io.connect();

	// VARIABLES
	const $player = document.querySelector('#player');
	const $infoArtist = document.querySelector('#artist');
	const $infoTitle = document.querySelector('#title');
	const $radio = document.querySelector('#radio');
	const $volume = document.querySelector('#volume');
	const $volumeDisplay = document.querySelector('#volume__display');
	const $shortcutsDisplay = document.querySelector('#shortcuts');

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

		if (!artist || !title) return;

		$infoArtist.textContent = artist;
		$infoTitle.textContent = title;
	}

	function initRadio() {
		stopStream();
		resumeStream();
		
		$volume.value = volumeStored;
		updateVolume();
		updateVolumeDisplay();
	}

	function stopStream() {
		$radio.pause();
		$radio.currentTime = 0;
		$radio.src = '';
		$player.classList.add('stop');
	}

	function resumeStream() {
		$radio.src = '/radio';
		$radio.load();
		$radio.play();
		$player.classList.remove('stop');
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
				$radio.paused ? stopStream() : resumeStream();
				break;
			case 'm':
				$radio.muted = !$radio.muted;
				$volumeDisplay.classList.toggle('muted');
				break;
			case 'h':
				$shortcutsDisplay.classList.toggle('open');
				break;
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
				break;
		}
	}

	// EVENTS
	window.addEventListener('load', initRadio);
	window.addEventListener('keydown', shortcuts);
	$volume.addEventListener('input', updateVolume);

	// SOCKET.IO EVENTS
	socket.on('metadataUpdate', (info) => infoUpdate(info));
})();
