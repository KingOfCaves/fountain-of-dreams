import React, { useState, useEffect } from 'react';

const WindowBorder = ({
	title = 'terminal',
	type = 'light',
	titlebar = false,
	extraDecor = false,
	helperClasses = '',
	helperId = '',
	handleClose = null,
	handleMinimize = null,
	children,
}) => {
	const [contentWidth, setContentWidth] = useState(0);
	const [contentHeight, setContentHeight] = useState(0);
	const windowClass = ['window', `window--${type}`, helperClasses].join(' ');
	const [openOptions, setOpenOptions] = useState(false);
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
				ref={(div) => {
					content = div;
				}}
			>
				<div style={{ position: 'absolute', width: contentWidth + 'px', height: contentHeight + 'px' }}></div>
				<div className="window__mask">
					{extraDecor && contentWidth > 80 && <div className="window__decor--horizontal"></div>}
					<div className="window__inner">
						<div className="window__decor--inner">
							{titlebar && (
								<div className="window__titlebar">
									<div
										className="window__titlebar__button window__titlebar__min"
										onClick={handleMinimize}
									></div>
									<div className="window__titlebar__name">{title}</div>
									<div
										className="window__titlebar__button window__titlebar__options"
										onClick={() => setOpenOptions(true)}
									></div>
									{openOptions && (
										<div
											className="window__titlebar__options__menu"
											onMouseLeave={() => setOpenOptions(false)}
											onClick={() => setOpenOptions(false)}
										>
											<h2>options</h2>
											<ul>
												<li onClick={() => (content.style.transform = 'translate(0,0)')}>
													reset window position
												</li>
											</ul>
										</div>
									)}
									{handleClose && (
										<div
											className="window__titlebar__button window__titlebar__exit"
											onClick={handleClose}
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
