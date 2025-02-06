import { Info, Add, Delete } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	Box,
	Grid,
	IconButton,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import React from 'react';

import { InfoModal } from '../slime-shared/components/InfoModal';
import { VideoSources } from '../slime-shared/constants';
import { Languages } from '../slime-shared/constants/languages';
import { Media, MediaUrlSource } from '../slime-shared/types/slime/Media';
import { getEmbedUrl } from '../slime-shared/utils/urlUtils';

export interface VideoEditorProps {
	video: MediaUrlSource;
	setVideo: (newVideo: MediaUrlSource | undefined) => void;
}

export const VideoEditor = (props: VideoEditorProps) => {
	const { video, setVideo } = props;

	const [urlValue, setUrlValue] = React.useState(video.url);
	const [sourceValue, setSourceValue] = React.useState(video.source);
	const [languageValue, setLanguageValue] = React.useState(video.language);
	const [typeValue, setTypeValue] = React.useState(video.type);
	const [altValue, setAltValue] = React.useState(video.alt);

	const [expand, setExpand] = React.useState(false);

	React.useEffect(() => {
		setVideo({
			url: urlValue,
			type: typeValue,
			source: sourceValue,
			alt: altValue,
			language: languageValue,
			nsfw: false,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- aoeaoe
	}, [urlValue, sourceValue, languageValue, typeValue, altValue]);

	React.useEffect(() => {
		setUrlValue(video.url);
		setSourceValue(video.source);
		setLanguageValue(video.language);
		setTypeValue(video.type);
		setAltValue(video.alt);
	}, [video]);

	const toggleAccordion = () => {
		setExpand((prev) => !prev);
	};

	return (
		<Accordion expanded={expand}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" onClick={toggleAccordion}>
				<Grid container alignItems={'center'} spacing={1} p={1}>
					<Grid item xs={8} sm={8} md={4}>
						<TextField
							sx={{ width: '100%' }}
							label="Video"
							variant="filled"
							value={urlValue}
							onClick={(event) => {
								event.stopPropagation();
							}}
							onChange={(event: any) => {
								setUrlValue(event.target.value);
							}}
						/>
					</Grid>
					<Grid
						item
						xs={4}
						sm={4}
						md={2}
						onClick={(event) => {
							event.stopPropagation();
						}}
					>
						<Autocomplete
							options={VideoSources}
							value={sourceValue}
							sx={{ width: '100%' }}
							onClick={(event) => {
								event.stopPropagation();
							}}
							disableClearable
							renderInput={(params) => <TextField {...params} label="Source" />}
							onChange={(event: any) => {
								setSourceValue(event.target.innerText);
							}}
						/>
					</Grid>
					<Grid
						item
						xs={4}
						sm={4}
						md={2}
						onClick={(event) => {
							event.stopPropagation();
						}}
					>
						<Autocomplete
							options={['Trailer', 'Gameplay', 'Review', 'Tutorial', 'Other']}
							value={typeValue}
							sx={{ width: '100%' }}
							disableClearable
							onClick={(event) => {
								event.stopPropagation();
							}}
							renderInput={(params) => <TextField {...params} label="Type" />}
							onChange={(event: any) => {
								setTypeValue(event.target.innerText);
							}}
						/>
					</Grid>
					<Grid
						item
						xs={6}
						sm={6}
						md={3}
						onClick={(event) => {
							event.stopPropagation();
						}}
					>
						<Autocomplete
							options={Languages.concat(Languages)}
							value={languageValue}
							sx={{ width: '100%' }}
							onClick={(event) => {
								event.stopPropagation();
							}}
							disableClearable
							getOptionLabel={(option) => (option.native ? `${option.native} (${option.english})` : option.english)}
							renderOption={(propss, option) => (
								<Box component="li" sx={{}} {...propss}>
									{`${option.native} (${option.english})`}
								</Box>
							)}
							renderInput={(params) => <TextField {...params} label="Language" />}
							onChange={(event: any) => {
								const eng = event.target.innerText.split('(')[1].split(')')[0];
								const l = Languages.find((lang) => lang.english === eng);
								if (!l) {
									alert('Error: Language not found');
									return;
								}
								setLanguageValue(l);
							}}
						/>
					</Grid>
					<Grid item xs={2} sm={2} md={1}>
						<IconButton
							size="large"
							onClick={(event) => {
								event.stopPropagation();
								setVideo(undefined);
							}}
						>
							<Delete />
						</IconButton>
					</Grid>
				</Grid>
			</AccordionSummary>
			<AccordionDetails>
				<iframe src={getEmbedUrl(urlValue)} height={'370'} width={'100%'} />
			</AccordionDetails>
		</Accordion>
	);
};

export interface VideosEditorProps {
	media: Media;
	setMedia: React.Dispatch<React.SetStateAction<Media>>;
}

export const VideosEditor = (props: VideosEditorProps) => {
	const { media, setMedia } = props;

	const [openInfoModal, setOpenInfoModal] = React.useState(false);
	const [infoTitle, setInfoTitle] = React.useState('');
	const [infoDescription, setInfoDescription] = React.useState('');

	const [mediaLocal, setMediaLocal] = React.useState<Media>(media);

	React.useEffect(() => {
		setMedia(mediaLocal);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- o
	}, [mediaLocal, setMediaLocal]);

	return (
		<Paper elevation={1} sx={{ p: 2 }}>
			<InfoModal
				open={openInfoModal}
				setOpen={setOpenInfoModal}
				title={infoTitle}
				style="info"
			>{`${infoDescription}`}</InfoModal>
			<Typography variant="h5">Videos</Typography>
			<Stack spacing={2}>
				{mediaLocal.videos &&
					mediaLocal.videos.map((video, index) => (
						<VideoEditor
							key={index}
							video={video}
							setVideo={(newVideo: MediaUrlSource | undefined) => {
								if (!newVideo) {
									mediaLocal.videos = mediaLocal.videos.filter((_, i) => i !== index);
									setMediaLocal({ ...mediaLocal });
									return;
								}
								mediaLocal.videos[index] = newVideo;
								setMediaLocal({ ...mediaLocal });
							}}
						/>
					))}
				<Stack direction={'row'} justifyContent={'end'}>
					<IconButton
						size="large"
						onClick={() => {
							mediaLocal.videos = [
								...mediaLocal.videos,
								{
									url: '',
									source: 'Youtube',
									type: 'Trailer',
									alt: '',
									language: {
										english: '',
										native: '',
									},
									nsfw: false,
								},
							];
							setMedia({ ...mediaLocal });
						}}
					>
						<Add />
					</IconButton>
					<IconButton
						size="large"
						onClick={() => {
							setInfoTitle('Video');
							setInfoDescription('The video of the media');
						}}
					>
						<Info />
					</IconButton>
				</Stack>
			</Stack>
		</Paper>
	);
};
