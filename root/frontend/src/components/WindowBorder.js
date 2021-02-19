import React, { useState, useEffect } from 'react';

const WindowBorder = ({
	title = 'terminal',
	type = 'light',
	titlebar = false,
	extraDecor = false,
	helperClasses = '',
	helperId = '',
	handleMinimize = null,
	handleMax = null,
	minimize = false,
	max = false,
	layer = null,
	children,
}) => {
	const [contentWidth, setContentWidth] = useState(0);
	const [contentHeight, setContentHeight] = useState(0);
	const [openOptions, setOpenOptions] = useState(false);

	const windowClass = ['window', `window--${type}`, helperClasses, max ? 'max' : '', minimize ? 'minimize' : ''].join(' ');
	let content = null;

	useEffect(() => {
		setContentWidth(content.getBoundingClientRect().width);
		setContentHeight(content.getBoundingClientRect().height);
	}, [content]);

	return (
		<>
			<div
				id={helperId}
				className={windowClass}
				onMouseLeave={() => setOpenOptions(false)}
				style={layer ? { zIndex: layer } : {}}
				ref={(div) => {
					content = div;
				}}
			>
				<div className="window__mask">
					{extraDecor && contentWidth > 80 && <div className="window__decor--horizontal"></div>}
					<div className="window__inner">
						<div className="window__decor--inner">
							{titlebar && (
								<div className="window__titlebar">
									<div
										className="window__titlebar__button window__titlebar__options"
										onClick={() => setOpenOptions(true)}
									></div>
									<div className="window__titlebar__name">{title.length > 0 ? `- ${title} -` : ''}</div>
									{handleMinimize && (
										<div
											className="window__titlebar__button window__titlebar__min"
											onClick={handleMinimize}
										></div>
									)}
									{openOptions && (
										<div
											className="window__titlebar__options__menu"
											onMouseLeave={() => setOpenOptions(false)}
											onClick={() => setOpenOptions(false)}
										>
											<h2>options</h2>
											<ul>
												<li onClick={() => (content.style.transform = '')}>reset window position</li>
											</ul>
										</div>
									)}
									{handleMax && (
										<div
											className="window__titlebar__button window__titlebar__max"
											onClick={handleMax}
										></div>
									)}
								</div>
							)}
							{children && <div className="window__content">{children}</div>}
						</div>
					</div>
					{extraDecor && contentHeight > 80 && <div className="window__decor--vertical"></div>}
				</div>
			</div>
		</>
	);
};

export default WindowBorder;
