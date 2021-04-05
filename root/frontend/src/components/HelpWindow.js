import React, { useRef } from 'react';
import WindowBorder from '../components/WindowBorder';

const HelpWindow = ({ type, handleMinimize, handleMax, handleLayering, handleWindowClick, minimize, max, layer }) => {
	const help = useRef(null);

	const handleScrollTo = (chapter) => help.current.querySelector(`h3[data-chapter="${chapter}"]`).scrollIntoView(true);

	return (
		<WindowBorder
			helperClasses="help"
			type={type}
			title="help"
			titlebar={true}
			extraDecor={true}
			handleMinimize={handleMinimize}
			handleLayering={handleLayering}
			handleWindowClick={handleWindowClick}
			minimize={minimize}
			layer={layer}
		>
			<div ref={(div) => (help.current = div)} className="help__container popout--b">
				<h2>
					{[
						'                       ,,           ',
						"`7MMF'  `7MMF'       `7MM           ",
						'  MM      MM           MM           ',
						'  MM      MM  .gP"Ya   MM `7MMpdMAo.',
						"  MMmmmmmmMM ,M'   Yb  MM   MM   `Wb",
						'  MM      MM 8M""""""  MM   MM    M8',
						'  MM      MM YM.    ,  MM   MM   ,AP',
						".JMML.  .JMML.`Mbmmd'.JMML. MMbmmd' ",
						'                            MM      ',
						'                          .JMML.    '
					].join('\n')}
				</h2>
				<p>
					In this guide you will find some special secondary features of the website/radio that you can use to your
					advantage.
				</p>
				<h3>Table of Contents</h3>
				<nav>
					<span role="link" onClick={() => handleScrollTo('external-use')}>
						External Use
					</span>
					<span role="link" onClick={() => handleScrollTo('windows-and-titlebars')}>
						Windows and Titlebars
					</span>
					<span role="link" onClick={() => handleScrollTo('launcher')}>
						Launcher
					</span>
				</nav>
				<h3 data-chapter="external-use">External Use</h3>
				<p>
					There are a few links that will take you directly to the audio streams that run in parallel with the
					website.
				</p>
				<article>
					<a href="/ogg">https://fountainofdreams.net/ogg</a>
					<sub>╰─&gt; stream in ogg format</sub>
				</article>
				<article>
					<a href="/mp3">https://fountainofdreams.net/mp3</a>
					<sub>╰─&gt; stream in mp3 format</sub>
				</article>
				<p>Make sure that your audio player of choice supports streams, as well as the available formats!</p>
				<h3 data-chapter="windows-and-titlebars">Windows and Titlebars</h3>
				<p>
					Most windows with a titlebar can be interacted with. Grabbing and dragging windows, closing (for those that
					have it enabled), and window options are all available.
				</p>
				<p>Here's a bit of "window anatomy".</p>
				<article style={{ margin: '32px 0', padding: '0 24px', position: 'relative' }}>
					<span style={{ position: 'absolute', top: '-36px', right: '34px' }}>{'maximize <──────╮'}</span>
					<span style={{ position: 'absolute', top: '-26px', right: '30px' }}>{'│'}</span>
					<span style={{ position: 'absolute', top: '-12px', right: '30px' }}>{'│'}</span>
					<span style={{ position: 'absolute', top: '-20px', right: '52px' }}>{'minimize <──╮'}</span>
					<span style={{ position: 'absolute', top: '-10px', right: '48px' }}>{'│'}</span>
					<WindowBorder
						helperClasses="test"
						type="other"
						titlebar={true}
						title="bohij"
						handleMinimize={() => {}}
						handleMax={() => {}}
					/>
					<span style={{ position: 'absolute', bottom: '-10px', left: '31px' }}>{'│'}</span>
					<span style={{ position: 'absolute', bottom: '-20px', left: '34px' }}>{'╰─────> options'}</span>
				</article>
				<h3 data-chapter="launcher">Launcher</h3>
				<p>
					The launcher is always open at the bottom of the page and transforms into a drawer on devices with a smaller
					resolution. Each openable and closable window is represented by an icon.
				</p>
				<p>Here's what each icons opens!</p>
				<div style={{ margin: '0 auto' }}>
					{[
						['text-x-java.png', 'Welcome'],
						['accessories-dictionary.png', 'Help'],
						['preferences-desktop.png', 'Stylist'],
						['applications-office.png', 'Track Info'],
						['media-playback.png', 'Controls'],
						['image-x-generic.png', 'Cover Art']
					].map((icon) => (
						<div
							key={`${icon[0]}__${icon[1]}`}
							style={{ display: 'flex', alignItems: 'center', fontSize: '16px', marginBottom: '16px' }}
						>
							<img src={`/images/icons/${icon[0]}`} alt={icon[1]} />
							<span style={{ marginLeft: '16px', fontWeight: 'bold' }}>{icon[1]}</span>
						</div>
					))}
				</div>
			</div>
		</WindowBorder>
	);
};

export default HelpWindow;
