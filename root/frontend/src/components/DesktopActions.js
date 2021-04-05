import React from 'react';

const DesktopActions = ({ handleResetAllPositions, handleFactoryReset }) => (
	<aside id="actions">
		<label onClick={handleResetAllPositions}>
			<figure className="popout--c">
				<div className="popout--b">
					<img src="/images/icons/tab-new.png" alt="Reset Positions" />
				</div>
			</figure>
			<span className="popout--c">Recenter Windows</span>
		</label>
		<label onClick={handleFactoryReset}>
			<figure className="popout--c">
				<div className="popout--b">
					<img src="/images/icons/system-run.png" alt="Factory Reset" />
				</div>
			</figure>
			<span className="popout--c">Factory Reset</span>
		</label>
	</aside>
);

export default DesktopActions;
