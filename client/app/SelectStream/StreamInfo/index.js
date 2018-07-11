import React from 'react';

const StreamInfo = ({tournamentSlug, streamName}) => (
		<li>
			<a
				href={`/streamrunner/${tournamentSlug}/${streamName}`}
			>	
				{streamName}
			</a>
		</li>
)

export default StreamInfo;