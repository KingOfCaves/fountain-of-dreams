import React, { useState, useContext, useEffect } from 'react';
import tinycolor from 'tinycolor2';

import WindowBorder from './WindowBorder';

import AppContext from '../context';
import palettes from '../data/palettes';
import defaults from '../data/defaults';
import drawImageProp from '../tools/drawImageProp';

const StylistWindow = ({ type, handleMinimize, handleMax, handleLayering, handleWindowClick, minimize, max, layer }) => {
	const {
		colorSet: [customColors, setCustomColors],
		backgroundSet: [customBackground, setCustomBackground],
		factorSet: [lightFactor, darkFactor]
	} = useContext(AppContext);
	const [queueColors, setQueueColors] = useState({ ...customColors });
	const [queueBackground, setQueueBackground] = useState({ ...customBackground });
	const [page, setPage] = useState('colors');

	const [loading, setLoading] = useState(false);
	const [thumbnail, setThumbnail] = useState('');

	const handlePaletteChange = (e) => {
		setQueueColors({ ...palettes[e.target.value] });
	};

	const handleColorChange = (e, i) => {
		const newColor = e.currentTarget.value;
		let update;
		if (page === 'colors') {
			update = {
				...queueColors,
				colors: queueColors.colors.map((color, index) => {
					if (i === index) return newColor;
					return color;
				}),
				custom: true
			};
			setQueueColors(update);
		} else {
			update = {
				...queueBackground,
				color: newColor
			};
			setQueueBackground(update);
		}
	};

	const handleStyleReset = () => {
		if (page === 'colors') {
			setQueueColors({ ...palettes[queueColors.index] });
		} else {
			setThumbnail('');
			setQueueBackground({
				image: '',
				color: '#807e9b'
			});
		}
	};

	const handleFullStyleReset = () => {
		(async () => {
			await setThumbnail('');
			await setQueueBackground({ ...defaults.customBackground });
			await setQueueColors({ ...defaults.customColors });
		})();
	};

	const handleStyleApply = () => {
		setCustomColors({ ...queueColors });
		setCustomBackground({ ...queueBackground });
	};

	const handleStyleLoadApplied = () => {
		setQueueColors({ ...customColors });
		setQueueBackground({ ...customBackground });
	};

	const handleFileParse = (e) => {
		const reader = new FileReader();
		const file = e.currentTarget.files[0];
		if (file) {
			setLoading(true);
			reader.readAsDataURL(file);
			reader.onload = async () => {
				await generateThumbnail(reader.result);
				await generateBackground(file.size / 1000000, file.type, reader.result);
				setLoading(false);
			};
		}
	};

	const handleFileUnload = () => {
		setThumbnail('');
		setQueueBackground({
			...queueBackground,
			image: ''
		});
	};

	const handleRenderingChange = (e) => {
		const rendering = e.currentTarget.value;
		setQueueBackground({
			...queueBackground,
			rendering
		});
	};

	const handlePage = (p) => setPage(p);

	const handleThumbnail = () => {
		if (loading) {
			return <span>loading...</span>;
		}
		if (thumbnail) {
			return (
				<figure
					style={{
						backgroundImage: `url(${thumbnail})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center'
					}}
				></figure>
			);
		}

		return <span>???</span>;
	};

	const generateThumbnail = (img) => {
		const canvas = document.createElement('canvas');
		canvas.width = 400;
		canvas.height = 400;
		const original = new Image();
		let ctx = canvas.getContext('2d');

		original.src = img;

		original.onload = async (e) => {
			drawImageProp(ctx, original, 0, 0, canvas.width, canvas.height);
			await setThumbnail(canvas.toDataURL('image/png'));
		};
		canvas.remove();
	};

	const generateBackground = (size, type, img) => {
		const canvas = document.createElement('canvas');
		canvas.width = window.screen.width;
		canvas.height = window.screen.height;
		const original = new Image();
		let ctx = canvas.getContext('2d');

		original.src = img;

		if (size > 3.5) {
			original.onload = async (e) => {
				drawImageProp(ctx, original, 0, 0, canvas.width, canvas.height);
				await setQueueBackground({ ...queueBackground, image: canvas.toDataURL('image/jpeg', 0.85) });
			};
		} else if (type === 'image/gif') {
			original.onload = async (e) => {
				await setQueueBackground({ ...queueBackground, image: img });
			};
		} else {
			setQueueBackground({ ...queueBackground, image: img });
		}

		canvas.remove();
		setLoading(false);
	};

	useEffect(() => {
		generateThumbnail(queueBackground.image);
	}, [queueBackground.image]);

	return (
		<WindowBorder
			helperClasses="stylist"
			type={type}
			titlebar={true}
			title="stylist"
			extraDecor={true}
			handleMinimize={handleMinimize}
			handleLayering={handleLayering}
			handleWindowClick={handleWindowClick}
			minimize={minimize}
			layer={layer}
		>
			<div className="stylist__tabs">
				<button className="popout--b" onClick={() => handlePage('colors')} role="navigation">
					Colors
				</button>
				<button className="popout--b" onClick={() => handlePage('background')} role="navigation">
					Background
				</button>
			</div>
			<div className={`stylist__page popout--a ${page === 'colors' ? 'active' : ''}`}>
				<section className="stylist__palettes">
					<h2>Palettes</h2>
					<select
						style={{ backgroundColor: customColors.colors[3] }}
						onChange={handlePaletteChange}
						defaultValue={queueColors.index}
						size="6"
					>
						{palettes.map((palette, index) => (
							<option key={palette.name} value={index}>
								{palette.name}
							</option>
						))}
					</select>
				</section>
				<section className="stylist__colors">
					<h2>{queueColors.custom ? 'Custom' : queueColors.name}</h2>
					{queueColors.colors &&
						queueColors.colors.map((color, index) => (
							<input
								key={'colors' + index}
								type="color"
								value={color}
								onChange={(e) => handleColorChange(e, index)}
								style={{
									border: '2px solid',
									borderLeftColor: tinycolor(color).lighten(lightFactor),
									borderTopColor: tinycolor(color).lighten(lightFactor),
									borderRightColor: tinycolor(color).darken(darkFactor),
									borderBottomColor: tinycolor(color).darken(darkFactor)
								}}
							/>
						))}
				</section>
			</div>
			<div className={`stylist__page popout--a ${page === 'background' ? 'active' : ''}`}>
				<section style={{ display: 'flex', flex: 0 }}>
					<h2>Color</h2>
					<input
						style={{
							flex: '1',
							border: '4px solid',
							borderLeftColor: tinycolor(queueBackground.color).lighten(lightFactor),
							borderTopColor: tinycolor(queueBackground.color).lighten(lightFactor),
							borderRightColor: tinycolor(queueBackground.color).darken(darkFactor),
							borderBottomColor: tinycolor(queueBackground.color).darken(darkFactor)
						}}
						type="color"
						value={queueBackground.color}
						onChange={handleColorChange}
					></input>
				</section>
				<section style={{ display: 'flex', flexDirection: 'column' }}>
					<h2>Image</h2>
					<button className="popout--b">
						<label htmlFor="customImage" style={{ padding: '6px', cursor: 'pointer' }}>
							Upload Image
						</label>
					</button>
					<button style={{ padding: '6px' }} onClick={handleFileUnload}>
						Unload Image
					</button>
					<input
						id="customImage"
						style={{ display: 'none' }}
						type="file"
						accept="image/*,"
						onChange={handleFileParse}
					></input>
					<div className="stylist__thumbnail" style={{ marginTop: '8px', marginBottom: '8px' }}>
						{handleThumbnail()}
					</div>
					<select defaultValue={queueBackground.rendering} onChange={handleRenderingChange}>
						<option value="pixelated">Pixelated</option>
						<option value="smooth">Smooth</option>
					</select>
				</section>
			</div>
			<div className="stylist__actions popout--a">
				<button className="popout--b" style={{ gridColumn: 'span 2' }} onClick={handleFullStyleReset}>
					FULL RESET
				</button>
				<button style={{ gridColumn: 'span 2' }} onClick={handleStyleLoadApplied}>
					Load Applied Styles
				</button>
				<button style={{ gridColumn: '1' }} onClick={handleStyleReset}>
					Refresh Styles
				</button>
				<button style={{ gridColumn: '2' }} onClick={handleStyleApply}>
					Apply Styles
				</button>
			</div>
		</WindowBorder>
	);
};

export default StylistWindow;
