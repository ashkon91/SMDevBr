import React from 'react';
import StreamInfo from './StreamInfo';

const SelectStream = ({streams, tournamentSlug}) => (
	<ul>
		{streams.map((data, i) => {
			return <StreamInfo key={i} tournamentSlug={tournamentSlug} {...data} />
		})}
	</ul>
)

export default SelectStream;