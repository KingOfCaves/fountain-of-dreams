import palettes from './palettes';

const defaults = {
	windows: [
		{
			component: 'WelcomeWindow',
			type: 'c',
			icon: 'text-x-java.png',
			alt: 'Welcome/Splash',
			minimize: false,
			max: false,
			layer: 1,
			main: false
		},
		{
			component: 'HelpWindow',
			type: 'c',
			icon: 'accessories-dictionary.png',
			alt: 'Help',
			minimize: false,
			max: false,
			layer: 0,
			main: false
		},
		{
			component: 'StylistWindow',
			type: 'c',
			icon: 'preferences-desktop.png',
			alt: 'Stylist',
			minimize: true,
			max: false,
			layer: 0,
			main: false
		},
		{
			component: 'InfoWindow',
			type: 'b',
			icon: 'applications-office.png',
			alt: 'Track Info',
			minimize: false,
			max: false,
			layer: 0,
			main: true
		},
		{
			component: 'ControlsWindow',
			type: 'b',
			icon: 'media-playback.png',
			alt: 'Player Controls',
			minimize: false,
			max: false,
			layer: 0,
			main: true
		},
		{
			component: 'CoverartWindow',
			type: 'a',
			icon: 'image-x-generic.png',
			alt: 'Cover Art',
			minimize: false,
			max: false,
			layer: 0,
			main: true
		}
	],
	customColors: {
		...palettes.find((palette) => palette.name === 'Broica'),
		custom: false
	},
	customBackground: {
		color: '#807e9b',
		image: '',
		rendering: 'pixelated'
	}
};

export default defaults;
