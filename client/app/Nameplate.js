import React from 'react';
import './nameplate.scss';

const Nameplate = ({playerName, color, xPos}) => (
	<div className='nameplate' style={{
		color: color,
		border: '1px solid black',
		padding: '10px',
		position: 'absolute',
		left: xPos,
		bottom: '20px'

	}}>
		{playerName}
	</div>
)

export default Nameplate;