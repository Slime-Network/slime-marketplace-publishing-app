import { Info, Add, Delete } from '@mui/icons-material';
import { Autocomplete, Box, Grid, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

import { InfoModal } from '../slime-shared/components/InfoModal';
import { Media, MediaCredit } from '../slime-shared/types/slime/Media';

const roles = [
	{
		name: 'Senior Producer',
		group: 'Production',
	},
	{
		name: 'Producer',
		group: 'Production',
	},
	{
		name: 'Junior Producer',
		group: 'Production',
	},
	{
		name: 'Supervisor',
		group: 'Production',
	},
	{
		name: 'Associate Producer',
		group: 'Production',
	},
	{
		name: 'Production Coordinator',
		group: 'Production',
	},
	{
		name: 'Project Management/Assistance',
		group: 'Production',
	},
	{
		name: 'Game/Development Director',
		group: 'Production',
	},
	{
		name: 'Project Leader/Manager',
		group: 'Production',
	},
	{
		name: 'Production Manager',
		group: 'Production',
	},
	{
		name: 'Original Concept/Idea',
		group: 'Design',
	},
	{
		name: 'Created by',
		group: 'Design',
	},
	{
		name: 'Creative Director',
		group: 'Design',
	},
	{
		name: 'Design Director',
		group: 'Design',
	},
	{
		name: 'Research',
		group: 'Design',
	},
	{
		name: 'Level Designer',
		group: 'Design',
	},
	{
		name: 'Quest Designer',
		group: 'Design',
	},
	{
		name: 'Game Designer”',
		group: 'Design',
	},
	{
		name: 'Planning',
		group: 'Design',
	},
	{
		name: 'Lead Designer',
		group: 'Design',
	},

	{
		name: 'Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Engineer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Technical Director',
		group: 'Programming/Engineering',
	},
	{
		name: 'Scripter',
		group: 'Programming/Engineering',
	},
	{
		name: 'Software Architect',
		group: 'Programming/Engineering',
	},
	{
		name: 'Rendering Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Physics Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'AI Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Network Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Tools Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Lead Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Programming',
		group: 'Programming/Engineering',
	},
	{
		name: 'Engine Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Gameplay Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'AI Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Network Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Tools Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Physics Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Rendering Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Audio Programmer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Lead Engineer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Engineer',
		group: 'Programming/Engineering',
	},
	{
		name: 'Software Engineer',
		group: 'Programming/Engineering',
	},

	{
		name: 'QA',
		group: 'Quality Assurance',
	},
	{
		name: 'QA Lead',
		group: 'Quality Assurance',
	},
	{
		name: 'QA Tester',
		group: 'Quality Assurance',
	},
	{
		name: 'QA Manager',
		group: 'Quality Assurance',
	},
	{
		name: 'QA Engineer',
		group: 'Quality Assurance',
	},
	{
		name: 'QA Analyst',
		group: 'Quality Assurance',
	},
	{
		name: 'QA Specialist',
		group: 'Quality Assurance',
	},
	{
		name: 'QA Coordinator',
		group: 'Quality Assurance',
	},
	{
		name: 'QA Supervisor',
		group: 'Quality Assurance',
	},
	{
		name: 'QA Director',
		group: 'Quality Assurance',
	},
	{
		name: 'QA Consultant',
		group: 'Quality Assurance',
	},

	{
		name: 'Writer',
		group: 'Writing',
	},
	{
		name: 'Narrative Designer',
		group: 'Writing',
	},
	{
		name: 'Based on story from',
		group: 'Writing',
	},
	{
		name: 'Scenario Designer',
		group: 'Writing',
	},
	{
		name: 'Dialogue Writer',
		group: 'Writing',
	},
	{
		name: 'Linguistics',
		group: 'Writing',
	},

	{
		name: '2D Artist',
		group: 'Art/Graphics',
	},
	{
		name: '3D Artist',
		group: 'Art/Graphics',
	},
	{
		name: 'UI Artist/Graphics',
		group: 'Art/Graphics',
	},
	{
		name: 'Menu/HUD Graphics',
		group: 'Art/Graphics',
	},
	{
		name: 'Art Director',
		group: 'Art/Graphics',
	},
	{
		name: 'Visuals',
		group: 'Art/Graphics',
	},
	{
		name: 'Interface',
		group: 'Art/Graphics',
	},
	{
		name: 'Animator',
		group: 'Art/Graphics',
	},
	{
		name: 'Cinematic/Cutscene Artist',
		group: 'Art/Graphics',
	},
	{
		name: 'Concept Art',
		group: 'Art/Graphics',
	},
	{
		name: 'Character Design',
		group: 'Art/Graphics',
	},
	{
		name: 'Storyboard',
		group: 'Art/Graphics',
	},
	{
		name: 'Illustrations',
		group: 'Art/Graphics',
	},
	{
		name: 'Modeler',
		group: 'Art/Graphics',
	},
	{
		name: 'Environment Artist',
		group: 'Art/Graphics',
	},

	{
		name: 'Movie/Cutscene Director',
		group: 'Video/Cinematics',
	},
	{
		name: 'Movie/Cutscene Producer',
		group: 'Video/Cinematics',
	},
	{
		name: 'Motion Capture',
		group: 'Video/Cinematics',
	},

	{
		name: 'Voice Talent',
		group: 'Video/Cinematics',
	},
	{
		name: 'Voice Localization',
		group: 'Video/Cinematics',
	},
	{
		name: 'Audio Engineering',
		group: 'Video/Cinematics',
	},
	{
		name: 'Audio Producer',
		group: 'Video/Cinematics',
	},
	{
		name: 'Audio Director',
		group: 'Video/Cinematics',
	},
	{
		name: 'Voice Recording',
		group: 'Video/Cinematics',
	},
	{
		name: 'SFX',
		group: 'Video/Cinematics',
	},
	{
		name: 'Sound Design',
		group: 'Video/Cinematics',
	},
	{
		name: 'Audio Design',
		group: 'Video/Cinematics',
	},
	{
		name: 'Music Design',
		group: 'Video/Cinematics',
	},
	{
		name: 'Marketing',
		group: 'Marketing',
	},
	{
		name: 'Advertising',
		group: 'Marketing',
	},
	{
		name: 'Brand Management',
		group: 'Marketing',
	},
	{
		name: 'Media Management',
		group: 'Marketing',
	},
	{
		name: 'Events Management',
		group: 'Marketing',
	},
	{
		name: 'User research',
		group: 'Marketing',
	},
	{
		name: 'Product Manager',
		group: 'Marketing',
	},

	{
		name: 'Public Relations',
		group: 'Public Relations',
	},
	{
		name: 'Press Relations',
		group: 'Public Relations',
	},
	{
		name: 'Corporate Communications”',
		group: 'Public Relations',
	},
	{
		name: 'Communications Manager/Specialist',
		group: 'Public Relations',
	},
	{
		name: 'Community Manager',
		group: 'Public Relations',
	},
	{
		name: 'Social Media Manager',
		group: 'Public Relations',
	},
	{
		name: 'Publicist',
		group: 'Public Relations',
	},

	{
		name: 'Packaging',
		group: 'Creative Services',
	},
	{
		name: 'Manual writing',
		group: 'Creative Services',
	},
	{
		name: 'Documentation',
		group: 'Creative Services',
	},
	{
		name: 'Cover Art',
		group: 'Creative Services',
	},
	{
		name: 'Editor',
		group: 'Creative Services',
	},
	{
		name: 'Manual Illustrations',
		group: 'Creative Services',
	},
	{
		name: 'Promotional Art',
		group: 'Creative Services',
	},
	{
		name: 'Package Design',
		group: 'Creative Services',
	},

	{
		name: 'IT Director/Supervisor',
		group: 'Technology',
	},
	{
		name: 'Website Developer',
		group: 'Technology',
	},
	{
		name: 'Network Administrator',
		group: 'Technology',
	},
	{
		name: 'Webmaster',
		group: 'Technology',
	},
	{
		name: 'Management Information System',
		group: 'Technology',
	},
	{
		name: 'IT Group',
		group: 'Technology',
	},
	{
		name: 'R&D Specialist/Manager',
		group: 'Technology',
	},
	{
		name: 'Tools',
		group: 'Technology',
	},
	{
		name: 'Mastering',
		group: 'Technology',
	},

	{
		name: 'Relations',
		group: 'Technology',
	},

	{
		name: 'Customer Support',
		group: 'Customer/Technical Support',
	},
	{
		name: 'Customer Management',
		group: 'Customer/Technical Support',
	},
	{
		name: 'Technician',
		group: 'Customer/Technical Support',
	},
	{
		name: 'Representative',
		group: 'Customer/Technical Support',
	},

	{
		name: 'Studio Operations',
		group: 'Administration',
	},
	{
		name: 'Human Resources',
		group: 'Administration',
	},
	{
		name: 'Secretary',
		group: 'Administration',
	},
	{
		name: 'Office Manager',
		group: 'Administration',
	},
	{
		name: 'Recruiter',
		group: 'Administration',
	},
	{
		name: 'Personal Assistant',
		group: 'Administration',
	},

	{
		name: 'Consultant',
		group: 'Support',
	},
	{
		name: 'Adviser',
		group: 'Support',
	},

	{
		name: 'Special Thanks',
		group: 'Thanks',
	},
	{
		name: 'Thanks',
		group: 'Thanks',
	},
	{
		name: 'Dedicated to',
		group: 'Thanks',
	},
	{
		name: 'In Memory of',
		group: 'Thanks',
	},
	{
		name: 'Backer',
		group: 'Thanks',
	},
];

export interface CreditEditorProps {
	credit: MediaCredit;
	setCredit: (newCredit: MediaCredit | undefined) => void;
}

export const CreditEditor = (props: CreditEditorProps) => {
	const { credit, setCredit } = props;

	const [did, setDid] = React.useState(credit.did);
	const [role, setRole] = React.useState({ name: credit.role, group: '' });

	React.useEffect(() => {
		console.log('444', role);

		setCredit({
			did,
			role: role.name,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- aoeaoe
	}, [did, role]);

	// React.useEffect(() => {
	// 	console.log('333', credit);
	// 	setDid(credit.did);
	// 	setRole({ name: credit.role, group: '' });
	// }, [credit]);

	return (
		<Stack>
			<Grid container alignItems={'center'} justifyContent={'center'} spacing={1}>
				<Grid item xs={6}>
					<TextField
						sx={{ width: '100%' }}
						label="DID"
						variant="filled"
						value={did}
						onChange={(event: any) => {
							setDid(event.target.value);
						}}
					/>
				</Grid>
				<Grid item xs={5}>
					<Autocomplete
						options={roles}
						value={role}
						sx={{ width: '100%' }}
						getOptionLabel={(option) => (option as { name: string; group: string }).name}
						groupBy={(option) => (option as { name: string; group: string }).group}
						freeSolo
						renderOption={(propss, option) => (
							<Box component="li" sx={{}} {...propss}>
								{(option as { name: string; group: string }).name}
							</Box>
						)}
						renderInput={(params) => <TextField {...params} label="Role" />}
						onChange={(event: any) => {
							setRole({ name: event.target.innerText, group: 'Custom' });
						}}
					/>
				</Grid>

				<Grid item xs={0.5}>
					<IconButton
						size="large"
						onClick={() => {
							setCredit(undefined);
						}}
					>
						<Delete />
					</IconButton>
				</Grid>
			</Grid>
		</Stack>
	);
};

export interface CreditsEditorProps {
	media: Media;
	setMedia: React.Dispatch<React.SetStateAction<Media>>;
}

export const CreditsEditor = (props: CreditsEditorProps) => {
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
			<Typography variant="h5">Credits</Typography>
			<Stack spacing={2} justifyContent={'space-between'}>
				{mediaLocal.credits &&
					mediaLocal.credits.map((credit, index) => (
						<CreditEditor
							key={index}
							credit={credit}
							setCredit={(newCredit: MediaCredit | undefined) => {
								if (!newCredit) {
									mediaLocal.credits = mediaLocal.credits.filter((_, i) => i !== index);
									setMediaLocal({ ...mediaLocal });
									return;
								}
								mediaLocal.credits[index] = newCredit;
								setMediaLocal({ ...mediaLocal });
							}}
						/>
					))}
				<Stack direction={'row'} justifyContent={'end'}>
					<IconButton
						size="large"
						onClick={() => {
							mediaLocal.credits = [
								...mediaLocal.credits,
								{
									did: '',
									role: '',
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
							setInfoTitle('Credit');
							setInfoDescription('The credit of the media');
						}}
					>
						<Info />
					</IconButton>
				</Stack>
			</Stack>
		</Paper>
	);
};
