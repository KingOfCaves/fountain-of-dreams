import React from 'react';

const WindowBorder = ({ title, type, detailing, children }) => {
	const windowClass = ['window', `${type ? `window--${type}` : null}`].join(' ');

	return (
		<div className={windowClass}>
			<div className="window__decor--top"></div>
			<div className="window__inner">
				<div class="window__decor--inner">
					<div className="window__titlebar">
						<div className="window__titlebar__min"></div>
						<div className="window__titlebar__name">{title}</div>
						<div className="window__titlebar__exit"></div>
					</div>
					<div className="window__content">{children}</div>
				</div>
			</div>
			<div className="window__decor--bottom"></div>
		</div>
	);
};

export default WindowBorder;
