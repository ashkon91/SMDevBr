import React from 'react';
import StreamInfo from './StreamInfo';

const SelectStream = ({streams, tournamentId, slug}) => (
	<ul>
		{streams.map((data, i) => {
			return <StreamInfo key={i} tournamentId={tournamentId} slug={slug} {...data} />
		})}
	</ul>
)

export default SelectStream;