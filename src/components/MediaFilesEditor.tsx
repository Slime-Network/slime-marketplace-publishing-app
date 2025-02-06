import { Info, Add, Delete, Add as AddIcon, VisibilityOff, Visibility } from '@mui/icons-material';
import CasinoIcon from '@mui/icons-material/Casino';
import {
	Autocomplete,
	Box,
	Button,
	FilledInput,
	FormControl,
	Grid,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	Modal,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import React from 'react';

import { InfoModal } from '../slime-shared/components/InfoModal';
import { Platforms } from '../slime-shared/constants';
import { useSlimeApi } from '../slime-shared/contexts/SlimeApiContext';
import { Media, MediaFiles } from '../slime-shared/types/slime/Media';
import { GenerateTorrentRequest } from '../slime-shared/types/slime/SlimeRpcTypes';

declare module 'react' {
	interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
		// extends React's HTMLAttributes
		directory?: string;
		webkitdirectory?: string;
	}
}

export interface GenerateTorrentModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mediaFiles: MediaFiles;
	setMediaFiles: (newMediaFiles: MediaFiles) => void;
}

const NewExecutableModalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export const GenerateTorrentModal = (props: GenerateTorrentModalProps) => {
	const { open, setOpen, mediaFiles } = props;

	const [path, setPath] = React.useState('');
	const [waiting, setWaiting] = React.useState(false);

	const { generateTorrent } = useSlimeApi();

	React.useEffect(() => {
		const start = async () => {
			if (waiting) {
				return;
			}
			setWaiting(true);
			console.log('Generate Torrentccc', mediaFiles);
			const resp = await generateTorrent({ mediaFiles } as GenerateTorrentRequest);

			console.log('Generate Torrent resp', resp);

			setPath(resp.fileName);
			mediaFiles.size = resp.size;
			mediaFiles.torrent = resp.torrent;
			props.setMediaFiles(mediaFiles);
			setWaiting(false);
		};
		if (open) {
			setPath('');
			setWaiting(false);
			start();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- a
	}, [open]);

	return (
		<Modal open={open} onClose={() => setOpen(false)}>
			<Box sx={NewExecutableModalStyle}>
				<Grid container alignItems={'center'} spacing={1} p={1}>
					<Grid item xs={12} sm={6} md={6}>
						<TextField
							sx={{ width: '100%' }}
							label="Path"
							variant="filled"
							value={path}
							onChange={(event) => setPath(event.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={6}>
						<FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
							<InputLabel htmlFor="filled-adornment-size">Size</InputLabel>
							<Input
								id="filled-adornment-size"
								disabled
								value={
									mediaFiles.size / 1024 / 1024 / 1024 > 1
										? (mediaFiles.size / 1024 / 1024 / 1024).toFixed(3)
										: mediaFiles.size / 1024 / 1024 > 1
										? (mediaFiles.size / 1024 / 1024).toFixed(3)
										: (mediaFiles.size / 1024).toFixed(3)
								}
								endAdornment={
									<InputAdornment position="end">
										{mediaFiles.size / 1024 / 1024 / 1024 > 1 ? 'GB' : mediaFiles.size / 1024 / 1024 > 1 ? 'MB' : 'KB'}
									</InputAdornment>
								}
							/>
						</FormControl>
					</Grid>
				</Grid>
				<Stack direction="row" width={'100%'} justifyContent={'end'} spacing={2}>
					<Button
						color="primary"
						sx={{ alignItems: 'center' }}
						onClick={() => {
							setOpen(false);
							console.log('Confirm', mediaFiles);
						}}
					>
						<AddIcon /> Confirm
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

export interface MediaFileEditorProps {
	mediaFile: MediaFiles;
	setMediaFile: (newMediaFile: MediaFiles) => void;
}

export const MediaFileEditor = (props: MediaFileEditorProps) => {
	const { mediaFile, setMediaFile } = props;

	const [showPassword, setShowPassword] = React.useState(false);

	const [openGenerateTorrentModal, setOpenGenerateTorrentModal] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	return (
		<Stack>
			<GenerateTorrentModal
				open={openGenerateTorrentModal}
				setOpen={setOpenGenerateTorrentModal}
				mediaFiles={mediaFile}
				setMediaFiles={setMediaFile}
			/>
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6">Executables</Typography>
				<Grid container alignItems={'center'} justifyContent={'center'} spacing={1}>
					{mediaFile.executables.map((executable, index) => (
						<Grid item xs={8} sm={8} md={4}>
							<Stack direction={'row'} justifyContent={'end'}>
								<TextField
									sx={{ width: '100%' }}
									label="Command"
									variant="filled"
									value={executable.command}
									onChange={(event: any) => {
										mediaFile.executables[index].command = event.target.value;
										setMediaFile({ ...mediaFile });
									}}
								/>
								<Autocomplete
									options={Platforms}
									value={executable.platform}
									sx={{ width: '100%' }}
									renderInput={(params) => <TextField {...params} label="Platform" />}
									onChange={(event: any) => {
										mediaFile.executables[index].platform = event.target.innerText;
										setMediaFile({ ...mediaFile });
									}}
								/>
								<IconButton
									size="large"
									onClick={() => {
										mediaFile.executables = mediaFile.executables.filter((_, i) => i !== index);
										setMediaFile({ ...mediaFile });
									}}
								>
									<Delete />
								</IconButton>
							</Stack>
						</Grid>
					))}

					<Grid item xs={12}>
						{mediaFile.torrent}
					</Grid>
					<Grid item xs={12}>
						<Stack direction={'row'} justifyContent={'end'}>
							<IconButton
								size="large"
								onClick={() => {
									mediaFile.executables = [
										...mediaFile.executables,
										{
											platform: '',
											command: '',
										},
									];
									setMediaFile({ ...mediaFile });
								}}
							>
								<Add />
							</IconButton>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={5}>
						<TextField
							sx={{ width: '100%' }}
							label="Name"
							variant="filled"
							value={mediaFile.name}
							onChange={(event: any) => {
								mediaFile.name = event.target.value;
								setMediaFile({ ...mediaFile });
							}}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<TextField
							sx={{ width: '100%' }}
							label="Version"
							variant="filled"
							value={mediaFile.version}
							onChange={(event: any) => {
								mediaFile.version = event.target.value;
								setMediaFile({ ...mediaFile });
							}}
						/>
					</Grid>
					<Grid item xs={6} sm={3}>
						<FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
							<InputLabel htmlFor="filled-adornment-size">Size</InputLabel>
							<Input
								id="filled-adornment-size"
								disabled
								value={
									mediaFile.size / 1024 / 1024 / 1024 > 1
										? (mediaFile.size / 1024 / 1024 / 1024).toFixed(3)
										: mediaFile.size / 1024 / 1024 > 1
										? (mediaFile.size / 1024 / 1024).toFixed(3)
										: (mediaFile.size / 1024).toFixed(3)
								}
								endAdornment={
									<InputAdornment position="end">
										{mediaFile.size / 1024 / 1024 / 1024 > 1 ? 'GB' : mediaFile.size / 1024 / 1024 > 1 ? 'MB' : 'KB'}
									</InputAdornment>
								}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={5}>
						<FormControl variant="filled" sx={{ width: '100%' }}>
							<InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
							<FilledInput
								id="filled-adornment-password"
								type={showPassword ? 'text' : 'password'}
								aria-label="Password"
								value={mediaFile.password}
								onChange={(event: any) => {
									mediaFile.password = event.target.value;
									setMediaFile({ ...mediaFile });
								}}
								onClick={() => {
									alert(
										'Do not commit a change to your password without generating a new torrent. Changing the password may make the old torrent unusable for new users.'
									);
								}}
								sx={{ width: '100%' }}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label={showPassword ? 'hide the password' : 'display the password'}
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											onMouseUp={handleMouseUpPassword}
											edge="end"
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={1}>
						<IconButton
							size="large"
							onClick={() => {
								alert(
									'Do not commit a change to your password without generating a new torrent. Changing the password may make the old torrent unusable for new users.'
								);
								const randPassword = new Array(15)
									.fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
									.map((x) =>
										(function (chars) {
											const umax = 2 ** 32;
											const r = new Uint32Array(1);
											const max = umax - (umax % chars.length);
											do {
												crypto.getRandomValues(r);
											} while (r[0] > max);
											return chars[r[0] % chars.length];
										})(x)
									)
									.join('');
								mediaFile.password = randPassword;
								setMediaFile({ ...mediaFile });
							}}
						>
							<CasinoIcon />
						</IconButton>
					</Grid>
					<Grid item xs={6} justifyContent={'end'}>
						<Button
							size="large"
							variant="contained"
							onClick={async () => {
								console.log('Open Generate Torrent');
								setOpenGenerateTorrentModal(true);
							}}
						>
							Generate Torrent
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</Stack>
	);
};

export interface MediaFilesEditorProps {
	media: Media;
	setMedia: React.Dispatch<React.SetStateAction<Media>>;
}

export const MediaFilesEditor = (props: MediaFilesEditorProps) => {
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
			<Typography variant="h5">Files</Typography>
			<Stack spacing={2} justifyContent={'space-between'}>
				{mediaLocal.files &&
					mediaLocal.files.map((file, index) => (
						<MediaFileEditor
							key={index}
							mediaFile={file}
							setMediaFile={(newMediaFile: MediaFiles) => {
								mediaLocal.files[index] = newMediaFile;
								setMediaLocal({ ...mediaLocal });
							}}
						/>
					))}
				<Stack direction={'row'} justifyContent={'end'}>
					<IconButton
						size="large"
						onClick={() => {
							console.log('Add File');
							if (!mediaLocal.files) {
								mediaLocal.files = [];
							}
							mediaLocal.files = [
								...mediaLocal.files,
								{
									name: '',
									size: 0,
									torrent: '',
									executables: [
										{
											platform: 'Windows',
											command: '',
										},
									],
									password: '',
									version: '',
								},
							];
							setMediaLocal({ ...mediaLocal });
						}}
					>
						<Add />
					</IconButton>
					<IconButton
						size="large"
						onClick={() => {
							setInfoTitle('Executable');
							setInfoDescription('The executable of the media');
						}}
					>
						<Info />
					</IconButton>
				</Stack>
			</Stack>
		</Paper>
	);
};
