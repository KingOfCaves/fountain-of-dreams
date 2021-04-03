import React, { useState, useEffect, useRef } from 'react';

const WindowBorder = ({
	title = 'terminal',
	type = 'a',
	titlebar = false,
	extraDecor = false,
	helperClasses = '',
	helperId = '',
	handleMinimize = null,
	handleMax = null,
	handleLayering = () => {},
	handleWindowClick = () => {},
	minimize = false,
	max = false,
	layer = null,
	children
}) => {
	const [contentWidth, setContentWidth] = useState(0);
	const [contentHeight, setContentHeight] = useState(0);
	const [openOptions, setOpenOptions] = useState(false);

	const windowClass = ['window', `window--${type}`, helperClasses, max ? 'max' : '', minimize ? 'minimize' : ''].join(' ');
	let content = useRef(null);

	useEffect(() => {
		setContentWidth(content.current.getBoundingClientRect().width);
		setContentHeight(content.current.getBoundingClientRect().height);
	}, [content]);

	const handleResetPosition = () => {
		content.current.style.top = null;
		content.current.style.left = null;
		content.current.style.position = null;
	};

	return (
		<>
			<div
				ref={(div) => {
					content.current = div;
				}}
				id={helperId}
				className={windowClass}
				onMouseDown={handleLayering}
				onMouseLeave={() => setOpenOptions(false)}
				style={layer ? { zIndex: layer } : {}}
			>
				<div className="window__mask">
					{extraDecor && contentWidth > 60 && <div className="window__decor--horizontal"></div>}
					<div className="window__inner">
						<div className="window__decor--inner">
							{titlebar && (
								<div className="window__titlebar">
									<div
										className="window__titlebar__button window__titlebar__options"
										onClick={() => setOpenOptions(true)}
									></div>
									<div
										className="window__titlebar__name"
										onMouseDown={(e) => handleWindowClick(content.current, true, e)}
									>
										{title}
									</div>
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
												<li onClick={() => handleResetPosition()}>reset window position</li>
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
					{extraDecor && contentHeight > 60 && <div className="window__decor--vertical"></div>}
				</div>
			</div>
		</>
	);
};

export default WindowBorder;
