import { Info, Add, Delete } from '@mui/icons-material';
import { Autocomplete, Box, Grid, IconButton, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import React from 'react';

import { InfoModal } from '../slime-shared/components/InfoModal';
import { DescriptionTypes } from '../slime-shared/constants';
import { Languages } from '../slime-shared/constants/languages';
import { Media, MediaDescription } from '../slime-shared/types/slime/Media';

export interface DescriptionEditorProps {
	description: MediaDescription;
	setDescription: (newDescription: MediaDescription | undefined) => void;
}

export const DescriptionEditor = (props: DescriptionEditorProps) => {
	const { description, setDescription } = props;

	const [descriptionValue, setDescriptionValue] = React.useState(description.description);
	const [languageValue, setLanguageValue] = React.useState(description.language);
	const [typeValue, setTypeValue] = React.useState(description.type);
	const [markdownValue, setMarkdownValue] = React.useState(description.markdown);

	React.useEffect(() => {
		setDescription({
			description: descriptionValue,
			language: languageValue,
			markdown: markdownValue,
			type: typeValue,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- aoeaoe
	}, [descriptionValue, languageValue]);

	React.useEffect(() => {
		setDescriptionValue(description.description);
		setLanguageValue(description.language);
		setTypeValue(description.type);
		setMarkdownValue(description.markdown);
	}, [description]);

	return (
		<Grid container alignItems={'center'} justifyContent={'space-between'} spacing={1}>
			<Grid item xs={7}>
				<TextField
					sx={{ width: '100%' }}
					label="Description"
					variant="filled"
					multiline={typeValue !== 'Short'}
					maxRows={typeValue === 'Short' ? 1 : typeValue === 'Medium' ? 3 : 10}
					value={descriptionValue}
					onChange={(event: any) => {
						setDescriptionValue(event.target.value);
					}}
				/>
			</Grid>

			<Grid item xs={1}>
				<Stack>
					Markdown
					<Switch
						checked={markdownValue}
						onChange={(event) => {
							setMarkdownValue(event.target.checked);
						}}
					/>
				</Stack>
			</Grid>
			<Grid item xs={1}>
				<Autocomplete
					defaultValue={'Medium'}
					options={DescriptionTypes}
					value={typeValue}
					sx={{ width: '100%' }}
					disableClearable
					renderInput={(params) => <TextField {...params} label="Type" />}
					onChange={(event: any) => {
						setTypeValue(event.target.innerText);
					}}
				/>
			</Grid>
			<Grid item xs={2}>
				<Autocomplete
					options={Languages.concat(Languages)}
					value={languageValue}
					sx={{ width: '100%' }}
					disableClearable
					groupBy={(option) => {
						if (option.group) return option.group;
						return 'Other';
					}}
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
			<Grid item xs={0.5}>
				<IconButton
					size="large"
					onClick={() => {
						setDescription(undefined);
					}}
				>
					<Delete />
				</IconButton>
			</Grid>
		</Grid>
	);
};

export interface DescriptionsEditorProps {
	media: Media;
	setMedia: React.Dispatch<React.SetStateAction<Media>>;
}

export const DescriptionsEditor = (props: DescriptionsEditorProps) => {
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
			<Typography variant="h5">Descriptions</Typography>
			<Stack spacing={2} justifyContent={'space-between'}>
				{mediaLocal.descriptions &&
					mediaLocal.descriptions.map((description, index) => (
						<DescriptionEditor
							key={index}
							description={description}
							setDescription={(newDescription: MediaDescription | undefined) => {
								if (!newDescription) {
									mediaLocal.descriptions = mediaLocal.descriptions.filter((_, i) => i !== index);
									setMediaLocal({ ...mediaLocal });
									return;
								}
								mediaLocal.descriptions[index] = newDescription;
								setMediaLocal({ ...mediaLocal });
							}}
						/>
					))}
				<Stack direction={'row'} justifyContent={'end'}>
					<IconButton
						size="large"
						onClick={() => {
							mediaLocal.descriptions = [
								...mediaLocal.descriptions,
								{
									description: '',
									language: {
										english: 'English',
										native: 'English',
									},
									type: 'Medium',
									markdown: false,
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
							setInfoTitle('Description');
							setInfoDescription('The description of the media');
						}}
					>
						<Info />
					</IconButton>
				</Stack>
			</Stack>
		</Paper>
	);
};
