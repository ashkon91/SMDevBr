import React from 'react';

const StreamInfo = ({tournamentId, id, streamName, slug}) => (
		<li>
			<a
				href={`/streamrunner/${slug}/${tournamentId}/${id}`}
			>	
				{streamName}
			</a>
		</li>
)

export default StreamInfo;