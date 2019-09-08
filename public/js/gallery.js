// ELEMENTS
const $revealBtn = document.querySelector('#reveal');
const $gallery = document.querySelector('#gallery');

// FUNCTIONS
function revealGallery() {
	$gallery.classList.toggle('revealed');
}

// EVENTS
$revealBtn.addEventListener('click', revealGallery);