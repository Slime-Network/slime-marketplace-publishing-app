import AddIcon from '@mui/icons-material/Add';
import {
	Autocomplete,
	Box,
	Grid,
	Modal,
	Paper,
	TextField,
	IconButton,
	Stack,
	Button,
	Switch,
	Slider,
	Chip,
	Typography,
} from '@mui/material';
import React from 'react';

import { ContentTags, AdultContentTags } from '../slime-shared/constants/tags';
import { Media, MediaTag } from '../slime-shared/types/slime/Media';

export interface TagProps {
	media: Media;
	setTags: React.Dispatch<React.SetStateAction<MediaTag[]>>;
	includeAdult: boolean;
}

export interface NewTagModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	addTags: (newTags: MediaTag[]) => void;
	includeAdult: boolean;
}

const NewTagModalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export const NewTagModal = (props: NewTagModalProps) => {
	const { open, setOpen, includeAdult, addTags } = props;

	const [newTags, setNewTags] = React.useState<string[]>([]);
	const [includeAdultLocal, setIncludeAdultLocal] = React.useState(includeAdult);

	return (
		<Modal open={open} onClose={() => setOpen(false)} component="div" sx={NewTagModalStyle}>
			<Box>
				{includeAdult && (
					<Switch
						checked={includeAdultLocal}
						onChange={(event) => {
							setIncludeAdultLocal(event.target.checked);
						}}
					/>
				)}
				<Autocomplete
					multiple
					options={includeAdultLocal ? ContentTags.concat(AdultContentTags) : ContentTags}
					renderInput={(params) => <TextField {...params} label="Tags" placeholder="Select tags" />}
					onChange={(event, value) => {
						setNewTags(value);
					}}
				/>
				<Button
					color="primary"
					onClick={() => {
						setOpen(false);
						addTags(
							newTags.map((tag) => ({
								tag,
								weight: 0,
								type: 'tag',
								adult: !includeAdultLocal && AdultContentTags.includes(tag),
							}))
						);
					}}
				>
					<AddIcon /> Add Tags
				</Button>
				<Button
					color="primary"
					onClick={() => {
						setOpen(false);
					}}
				>
					Cancel
				</Button>
			</Box>
		</Modal>
	);
};

export const TagsEditor = (props: TagProps) => {
	const { media, setTags, includeAdult } = props;

	const [openNewTagModal, setOpenNewTagModal] = React.useState(false);
	const [tagsLocal, setTagsLocal] = React.useState<MediaTag[]>(media.tags);
	const [showAdult, setShowAdult] = React.useState(includeAdult);

	const [unusedWeight, setUnusedWeight] = React.useState(100);

	const [startWeight, setStartWeight] = React.useState(-1);
	const [tempMaxWeight, setTempMaxWeight] = React.useState(100);

	React.useEffect(() => {
		setTags(tagsLocal);
	}, [setTags, tagsLocal, tagsLocal.length]);

	React.useEffect(() => {
		setShowAdult(includeAdult);
	}, [includeAdult]);

	return (
		<Paper sx={{ p: 2 }}>
			<NewTagModal
				open={openNewTagModal}
				setOpen={setOpenNewTagModal}
				includeAdult={showAdult}
				addTags={(newTags: MediaTag[]) => {
					setTagsLocal(tagsLocal.concat(newTags));
				}}
			/>
			<Typography variant="h5">Tags</Typography>
			<Grid container>
				<Grid item xs={12}>
					<Paper>
						Unused: {unusedWeight}
						Total: {tagsLocal.reduce((acc, tag) => acc + tag.weight, 0)}
						<Box sx={{ overflowX: 'scroll' }}>
							<Stack direction="row" spacing={2}>
								{tagsLocal &&
									tagsLocal.map((tag, index) => (
										<Stack direction="column" spacing={2} height={'20rem'} alignItems={'center'} justifyContent={'center'}>
											<Slider
												value={tag.weight}
												orientation="vertical"
												valueLabelDisplay="auto"
												step={1}
												min={0}
												onChange={(_, value) => {
													if (startWeight === -1) {
														setStartWeight(tag.weight);
													} else if (startWeight + unusedWeight >= Number(value)) {
														tagsLocal[index].weight = Number(value);
														setTagsLocal([...tagsLocal]);
													}
												}}
												onChangeCommitted={(_, value) => {
													setUnusedWeight(unusedWeight + startWeight - Number(value));
													let prevTotal = 0;
													for (let i = 0; i < tagsLocal.length; i++) {
														if (i === index) {
															tagsLocal[i].weight = startWeight;
														}
														prevTotal += tagsLocal[i].weight;
													}
													const newTotal = prevTotal + Number(value) - startWeight;
													console.log('newTotal', newTotal);
													let errDiff = 0;
													if (newTotal > 100) {
														errDiff = newTotal - 100;
													}
													const diff = Number(value) - startWeight - errDiff;
													console.log('diff', diff);
													tagsLocal[index].weight = startWeight + diff;
													setUnusedWeight(unusedWeight - diff);

													let newMax = 0;
													for (let i = 0; i < tagsLocal.length; i++) {
														if (tagsLocal[i].weight > newMax) {
															newMax = tagsLocal[i].weight + unusedWeight;
														}
													}

													setTagsLocal([...tagsLocal]);
													setTempMaxWeight(newMax);
													setStartWeight(-1);
												}}
												max={tempMaxWeight}
											/>
											<Chip
												sx={{ width: '10rem' }}
												label={tag.tag}
												onDelete={() => {
													let newMax = 0;
													for (let i = 0; i < tagsLocal.length; i++) {
														if (tagsLocal[i].weight > newMax) {
															newMax = tagsLocal[i].weight + unusedWeight;
														}
													}
													setTempMaxWeight(newMax);
													setUnusedWeight(unusedWeight + tag.weight);
													tagsLocal.splice(index, 1);
													setTagsLocal([...tagsLocal]);
												}}
											/>
										</Stack>
									))}
							</Stack>
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Stack direction="row" spacing={2} justifyContent={'end'}>
						<IconButton onClick={() => setOpenNewTagModal(true)}>
							<AddIcon />
						</IconButton>
					</Stack>
				</Grid>
			</Grid>
		</Paper>
	);
};
