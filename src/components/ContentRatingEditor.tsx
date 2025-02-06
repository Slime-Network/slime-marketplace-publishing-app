import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	Box,
	Grid,
	IconButton,
	Modal,
	Paper,
	Slider,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import React from 'react';

import { InfoModal } from '../slime-shared/components/InfoModal';
import { RatingsOrgs } from '../slime-shared/constants/content-ratings';
import { Media, MediaContentRating } from '../slime-shared/types/slime/Media';
import CreditedImage from './CreditedImage';

export interface NewContentRatingModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	addContentRating: (newContentRating: MediaContentRating) => void;
}

const NewContentRatingModalStyle = {
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

export const NewContentRatingModal = (props: NewContentRatingModalProps) => {
	const { open, setOpen } = props;

	return (
		<Modal open={open} onClose={() => setOpen(false)} component="div" sx={NewContentRatingModalStyle}>
			<Box>
				<Autocomplete
					multiple
					options={RatingsOrgs}
					renderInput={(params) => <TextField {...params} label="ContentRatings" placeholder="Select ContentRatings" />}
				/>
				<IconButton color="primary" onClick={() => setOpen(false)}>
					<AddIcon />
				</IconButton>
			</Box>
		</Modal>
	);
};

export interface SlimeRatingEditorProps {
	rating: MediaContentRating;
	setRating: (newRating: MediaContentRating) => void;
}

export const SlimeRatingEditor = (props: SlimeRatingEditorProps) => {
	const { rating, setRating } = props;

	const [violence, setViolence] = React.useState(
		rating.containsContent.find((content) => content.content === 'Violence')?.value || 0
	);
	const [nudity, setNudity] = React.useState(
		rating.containsContent.find((content) => content.content === 'Nudity')?.value || 0
	);
	const [sexualThemes, setSexualThemes] = React.useState(
		rating.containsContent.find((content) => content.content === 'Sexual Themes')?.value || 0
	);
	const [explicitLanguage, setExplicitLanguage] = React.useState(
		rating.containsContent.find((content) => content.content === 'Explicit Language')?.value || 0
	);
	const [adultThemes, setAdultThemes] = React.useState(
		rating.containsContent.find((content) => content.content === 'Adult Themes')?.value || 0
	);
	const [microtransactions, setMicrotransactions] = React.useState(
		rating.containsContent.find((content) => content.content === 'Microtransactions')?.value || 0
	);
	const [lootBoxes, setLootBoxes] = React.useState(
		rating.containsContent.find((content) => content.content === 'Loot Boxes')?.value || 0
	);
	const [gambling, setGambling] = React.useState(
		rating.containsContent.find((content) => content.content === 'Gambling')?.value || 0
	);
	const [dataCollection, setDataCollection] = React.useState(
		rating.containsContent.find((content) => content.content === 'Data Collection')?.value || 0
	);
	const [onlineInteractions, setOnlineInteractions] = React.useState(
		rating.containsContent.find((content) => content.content === 'Online Interactions')?.value || 0
	);
	const [epilepsyWarning, setEpilepsyWarning] = React.useState(
		rating.containsContent.find((content) => content.content === 'Epilepsy Warning')?.value || 0
	);
	const [streamerSafe, setStreamerSafe] = React.useState(
		rating.containsContent.find((content) => content.content === 'Streamer Safe')?.value || 0
	);
	const [aiGeneratedContent, setAiGeneratedContent] = React.useState(
		rating.containsContent.find((content) => content.content === 'AI Generated Content')?.value || 0
	);

	React.useEffect(
		() =>
			setRating({
				name: rating.name,
				fullName: rating.fullName,
				link: rating.link,
				rating: rating.rating,
				containsContent: [
					{ content: 'Violence', value: violence },
					{ content: 'Nudity', value: nudity },
					{ content: 'Sexual Themes', value: sexualThemes },
					{ content: 'Explicit Language', value: explicitLanguage },
					{ content: 'Adult Themes', value: adultThemes },
					{ content: 'Microtransactions', value: microtransactions },
					{ content: 'Loot Boxes', value: lootBoxes },
					{ content: 'Gambling', value: gambling },
					{ content: 'Data Collection', value: dataCollection },
					{ content: 'Online Interactions', value: onlineInteractions },
					{ content: 'Epilepsy Warning', value: epilepsyWarning },
					{ content: 'Streamer Safe', value: streamerSafe },
					{ content: 'AI Generated Content', value: aiGeneratedContent },
				],
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- aoeu
		[
			adultThemes,
			aiGeneratedContent,
			dataCollection,
			epilepsyWarning,
			explicitLanguage,
			gambling,
			lootBoxes,
			microtransactions,
			nudity,
			onlineInteractions,
			rating.fullName,
			rating.link,
			rating.name,
			rating.rating,
			sexualThemes,
			streamerSafe,
			violence,
		]
	);

	return (
		<Grid container spacing={5} p={3} alignItems={'center'}>
			<Grid item xs={8}>
				{violence === 0 ? (
					<Typography variant="h5">No violence</Typography>
				) : violence === 25 ? (
					<Typography variant="h5">Cartoon Violence</Typography>
				) : violence === 50 ? (
					<Typography variant="h5">Mild Violence</Typography>
				) : violence === 75 ? (
					<Typography variant="h5">Graphic Violence</Typography>
				) : (
					<Typography variant="h5">Extreme Violence</Typography>
				)}
				<Slider
					defaultValue={0}
					value={violence}
					step={25}
					onChange={(event, value) => setViolence(value as number)}
					sx={{
						color:
							violence === 0
								? '#4CAF50'
								: violence === 25
								? '#E6C02C'
								: violence === 50
								? '#C97D18'
								: violence === 75
								? '#D45215'
								: '#BB1717',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{violence === 0 ? (
					<Typography variant="body1">Contains no depictions of violence at all.</Typography>
				) : violence === 25 ? (
					<Typography variant="body1">
						May contain mild cartoon violence. No blood or realistic weapons. Mostly non-human enemies, with bodies
						disappearing on death. etc.
					</Typography>
				) : violence === 50 ? (
					<Typography variant="body1">
						May contain mild, or non-graphic, violence. Minimal, or cartoon blood. Realistic gun play or melee combat, but
						without realistic depictions of injuries or death.
					</Typography>
				) : violence === 75 ? (
					<Typography variant="body1">
						May contain realistic, or graphic violence. Realistic weapons and combat, with human, or human-like characters.
						Standard levels of blood and gore are presented.
					</Typography>
				) : (
					<Typography variant="body1">
						May contain extreme or excessive levels of blood, gore, and death. Torture, dismemberment, and other extreme and
						graphic violence.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{violence === 0 ? (
					<CreditedImage
						src="images/Violence0.webp"
						artistName="XsuperrabbitX"
						artistSocials={[{ platform: 'Deviant Art', link: 'https://www.deviantart.com/xsuperabbitx' }]}
					/>
				) : violence === 25 ? (
					<CreditedImage
						src="images/Violence25.webp"
						artistName="Niko E Porter"
						artistSocials={[
							{ platform: 'Instagram', link: 'https://www.instagram.com/knockoutniko/#' },
							{ platform: 'X', link: 'https://x.com/knockoutniko' },
							{ platform: 'Youtube', link: 'https://www.youtube.com/@knockoutniko' },
							{ platform: 'ArtStation', link: 'https://www.artstation.com/nikoeporter' },
							{ platform: 'LinkTree', link: 'https://linktr.ee/knockoutniko' },
						]}
					/>
				) : violence === 50 ? (
					<CreditedImage
						src="images/Violence50.webp"
						artistName="William Puekker"
						artistSocials={[
							{ platform: 'Instagram', link: 'https://www.instagram.com/williampuekker/' },
							{ platform: 'ArtStation', link: 'https://www.artstation.com/puekkers' },
							{ platform: 'Deviant Art', link: 'https://www.deviantart.com/puekkers' },
						]}
					/>
				) : violence === 75 ? (
					<CreditedImage
						src="images/Violence75.webp"
						artistName="David Roya"
						artistSocials={[
							{ platform: 'Instagram', link: 'www.instagram.com/tri5tate/' },
							{ platform: 'Behance', link: 'https://www.behance.net/Tristate' },
						]}
					/>
				) : (
					<CreditedImage
						src="images/Violence100.webp"
						artistName="Mythallica"
						artistSocials={[
							{ platform: 'Instagram', link: 'https://www.instagram.com/mythallica/' },
							{ platform: 'X', link: 'https://x.com/mythallica' },
							{ platform: 'LinkTree', link: 'https://linktr.ee/Mythallica' },
						]}
					/>
				)}
			</Grid>

			<Grid item xs={8}>
				{nudity === 0 ? (
					<Typography variant="h5">No Nudity</Typography>
				) : nudity === 33 ? (
					<Typography variant="h5">Revealing Clothing</Typography>
				) : nudity === 66 ? (
					<Typography variant="h5">Mild Nudity</Typography>
				) : (
					<Typography variant="h5">Full Nudity</Typography>
				)}
				<Slider
					defaultValue={0}
					value={nudity}
					step={33}
					onChange={(event, value) => setNudity(value as number)}
					sx={{
						color: nudity === 0 ? '#4CAF50' : nudity === 33 ? '#E6C02C' : nudity === 66 ? '#C97D18' : '#BB1717',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{nudity === 0 ? (
					<Typography variant="body1">
						Characters are always fully clothed with outfits appropriate to show young children.
					</Typography>
				) : nudity === 33 ? (
					<Typography variant="body1">
						May contain revealing outfits that are skin tight, and/or show excessive amounts of skin. Thighs, cleavage,
						partially ass, shirtless men, etc. But female nipples and genitals are always covered.
					</Typography>
				) : nudity === 66 ? (
					<Typography variant="body1">
						May contain veiled nudity or implied nakedness, occasional female nipples and/or exposed ass. But no exposed
						genitals.
					</Typography>
				) : (
					<Typography variant="body1">May contain completely naked characters with exposed genitals.</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{nudity === 0 ? (
					<CreditedImage src="images/GeneralGood.webp" artistName="" artistSocials={[]} />
				) : nudity === 33 ? (
					<CreditedImage
						src="images/Nudity33.webp"
						artistName="Qichao Wang"
						artistSocials={[
							{ platform: 'ArtStation', link: 'https://www.artstation.com/qichaowang' },
							{ platform: 'Deviant Art', link: 'https://www.deviantart.com/gothicq' },
							{ platform: 'Weibo', link: 'https://weibo.com/gothicq1026' },
						]}
					/>
				) : nudity === 66 ? (
					<CreditedImage
						src="images/Nudity66.webp"
						artistName="Everybery"
						artistSocials={[
							{ platform: 'Deviant Art', link: 'https://www.deviantart.com/everybery/gallery' },
							{ platform: 'Discord', link: 'https://discord.gg/Everybery' },
							{ platform: 'Hipolink', link: 'https://hipolink.me/everybery' },
						]}
					/>
				) : (
					<CreditedImage
						src="images/Nudity100.webp"
						artistName="Graynaver & Rigid3D"
						artistSocials={[
							{ platform: 'Deviant Art (Graynaver)', link: 'https://www.deviantart.com/graynaver/' },
							{ platform: 'ArtStation (Graynaver)', link: 'https://www.artstation.com/graynaver' },
							{ platform: 'X (Graynaver)', link: 'https://x.com/Graynaver' },
							{ platform: 'Patreon (Rigid3D)', link: 'https://www.patreon.com/Rigid3d' },
							{ platform: 'X (Rigid3D)', link: 'https://x.com/rigid3d' },
						]}
						hidden
					/>
				)}
			</Grid>

			<Grid item xs={8}>
				{sexualThemes === 0 ? (
					<Typography variant="h5">No Romance or Sexual Themes</Typography>
				) : sexualThemes === 25 ? (
					<Typography variant="h5">Wholesome Romance</Typography>
				) : sexualThemes === 50 ? (
					<Typography variant="h5">Mild Sexual Themes</Typography>
				) : sexualThemes === 75 ? (
					<Typography variant="h5">Explicit Sexual Themes</Typography>
				) : (
					<Typography variant="h5">Extreme Sexual Themes</Typography>
				)}
				<Slider
					defaultValue={0}
					value={sexualThemes}
					step={25}
					onChange={(event, value) => setSexualThemes(value as number)}
					sx={{
						color:
							sexualThemes === 0
								? '#4CAF50'
								: sexualThemes === 25
								? '#E6C02C'
								: sexualThemes === 50
								? '#C97D18'
								: sexualThemes === 75
								? '#D45215'
								: '#BB1717',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{sexualThemes === 0 ? (
					<Typography variant="body1">Contains no romance or sexual themes at all.</Typography>
				) : sexualThemes === 25 ? (
					<Typography variant="body1">
						May contain simple references to love, romance and relationships but no depictions or references of anything
						beyond holding hands, hugging, or a light kiss.
					</Typography>
				) : sexualThemes === 50 ? (
					<Typography variant="body1">
						May contain sexualized characters/outfits, references to sex, lewd jokes and innuendo. Infrequent or mild sexual
						interactions such as heavy kissing or groping, or implied sex that is not shown.
					</Typography>
				) : sexualThemes === 75 ? (
					<Typography variant="body1">
						May contain explicit sexual topics and content including consensual sex between characters on screen, but nothing
						that an average adult would considered extreme, or purely pornographic.
					</Typography>
				) : (
					<Typography variant="body1">
						May contain purely pornographic content, graphic sex acts, fetish content, sexual violence, or other explicitly
						sexual adult themes.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{sexualThemes === 0 ? (
					<CreditedImage
						src="images/SexualThemes0.webp"
						artistName="icrdr"
						artistSocials={[{ platform: 'Deviant Art', link: 'https://www.deviantart.com/icrdr' }]}
					/>
				) : sexualThemes === 25 ? (
					<CreditedImage
						src="images/SexualThemes25.webp"
						artistName="JubyArt"
						artistSocials={[
							{ platform: 'Twitch', link: 'https://www.twitch.tv/jubyart' },
							{ platform: 'X', link: 'https://x.com/cuttimecomic' },
							{ platform: 'Patreon', link: 'https://www.patreon.com/jubyart' },
							{ platform: 'Tumblr', link: 'https://jubyart.tumblr.com/' },
							{ platform: 'Deviant Art', link: 'https://www.deviantart.com/joodlez' },
						]}
					/>
				) : sexualThemes === 50 ? (
					<CreditedImage
						src="images/Nudity66.webp"
						artistName="Everybery"
						artistSocials={[
							{ platform: 'Deviant Art', link: 'https://www.deviantart.com/everybery/gallery' },
							{ platform: 'Discord', link: 'https://discord.gg/Everybery' },
							{ platform: 'Hipolink', link: 'https://hipolink.me/everybery' },
						]}
					/>
				) : sexualThemes === 75 ? (
					<CreditedImage
						src="images/SexualThemes75.webp"
						artistName="Feyspeaker"
						artistSocials={[
							{ platform: 'X', link: 'https://twitter.com/feyspeaker' },
							{ platform: 'Website', link: 'https://www.feyspeaker.com/' },
							{ platform: 'Patreon', link: 'https://www.patreon.com/user?u=41998914' },
							{ platform: 'Instagram', link: 'https://www.instagram.com/feyspeaker' },
							{ platform: 'Deviant Art', link: 'https://www.deviantart.com/feyspeaker' },
							{ platform: 'Tumblr', link: 'https://www.feyspeaker.tumblr.com/' },
						]}
						hidden
					/>
				) : (
					<CreditedImage
						src="images/SexualThemes100.webp"
						artistName="NeoCoill"
						artistSocials={[
							{ platform: 'X', link: 'https://x.com/NeoCoillHQ' },
							{ platform: 'Patreon', link: 'https://www.patreon.com/NeoCoill' },
							{ platform: 'LinkTree', link: 'https://linktr.ee/NeoCoill' },
						]}
						hidden
					/>
				)}
			</Grid>

			<Grid item xs={8}>
				{explicitLanguage === 0 ? (
					<Typography variant="h5">No Explicit Language</Typography>
				) : explicitLanguage === 33 ? (
					<Typography variant="h5">Inappropriate Language</Typography>
				) : explicitLanguage === 66 ? (
					<Typography variant="h5">Mild Explicit Language</Typography>
				) : (
					<Typography variant="h5">Explicit Language</Typography>
				)}
				<Slider
					defaultValue={0}
					value={explicitLanguage}
					step={33}
					onChange={(event, value) => setExplicitLanguage(value as number)}
					sx={{
						color:
							explicitLanguage === 0
								? '#4CAF50'
								: explicitLanguage === 33
								? '#E6C02C'
								: explicitLanguage === 66
								? '#C97D18'
								: '#BB1717',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{explicitLanguage === 0 ? (
					<Typography variant="body1">Contains no harsh language.</Typography>
				) : explicitLanguage === 33 ? (
					<Typography variant="body1">
						May contain language that could be considered too aggressive or inappropriate for young children.
					</Typography>
				) : explicitLanguage === 66 ? (
					<Typography variant="body1">
						May contain mild or infrequent use of common profanity such as "crap" or "shit", dirty jokes, and other harsh
						language.
					</Typography>
				) : (
					<Typography variant="body1">
						May contain extreme and/or frequent use of profanity, slurs, or other offensive language.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{explicitLanguage === 0 ? (
					<CreditedImage
						src="images/ExplicitLanguage0.webp"
						artistName="TsaoShin"
						artistSocials={[
							{ platform: 'Deviant Art', link: 'https://www.deviantart.com/tsaoshin' },
							{ platform: 'X', link: 'https://x.com/tsaoshin' },
							{ platform: 'Instagram', link: 'https://www.instagram.com/tsaoshin/' },
							{ platform: 'Youtube', link: 'https://www.youtube.com/@TsaoShin' },
						]}
					/>
				) : explicitLanguage === 33 ? (
					<CreditedImage src="images/GeneralCaution.webp" artistName="" artistSocials={[]} />
				) : explicitLanguage === 66 ? (
					<CreditedImage
						src="images/ExplicitLanguage66.webp"
						artistName="tazsaints"
						artistSocials={[
							{ platform: 'Deviant Art', link: 'ww.patreon.com/tazsaints' },
							{ platform: 'Patreon', link: 'www.patreon.com/tazsaints' },
						]}
					/>
				) : (
					<CreditedImage
						src="images/ExplicitLanguage100.webp"
						artistName="Dylrocks95"
						artistSocials={[{ platform: 'Deviant Art', link: 'https://www.deviantart.com/dylrocks95' }]}
					/>
				)}
			</Grid>

			<Grid item xs={8}>
				{adultThemes === 0 ? (
					<Typography variant="h5">No Mature Themes</Typography>
				) : adultThemes === 33 ? (
					<Typography variant="h5">Mild Mature Themes</Typography>
				) : adultThemes === 66 ? (
					<Typography variant="h5">Mature Themes</Typography>
				) : (
					<Typography variant="h5">Adult Themes</Typography>
				)}
				<Slider
					defaultValue={0}
					value={adultThemes}
					step={33}
					onChange={(event, value) => setAdultThemes(value as number)}
					sx={{
						color:
							adultThemes === 0 ? '#4CAF50' : adultThemes === 33 ? '#E6C02C' : adultThemes === 66 ? '#C97D18' : '#BB1717',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{adultThemes === 0 ? (
					<Typography variant="body1">Does not include any additional mature themes.</Typography>
				) : adultThemes === 33 ? (
					<Typography variant="body1">
						May contain some mature themes that may not be appropriate for young children such as smoking, alcohol use, mental
						health issues, gender/sexuality, family issues/divorce, prescription drug use
					</Typography>
				) : adultThemes === 66 ? (
					<Typography variant="body1">
						May contain heavier mature themes such as crime, illegal drug use, racism/bigotry, psychological horror
					</Typography>
				) : (
					<Typography variant="body1">
						May contain heavy adult themes that are not appropriate for children such as murder, sexual assault, rape,
						suicide, etc.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{adultThemes === 0 ? (
					<CreditedImage
						src="images/AdultThemes0.webp"
						artistName="Clarisse Magand"
						artistSocials={[
							{ platform: 'ArtStation', link: 'https://www.artstation.com/clarissemagand' },
							{ platform: 'X', link: 'https://x.com/LuciaSatalina' },
						]}
					/>
				) : adultThemes === 33 ? (
					<CreditedImage
						src="images/AdultThemes33.webp"
						artistName="Lilliamrose"
						artistSocials={[{ platform: 'Deviant Art', link: 'https://www.deviantart.com/lilliamrose' }]}
					/>
				) : adultThemes === 66 ? (
					<CreditedImage
						src="images/AdultThemes66.webp"
						artistName="Deiv Calviz"
						artistSocials={[
							{ platform: 'Instagram', link: 'https://www.instagram.com/deivcalviz' },
							{ platform: 'ArtStation', link: 'https://www.artstation.com/deivcalviz' },
							{ platform: 'X', link: 'https://twitter.com/deivcalviz' },
							{ platform: 'LinkedIn', link: 'https://www.linkedin.com/in/deivcalviz' },
							{ platform: 'Website', link: 'https://deivcalviz.com/' },
						]}
					/>
				) : (
					<CreditedImage
						src="images/AdultThemes100.webp"
						artistName="Shindo L"
						artistSocials={[
							{ platform: 'X', link: 'https://x.com/Shindo_L' },
							{ platform: 'Patreon', link: 'patreon.com/shindol' },
							{ platform: 'Website', link: 'https://dahootch.com/' },
						]}
					/>
				)}
			</Grid>

			<Grid item xs={8}>
				{microtransactions === 0 ? (
					<Typography variant="h5">No Microtransactions</Typography>
				) : microtransactions === 50 ? (
					<Typography variant="h5">Cosmetic Microtransactions</Typography>
				) : (
					<Typography variant="h5">Microtransactions</Typography>
				)}
				<Slider
					defaultValue={0}
					value={microtransactions}
					step={50}
					onChange={(event, value) => setMicrotransactions(value as number)}
					sx={{
						color: microtransactions === 0 ? '#4CAF50' : microtransactions === 50 ? '#E6C02C' : '#D45215',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{microtransactions === 0 ? (
					<Typography variant="body1">
						Does not contain microtransactions (May still include options to remove ads, or to buy DLC/expansions that add new
						content)
					</Typography>
				) : microtransactions === 50 ? (
					<Typography variant="body1">
						Only contains microtransactions that affect cosmetics (Skins, emotes, etc.) but do not affect gameplay. (Does not
						include options to remove ads, or to buy DLC/expansions that add new content)
					</Typography>
				) : (
					<Typography variant="body1">
						Contains microtransactions that affect gameplay including options to buy in game currencies or items that can be
						used to advance in the game quicker, or more easily.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{microtransactions === 0 ? (
					<CreditedImage src="images/GeneralGood.webp" artistName="" artistSocials={[]} />
				) : microtransactions === 50 ? (
					<CreditedImage src="images/GeneralCaution.webp" artistName="" artistSocials={[]} />
				) : (
					<CreditedImage src="images/GeneralWarning.webp" artistName="" artistSocials={[]} />
				)}
			</Grid>

			<Grid item xs={8}>
				{lootBoxes === 0 ? (
					<Typography variant="h5">No Loot Boxes / Gacha</Typography>
				) : lootBoxes === 50 ? (
					<Typography variant="h5">In-Game Loot Boxes / Gacha</Typography>
				) : (
					<Typography variant="h5">Loot Boxes / Gacha</Typography>
				)}
				<Slider
					defaultValue={0}
					value={lootBoxes}
					step={50}
					onChange={(event, value) => setLootBoxes(value as number)}
					sx={{
						color: lootBoxes === 0 ? '#4CAF50' : lootBoxes === 50 ? '#E6C02C' : '#D45215',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{lootBoxes === 0 ? (
					<Typography variant="body1">Does not include Loot Boxes, or other randomized reward mechanics</Typography>
				) : lootBoxes === 50 ? (
					<Typography variant="body1">
						May contain Loot Boxes, Gacha, or other randomized reward mechanics, but they cannot be purchased directly, or
						indirectly with real money.
					</Typography>
				) : (
					<Typography variant="body1">
						Contains Loot Boxes, Gacha, or other randomized rewards that can be purchased directly, or indirectly with real
						money.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{lootBoxes === 0 ? (
					<CreditedImage
						src="images/GeneralGood.webp"
						artistName=""
						artistSocials={[{ platform: 'Deviant Art', link: '' }]}
					/>
				) : lootBoxes === 50 ? (
					<CreditedImage
						src="images/GeneralCaution.webp"
						artistName=""
						artistSocials={[
							{ platform: 'Instagram', link: '' },
							{ platform: 'ArtStation', link: '' },
							{ platform: 'Deviant Art', link: '' },
						]}
					/>
				) : (
					<CreditedImage
						src="images/GeneralWarning.webp"
						artistName=""
						artistSocials={[
							{ platform: 'Instagram', link: '' },
							{ platform: 'X', link: '' },
							{ platform: 'LinkTree', link: '' },
						]}
					/>
				)}
			</Grid>

			<Grid item xs={8}>
				{gambling === 0 ? (
					<Typography variant="h5">No Gambling</Typography>
				) : gambling === 50 ? (
					<Typography variant="h5">In-Game Gambling</Typography>
				) : (
					<Typography variant="h5">Gambling</Typography>
				)}
				<Slider
					defaultValue={0}
					value={gambling}
					step={50}
					onChange={(event, value) => setGambling(value as number)}
					sx={{
						color: gambling === 0 ? '#4CAF50' : gambling === 50 ? '#E6C02C' : '#D45215',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{gambling === 0 ? (
					<Typography variant="body1">Does not include gambling themes, or the ability to gamble.</Typography>
				) : gambling === 50 ? (
					<Typography variant="body1">
						The game contains the ability to gamble with in-game currency or items which cannot be directly or indirectly
						traded for any real world currency or items.
					</Typography>
				) : (
					<Typography variant="body1">
						The game contains or facilitates the ability to gamble directly or indirectly with real world currencies or items
						or in-game currencies or items that can be exchanged for real-world currency or items.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{gambling === 0 ? (
					<CreditedImage
						src="images/GeneralGood.webp"
						artistName=""
						artistSocials={[{ platform: 'Deviant Art', link: '' }]}
					/>
				) : gambling === 50 ? (
					<CreditedImage
						src="images/Gambling50.webp"
						artistName="Bruce Glidewell"
						artistSocials={[
							{ platform: 'Instagram', link: 'https://www.instagram.com/bruceglidewell' },
							{ platform: 'ArtStation', link: 'https://www.artstation.com/bruceglidewell' },
							{ platform: 'LinkedIn', link: 'https://www.linkedin.com/in/bruceglidewell' },
						]}
					/>
				) : (
					<CreditedImage
						src="images/Gambling100.webp"
						artistName="Novtilus"
						artistSocials={[
							{ platform: 'Deviant Art', link: 'https://www.deviantart.com/novtilus' },
							{ platform: 'FaceBook', link: 'http://www.facebook.com/novtilus' },
						]}
					/>
				)}
			</Grid>

			<Grid item xs={8}>
				{dataCollection === 0 ? (
					<Typography variant="h5">No Data Collection</Typography>
				) : dataCollection === 33 ? (
					<Typography variant="h5">Anonymous Data Collection</Typography>
				) : dataCollection === 66 ? (
					<Typography variant="h5">Optional Data Collection</Typography>
				) : (
					<Typography variant="h5">Mandatory Data Collection</Typography>
				)}
				<Slider
					defaultValue={0}
					value={dataCollection}
					step={33}
					onChange={(event, value) => setDataCollection(value as number)}
					sx={{
						color:
							dataCollection === 0
								? '#4CAF50'
								: dataCollection === 33
								? '#E6C02C'
								: dataCollection === 66
								? '#C97D18'
								: '#BB1717',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{dataCollection === 0 ? (
					<Typography variant="body1">
						No user data is collected, stored, or shared by the game or its developers.
					</Typography>
				) : dataCollection === 33 ? (
					<Typography variant="body1">
						Only anonymous data such as performance logs, system specs, and crash reports are collected without any personal
						or sensitive information.
					</Typography>
				) : dataCollection === 66 ? (
					<Typography variant="body1">
						Users are clearly prompted for consent to opt-in to having their data collected, and are notified what data is
						being collected and who it is being shared with. Choosing not to opt-in does not affect the game experience.
					</Typography>
				) : (
					<Typography variant="body1">
						Personal user information is collected, stored and/or shared with other entities without the knowledge and consent
						of the user, or without a clear and easy way to opt-out that does not affect the game experience.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{dataCollection === 0 ? (
					<CreditedImage
						src="images/GeneralGood.webp"
						artistName=""
						artistSocials={[{ platform: 'Deviant Art', link: '' }]}
					/>
				) : dataCollection === 33 ? (
					<CreditedImage
						src="images/GeneralGood.webp"
						artistName=""
						artistSocials={[
							{ platform: 'Instagram', link: '' },
							{ platform: 'X', link: '' },
							{ platform: 'Youtube', link: '' },
							{ platform: 'ArtStation', link: '' },
							{ platform: 'LinkTree', link: '' },
						]}
					/>
				) : dataCollection === 66 ? (
					<CreditedImage
						src="images/GeneralCaution.webp"
						artistName=""
						artistSocials={[
							{ platform: 'Instagram', link: '' },
							{ platform: 'ArtStation', link: '' },
							{ platform: 'Deviant Art', link: '' },
						]}
					/>
				) : (
					<CreditedImage
						src="images/GeneralWarning.webp"
						artistName=""
						artistSocials={[
							{ platform: 'Instagram', link: '' },
							{ platform: 'X', link: '' },
							{ platform: 'LinkTree', link: '' },
						]}
					/>
				)}
			</Grid>

			<Grid item xs={8}>
				{onlineInteractions === 0 ? (
					<Typography variant="h5">No Online Interactions</Typography>
				) : onlineInteractions === 50 ? (
					<Typography variant="h5">Moderated Online Interactions</Typography>
				) : (
					<Typography variant="h5">Online Interactions</Typography>
				)}
				<Slider
					defaultValue={0}
					value={onlineInteractions}
					step={50}
					onChange={(event, value) => setOnlineInteractions(value as number)}
					sx={{
						color: onlineInteractions === 0 ? '#4CAF50' : onlineInteractions === 50 ? '#E6C02C' : '#D45215',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{onlineInteractions === 0 ? (
					<Typography variant="body1">
						Does not allow for direct communications with other players, beyond safe pre-set emotes or reactions.
					</Typography>
				) : onlineInteractions === 50 ? (
					<Typography variant="body1">
						Allows for text chat between players, but is moderated for inappropriate language, bullying, or harassment.
					</Typography>
				) : (
					<Typography variant="body1">
						May allow for unmoderated interactions that can include text, and/or voice chat, and may expose players to
						harassment, bullying, or inappropriate content.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{onlineInteractions === 0 ? (
					<CreditedImage src="images/GeneralGood.webp" artistName="" artistSocials={[]} />
				) : onlineInteractions === 50 ? (
					<CreditedImage src="images/GeneralCaution.webp" artistName="" artistSocials={[]} />
				) : (
					<CreditedImage src="images/GeneralWarning.webp" artistName="" artistSocials={[]} />
				)}
			</Grid>

			<Grid item xs={8}>
				{epilepsyWarning === 0 ? (
					<Typography variant="h5">No Epilepsy Warning</Typography>
				) : epilepsyWarning === 50 ? (
					<Typography variant="h5">Epilepsy Caution</Typography>
				) : (
					<Typography variant="h5">Epilepsy Warning</Typography>
				)}
				<Slider
					defaultValue={0}
					value={epilepsyWarning}
					step={50}
					onChange={(event, value) => setEpilepsyWarning(value as number)}
					sx={{
						color: epilepsyWarning === 0 ? '#4CAF50' : epilepsyWarning === 50 ? '#E6C02C' : '#D45215',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{epilepsyWarning === 0 ? (
					<Typography variant="body1">Is not likely to trigger seizures in people with photosensitive epilepsy.</Typography>
				) : epilepsyWarning === 50 ? (
					<Typography variant="body1">
						Most of the time, the game is considered safe to play for people with photosensitive epilepsy but caution is
						advised. Some parts of the game may contain short, infrequent sequences of flashing lights or patterns that could
						potentially trigger seizures in people with photosensitive epilepsy.
					</Typography>
				) : (
					<Typography variant="body1">
						Is not recommended for people with photosensitive epilepsy as it contains frequent, unavoidable, or prolonged
						sequences of flashing lights or patterns that could trigger seizures.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{epilepsyWarning === 0 ? (
					<CreditedImage src="images/EpilepsyWarning0.webp" artistName="" artistSocials={[]} />
				) : epilepsyWarning === 50 ? (
					<CreditedImage src="images/EpilepsyWarning50.webp" artistName="" artistSocials={[]} />
				) : (
					<CreditedImage src="images/EpilepsyWarning100.webp" artistName="" artistSocials={[]} />
				)}
			</Grid>

			<Grid item xs={8}>
				{streamerSafe === 0 ? (
					<Typography variant="h5">Streamer Safe</Typography>
				) : streamerSafe === 50 ? (
					<Typography variant="h5">Streamer Safe Options</Typography>
				) : (
					<Typography variant="h5">Not Streamer Safe</Typography>
				)}
				<Slider
					defaultValue={0}
					value={streamerSafe}
					step={50}
					onChange={(event, value) => setStreamerSafe(value as number)}
					sx={{
						color: streamerSafe === 0 ? '#4CAF50' : streamerSafe === 50 ? '#E6C02C' : '#D45215',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{streamerSafe === 0 ? (
					<Typography variant="body1">
						Does not contain copywritten music or objectionable content that would cause a streamer to be flagged for
						copyright, demonetized, or banned.
					</Typography>
				) : streamerSafe === 50 ? (
					<Typography variant="body1">
						Provides an option to disable copywritten music or objectionable content that would cause a streamer to be flagged
						for copyright, demonetized, or banned, or it is easy to avoid.
					</Typography>
				) : (
					<Typography variant="body1">
						Not recommended for streaming as it contains copywritten content or unavoidable objectionable content that may
						cause a streamer to be flagged for copyright, demonetized, or banned.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{streamerSafe === 0 ? (
					<CreditedImage src="images/StreamerSafe0.webp" artistName="" artistSocials={[]} />
				) : streamerSafe === 50 ? (
					<CreditedImage src="images/StreamerSafe50.webp" artistName="" artistSocials={[]} />
				) : (
					<CreditedImage src="images/StreamerSafe100.webp" artistName="" artistSocials={[]} />
				)}
			</Grid>

			<Grid item xs={8}>
				{aiGeneratedContent === 0 ? (
					<Typography variant="h5">No AI Generated Content</Typography>
				) : aiGeneratedContent === 50 ? (
					<Typography variant="h5">AI Generation Features</Typography>
				) : (
					<Typography variant="h5">AI Generated Assets</Typography>
				)}
				<Slider
					defaultValue={0}
					value={aiGeneratedContent}
					step={50}
					onChange={(event, value) => setAiGeneratedContent(value as number)}
					sx={{
						color: aiGeneratedContent === 0 ? '#4CAF50' : aiGeneratedContent === 50 ? '#E6C02C' : '#D45215',
						'& .MuiSlider-thumb': {
							bottom: '15%',
						},
					}}
				/>
				{aiGeneratedContent === 0 ? (
					<Typography variant="body1">
						All art assets, music, and other content was created by human artists, musicians, and developers.
					</Typography>
				) : aiGeneratedContent === 50 ? (
					<Typography variant="body1">
						Contains creative or innovative use of generative AI that adds features or content that would not be possible
						without the use of AI.
					</Typography>
				) : (
					<Typography variant="body1">
						Contains art assets, music, or other content that was generated with the use of AI, or machine learning
						algorithms.
					</Typography>
				)}
			</Grid>
			<Grid item xs={4}>
				{aiGeneratedContent === 0 ? (
					<CreditedImage
						src="images/AiGeneratedContent0.webp"
						artistName="no-ai-icon.com"
						artistSocials={[{ platform: 'Website', link: 'https://no-ai-icon.com' }]}
					/>
				) : aiGeneratedContent === 50 ? (
					<CreditedImage
						src="images/AiGeneratedContent50.webp"
						artistName="Anny & Neuro Sama"
						artistSocials={[
							{ platform: 'X (Anny)', link: 'https://x.com/annytf' },
							{ platform: 'Twitch (Anny)', link: 'https://www.twitch.tv/anny' },
							{ platform: 'Youtube (Anny)', link: 'https://www.youtube.com/annytf' },
							{ platform: 'X (Neuro)', link: 'https://x.com/Vedal987' },
							{ platform: 'Twitch (Neuro)', link: 'https://www.twitch.tv/vedal987' },
							{ platform: 'Youtube (Neuro)', link: 'https://www.youtube.com/@Neurosama' },
						]}
					/>
				) : (
					<CreditedImage src="images/AiGeneratedContent100.webp" artistName="" artistSocials={[]} />
				)}
			</Grid>
		</Grid>
	);
};

export interface ContentRatingProps {
	media: Media;
	setMedia: React.Dispatch<React.SetStateAction<Media>>;
	setAdultContent: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContentRatingsEditor = (props: ContentRatingProps) => {
	const { media, setMedia, setAdultContent } = props;

	const [openInfoModal, setOpenInfoModal] = React.useState(false);
	const [infoTitle, setInfoTitle] = React.useState('');
	const [infoDescription, setInfoDescription] = React.useState('');

	// const [openNewContentRatingModal, setOpenNewContentRatingModal] = React.useState(false);

	const [mediaLocal, setMediaLocal] = React.useState<Media>(media);
	const [showAdult, setShowAdult] = React.useState(false);

	React.useEffect(() => {
		setMedia(mediaLocal);
		setShowAdult(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- o
	}, [mediaLocal, setMediaLocal]);

	React.useEffect(() => {
		setAdultContent(showAdult);
	}, [setAdultContent, showAdult]);

	return (
		<Paper sx={{ p: 2 }}>
			{/* <NewContentRatingModal
				open={openNewContentRatingModal}
				setOpen={setOpenNewContentRatingModal}
				addContentRating={(newContentRating: MediaContentRating) => {
					setContentRatingLocal([...media.contentRatings, newContentRating]);
				}}
			/> */}
			<InfoModal open={openInfoModal} setOpen={setOpenInfoModal} title={infoTitle} style="info">
				{infoDescription}
			</InfoModal>
			<Stack spacing={2}>
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ alignItems: 'center' }}>
						<Stack direction="row" spacing={2} alignItems={'center'}>
							<Typography variant="h5">Slime Network Self-Rating Questionnaire</Typography>
							<IconButton
								size="large"
								onClick={() => {
									setOpenInfoModal(true);
									setInfoTitle('Content Ratings');
									setInfoDescription('The content ratings of the media');
								}}
							>
								<InfoIcon />
							</IconButton>
						</Stack>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container>
							{media.contentRatings &&
								media.contentRatings.map((rating, index) => (
									<Grid>
										{rating && rating.name === 'Slime' ? (
											<Grid item xs={12}>
												<SlimeRatingEditor
													rating={rating}
													setRating={(newRating: MediaContentRating | undefined) => {
														if (!newRating) {
															mediaLocal.contentRatings = mediaLocal.contentRatings.filter((_, i) => i !== index);
															setMediaLocal({ ...mediaLocal });
															return;
														}
														mediaLocal.contentRatings[index] = newRating;
														setMediaLocal({ ...mediaLocal });
													}}
												/>
											</Grid>
										) : (
											<Grid item xs={12}>
												{JSON.stringify(rating)}
											</Grid>
										)}
									</Grid>
								))}
						</Grid>
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ alignItems: 'center' }}>
						<Stack direction="row" spacing={2} alignItems={'center'}>
							<Typography variant="h5">Other Ratings</Typography>
							<IconButton
								size="large"
								onClick={() => {
									setOpenInfoModal(true);
									setInfoTitle('Content Ratings');
									setInfoDescription('The content ratings of the media');
								}}
							>
								<InfoIcon />
							</IconButton>
						</Stack>
					</AccordionSummary>
					<AccordionDetails>do later</AccordionDetails>
				</Accordion>
			</Stack>
		</Paper>
	);
};
