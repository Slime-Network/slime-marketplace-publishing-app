import { Info, Add, Delete } from '@mui/icons-material';
import { Autocomplete, Box, Grid, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

import { InfoModal } from '../slime-shared/components/InfoModal';
import { Languages } from '../slime-shared/constants/languages';
import { Media, MediaTitle } from '../slime-shared/types/slime/Media';

export interface TitleEditorProps {
	title: MediaTitle;
	setTitle: (newTitle: MediaTitle | undefined) => void;
}

export const TitleEditor = (props: TitleEditorProps) => {
	const { title, setTitle } = props;

	const [titleValue, setTitleValue] = React.useState(title.title);
	const [languageValue, setLanguageValue] = React.useState(title.language);

	React.useEffect(() => {
		setTitle({
			title: titleValue,
			language: languageValue,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- aoeaoe
	}, [titleValue, languageValue]);

	React.useEffect(() => {
		setTitleValue(title.title);
		setLanguageValue(title.language);
	}, [title]);

	return (
		<Grid container alignItems={'center'} spacing={1}>
			<Grid item xs={12} sm={12} md={8}>
				<TextField
					sx={{ width: '100%' }}
					label="Title"
					variant="filled"
					value={titleValue}
					onChange={(event: any) => {
						setTitleValue(event.target.value);
					}}
				/>
			</Grid>
			<Grid item xs={10} sm={10} md={3}>
				<Autocomplete
					options={Languages.concat(Languages)}
					value={languageValue}
					sx={{ width: '100%' }}
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
					onClick={() => {
						setTitle(undefined);
					}}
				>
					<Delete />
				</IconButton>
			</Grid>
		</Grid>
	);
};

export interface TitlesEditorProps {
	media: Media;
	setMedia: React.Dispatch<React.SetStateAction<Media>>;
}

export const TitlesEditor = (props: TitlesEditorProps) => {
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
		<Paper sx={{ p: 2 }}>
			<InfoModal
				open={openInfoModal}
				setOpen={setOpenInfoModal}
				title={infoTitle}
				style="info"
			>{`${infoDescription}`}</InfoModal>
			<Typography variant="h5">Titles</Typography>
			<Stack spacing={2}>
				{mediaLocal.titles &&
					mediaLocal.titles.map((title, index) => (
						<TitleEditor
							key={index}
							title={title}
							setTitle={(newTitle: MediaTitle | undefined) => {
								if (!newTitle) {
									mediaLocal.titles = mediaLocal.titles.filter((_, i) => i !== index);
									setMediaLocal({ ...mediaLocal });
									return;
								}
								mediaLocal.titles[index] = newTitle;
								setMediaLocal({ ...mediaLocal });
							}}
						/>
					))}
				<Stack direction={'row'} justifyContent={'end'}>
					<IconButton
						size="large"
						onClick={() => {
							mediaLocal.titles = [
								...mediaLocal.titles,
								{
									title: '',
									language: {
										english: '',
										native: '',
									},
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
							setInfoTitle('Title');
							setInfoDescription('The title of the media');
						}}
					>
						<Info />
					</IconButton>
				</Stack>
			</Stack>
		</Paper>
	);
};
