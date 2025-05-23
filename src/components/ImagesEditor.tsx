import styled from '@emotion/styled';
import { CloudUpload, Delete } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import {
	Autocomplete,
	Box,
	Modal,
	Paper,
	TextField,
	IconButton,
	Stack,
	Button,
	Typography,
	Grid,
	ToggleButton,
	Accordion,
	AccordionDetails,
	AccordionSummary,
} from '@mui/material';
import React from 'react';

import { Languages } from '../slime-shared/constants/languages';
import { useMarketplaceApi } from '../slime-shared/contexts/MarketplaceApiContext';
import { useSlimeApi } from '../slime-shared/contexts/SlimeApiContext';
import { UploadFileRequest } from '../slime-shared/types/slime/MarketplaceApiTypes';
import { Media, MediaUrlSource } from '../slime-shared/types/slime/Media';

export interface NewImageModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	addImage: (newImage: MediaUrlSource) => void;
}

const NewImageModalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

export const NewImageModal = (props: NewImageModalProps) => {
	const { open, setOpen, addImage } = props;

	const [newImage, setNewImage] = React.useState<MediaUrlSource>({
		url: '',
		source: 'Image',
		language: { native: '', english: '' },
		type: '',
		alt: '',
		nsfw: false,
	});

	const [image, setImage] = React.useState<File | null>(null);

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const selectedImage = event.target.files[0];
			setImage(selectedImage);
		}
	};

	const { uploadFile } = useMarketplaceApi();

	const { marketplaces } = useSlimeApi();

	return (
		<Modal open={open} onClose={() => setOpen(false)}>
			<Box sx={NewImageModalStyle}>
				<Grid container alignItems={'center'} spacing={1} p={1}>
					<Grid item xs={12} sm={12} md={12}>
						<Box sx={{ display: 'flex', justifyContent: 'center' }}>
							{!image && newImage.url && <img src={newImage.url} alt={newImage.alt} style={{ maxWidth: '100%' }} />}
							{image && <img src={URL.createObjectURL(image)} alt={newImage.alt} style={{ maxWidth: '100%' }} />}
						</Box>
					</Grid>
					<Grid item xs={12} sm={6} md={6}>
						<Button component="label" variant="contained" style={{ width: '100%' }} startIcon={<ImageIcon />}>
							Select Image
							<VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageUpload} />
						</Button>
					</Grid>
					<Grid item xs={12} sm={6} md={6}>
						<Button
							component="label"
							variant="contained"
							style={{ width: '100%' }}
							disabled={image == null}
							startIcon={<CloudUpload />}
							onClick={async () => {
								if (image && marketplaces) {
									marketplaces.forEach(async (marketplace) => {
										const res = await uploadFile({ file: image, url: marketplace.url } as UploadFileRequest);
										if (res.id) {
											setNewImage({ ...newImage, url: `${marketplace.url}/public/${res.id}` });
										} else {
											alert(`Unknown Error during upload to ${marketplace.url}\n${res.message}`);
										}
									});
									if (marketplaces.length === 0) {
										alert('No Marketplaces Available Add Marketplace in Settings.');
									}
								}
							}}
						>
							Upload
						</Button>
					</Grid>

					<Grid item xs={8} sm={8} md={4}>
						<TextField
							sx={{ width: '100%' }}
							label="Image URL"
							variant="filled"
							value={newImage.url}
							onClick={(event) => {
								event.stopPropagation();
							}}
							onChange={(event: any) => {
								setNewImage({ ...newImage, url: event.target.value });
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
							options={['Capsule', 'Icon', 'Screenshot', 'Other']}
							value={newImage.type}
							sx={{ width: '100%' }}
							disableClearable
							onClick={(event) => {
								event.stopPropagation();
							}}
							renderInput={(params) => <TextField {...params} label="Type" />}
							onChange={(event: any) => {
								setNewImage({ ...newImage, type: event.target.innerText });
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
							value={newImage.language}
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
								setNewImage({ ...newImage, language: l });
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
						<ToggleButton
							value={newImage.nsfw}
							onChange={() => {
								setNewImage({ ...newImage, nsfw: !newImage.nsfw });
							}}
						>
							{newImage.nsfw ? 'NSFW' : 'SFW'}
						</ToggleButton>
					</Grid>
				</Grid>
				<Stack direction="row" width={'100%'} justifyContent={'end'} spacing={2}>
					<Button
						color="primary"
						sx={{ alignItems: 'center' }}
						onClick={() => {
							setOpen(false);
							addImage(newImage);
						}}
					>
						<AddIcon /> Add Image
					</Button>
					<Button
						color="primary"
						onClick={() => {
							setOpen(false);
						}}
						sx={{ alignItems: 'center' }}
					>
						Cancel
					</Button>
				</Stack>
			</Box>
		</Modal>
	);
};

export interface ImageEditorProps {
	image: MediaUrlSource;
	setImage: (newImage: MediaUrlSource | undefined) => void;
}

export const ImageEditor = (props: ImageEditorProps) => {
	const { image, setImage } = props;

	const [urlValue, setUrlValue] = React.useState(image.url);
	const [sourceValue, setSourceValue] = React.useState(image.source);
	const [languageValue, setLanguageValue] = React.useState(image.language);
	const [typeValue, setTypeValue] = React.useState(image.type);
	const [altValue, setAltValue] = React.useState(image.alt);

	React.useEffect(() => {
		setImage({
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
		setUrlValue(image.url);
		setSourceValue(image.source);
		setLanguageValue(image.language);
		setTypeValue(image.type);
		setAltValue(image.alt);
	}, [image]);

	return (
		<Paper elevation={3} sx={{ p: 2 }}>
			<Stack spacing={2}>
				<img src={image.url} alt={image.alt} style={{ maxWidth: '100%' }} />
				<Stack direction="row" spacing={2}>
					<Autocomplete
						options={['Capsule', 'Icon', 'Screenshot', 'Other']}
						value={image.type}
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
					<Autocomplete
						options={Languages.concat(Languages)}
						value={image.language}
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
					<ToggleButton value={image.nsfw} onChange={() => {}}>
						{image.nsfw ? 'NSFW' : 'SFW'}
					</ToggleButton>
					<IconButton
						size="large"
						onClick={() => {
							setImage(undefined);
						}}
					>
						<Delete />
					</IconButton>
				</Stack>
			</Stack>
		</Paper>
	);
};

export interface ImageProps {
	media: Media;
	setMedia: React.Dispatch<React.SetStateAction<Media>>;
}

export const ImagesEditor = (props: ImageProps) => {
	const { media, setMedia } = props;

	const [openNewImageModal, setOpenNewImageModal] = React.useState(false);
	const [mediaLocal, setMediaLocal] = React.useState<Media>(media);

	React.useEffect(() => {
		setMedia(mediaLocal);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- o
	}, [mediaLocal, setMediaLocal]);

	return (
		<Paper sx={{ p: 2 }}>
			<NewImageModal
				open={openNewImageModal}
				setOpen={setOpenNewImageModal}
				addImage={(newImage: MediaUrlSource) => {
					mediaLocal.images.push(newImage);
					setMediaLocal({ ...mediaLocal });
				}}
			/>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMore />}>
					<Stack direction="row" spacing={2} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
						<Typography variant="h5">Images</Typography>
						<Stack direction="row" spacing={2} alignItems={'center'}>
							<Typography variant="h6">{mediaLocal.images.length}</Typography>
							<IconButton
								onClick={(event) => {
									event.stopPropagation();
									setOpenNewImageModal(true);
								}}
							>
								<AddIcon />
							</IconButton>
						</Stack>
					</Stack>
				</AccordionSummary>
				<AccordionDetails>
					<Grid container spacing={2}>
						{mediaLocal.images &&
							mediaLocal.images.map((image, index) => (
								<Grid container spacing={2} sx={{ p: 2 }} xs={12} sm={12} md={6} lg={4}>
									<ImageEditor
										key={index}
										image={image}
										setImage={(newImage: MediaUrlSource | undefined) => {
											if (!newImage) {
												mediaLocal.images = mediaLocal.images.filter((_, i) => i !== index);
												setMediaLocal({ ...mediaLocal });
												return;
											}
											mediaLocal.images[index] = newImage;
											setMediaLocal({ ...mediaLocal });
										}}
									/>
								</Grid>
							))}
					</Grid>
				</AccordionDetails>
			</Accordion>
		</Paper>
	);
};
