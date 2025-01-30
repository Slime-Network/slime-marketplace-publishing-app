import InfoIcon from '@mui/icons-material/Info';
import { Autocomplete, Grid, IconButton, Paper, TextField } from '@mui/material';
import React from 'react';

import { InfoModal } from '../slime-shared/components/InfoModal';
import { Languages } from '../slime-shared/constants/languages';
import { Media, MediaUrlSource } from '../slime-shared/types/slime/Media';

export interface VideoProps {
	media: Media;
	setVideos: React.Dispatch<React.SetStateAction<MediaUrlSource[]>>;
}

export const VideosEditor = (props: VideoProps) => {
	const { media, setVideos } = props;

	const [openInfoModal, setOpenInfoModal] = React.useState(false);
	const [infoTitle, setInfoTitle] = React.useState('');
	const [infoDescription, setInfoDescription] = React.useState('');

	return (
		<Paper>
			<InfoModal
				open={openInfoModal}
				setOpen={setOpenInfoModal}
				title={infoTitle}
				style="info"
			>{`${infoDescription}`}</InfoModal>
			<Grid container>
				{media.videos &&
					media.videos.map((description, index) => (
						<Grid>
							<TextField
								sx={{ width: '100%' }}
								label="Description"
								variant="filled"
								value={description}
								onChange={(event: any) => {
									media.descriptions[index] = event.target.value;
									setVideos(media.videos);
								}}
								inputProps={{
									endAdornment: (
										<IconButton
											size="small"
											onClick={() => {
												setOpenInfoModal(true);
												setInfoTitle('Description');
												setInfoDescription('The description of the media');
											}}
										>
											<InfoIcon />
										</IconButton>
									),
								}}
							/>
							<Autocomplete
								defaultValue={'English'}
								options={Languages.map((language) => language.native)}
								sx={{ width: '100%' }}
								renderInput={(params) => <TextField {...params} label="Media Type" />}
								onChange={(event: any) => {
									media.descriptions[index].language = event.target.innerText;
								}}
							/>
						</Grid>
					))}
			</Grid>
		</Paper>
	);
};
