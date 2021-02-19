import React from 'react';
import WindowBorder from '../components/WindowBorder';

const HelpWindow = ({ type, handleMinimize, handleMax, minimize, max, layer }) => {
	return (
		<WindowBorder
			helperClasses="help"
			type={type}
			title="help"
			titlebar={true}
			extraDecor={true}
			handleMinimize={handleMinimize}
			minimize={minimize}
			layer={layer}
		>
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
					'                          .JMML.    ',
				].join('\n')}
			</h2>
			<p>
				In this guide you will find some special secondary features of the website/radio that you can use to your
				advantage.
			</p>
			<h3>Table of Contents</h3>
			<nav>
				<a href="#external-use">External Use</a>
				<a href="#windows-and-titlebars">Windows and Titlebars</a>
			</nav>
			<h3 id="external-use">External Use</h3>
			<p>There are a few links that will take you directly to the audio streams that run in parallel with the website.</p>
			<article>
				<a href="/ogg">https://fountainofdreams.net/ogg</a>
				<sub>╰─> stream in ogg format</sub>
			</article>
			<article>
				<a href="/mp3">https://fountainofdreams.net/mp3</a>
				<sub>╰─> stream in mp3 format</sub>
			</article>
			<p>Make sure that your audio player of choice supports streams, as well as the available formats!</p>
			<h3 id="windows-and-titlebars">Windows and Titlebars</h3>
			<p>
				Most windows with a titlebar can be interacted with. Grabbing and dragging windows, closing (for those that have
				it enabled), and window options are all available.
			</p>
			<p>Here's a bit of "window anatomy".</p>
			<article style={{ margin: '32px 0', padding: '0 24px', position: 'relative' }}>
				<span style={{ position: 'absolute', top: '-36px', right: '34px', color: 'darkgreen' }}>
					{'maximize <─────────╮'}
				</span>
				<span style={{ position: 'absolute', top: '-26px', right: '30px', color: 'darkgreen' }}>{'│'}</span>
				<span style={{ position: 'absolute', top: '-12px', right: '30px', color: 'darkgreen' }}>{'│'}</span>
				<span style={{ position: 'absolute', top: '-20px', right: '52px', color: 'darkred' }}>{'minimize <──╮'}</span>
				<span style={{ position: 'absolute', top: '-10px', right: '48px', color: 'darkred' }}>{'│'}</span>
				<WindowBorder
					helperClasses="test"
					type="other"
					titlebar={true}
					title="bohij"
					handleMinimize={() => {}}
					handleMax={() => {}}
				/>
				<span style={{ position: 'absolute', bottom: '-10px', left: '31px', color: 'darkblue' }}>{'│'}</span>
				<span style={{ position: 'absolute', bottom: '-20px', left: '34px', color: 'darkblue' }}>
					{'╰─────> options'}
				</span>
			</article>
			<p>The maximize buttons don't do anything... yet, but they will in the future.</p>
		</WindowBorder>
	);
};

export default HelpWindow;
