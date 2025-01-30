import { Box, Button, Typography } from '@mui/material';
import React from 'react';

import { Media, MediaTorrent } from '../slime-shared/types/slime/Media';

export interface EditTorrentProps {
	media: Media;
	setTorrents: React.Dispatch<React.SetStateAction<MediaTorrent[]>>;
}

export const EditTorrents = (props: EditTorrentProps) => {
	const { media, setTorrents } = props;

	return (
		<Box>
			<Typography id="modal-modal-description" sx={{ mt: 2 }}>
				Local file paths are not stored, they are only used to generate torrent files locally.
			</Typography>
			<Button
				sx={{ width: '100%' }}
				variant="contained"
				onClick={() => {
					setTorrents([
						...media.torrents,
						{
							platform: 'local',
							size: 0,
							torrent: '',
						},
					]);
				}}
			>
				Add
			</Button>
			{media.torrents &&
				media.torrents.map((torrent, index) => (
					<Box key={index}>
						<Box>{torrent.platform}</Box>
						<Box>{torrent.size}</Box>
						<Box>{torrent.torrent}</Box>
					</Box>
				))}
		</Box>
	);
};
