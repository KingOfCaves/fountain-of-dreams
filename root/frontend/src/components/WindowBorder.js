import React from 'react';

const WindowBorder = ({
	title = 'terminal',
	type = 'light',
	titlebar = false,
	extraDecor = false,
	helperClasses = '',
	children,
}) => {
	const windowClass = [helperClasses, 'window', `window--${type}`].join(' ');

	return (
		<div className={windowClass}>
			<div className="window__mask">
				{extraDecor && <div className="window__decor--top"></div>}
				<div className="window__inner">
					<div className="window__decor--inner">
						{titlebar && (
							<div className="window__titlebar">
								<div className="window__titlebar__min"></div>
								<div className="window__titlebar__name">{title}</div>
								<div className="window__titlebar__exit"></div>
							</div>
						)}
						<div className="window__content">{children}</div>
					</div>
				</div>
				{extraDecor && <div className="window__decor--bottom"></div>}
			</div>
		</div>
	);
};

export default WindowBorder;
