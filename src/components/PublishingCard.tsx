import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import {
	CardActionArea, Typography, CardMedia, CardContent, Card, Paper,
	Grid, TextField, Autocomplete, Switch, FormControlLabel,
	Button, Box, Modal, IconButton, Chip, Divider, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { SimplePool } from 'nostr-tools';
import * as React from 'react';

import { AddMarketplaceModal } from '../gosti-shared/components/AddMarketplaceModal';
import ImageUpload from '../gosti-shared/components/ImageUpload';
import StorePage, { StorePageProps } from '../gosti-shared/components/StorePage';
import {
	AdultContentTags, ContentTags, DefaultExecutables,
	DevelopmentStatuses, infoModalStyle,
	MediaTypes, RatingOptions, VideoSources
} from '../gosti-shared/constants';
import { useGostiApi } from '../gosti-shared/contexts/GostiApiContext';
import { useMarketplaceApi } from '../gosti-shared/contexts/MarketplaceApiContext';
import { RequestListingOrUpdateRequest, Marketplace } from '../gosti-shared/types/gosti/MarketplaceApiTypes';
import type { Media } from '../gosti-shared/types/gosti/Media';
import { getEventHash, NostrEvent } from '../gosti-shared/utils/nostr';
import MintingPage from './MintingPage';

export type PublishingCardProps = {
	media: Media;
	dataStoreId: string;
	onExecuteUpdate: (media: Media) => Promise<void>;
};

export default function PublishingCard(props: PublishingCardProps) {

	const { media, onExecuteUpdate } = props;

	const [showAdult, setShowAdult] = React.useState(!!((media.adultTags && media.adultTags.length > 0)));
	const [openStore, setOpenStore] = React.useState(false);

	const [adultTags, setAdultTags] = React.useState<string[]>(media.adultTags);
	const [mediaType, setMediaType] = React.useState<string>(media.mediaType);
	const [banner, setBanner] = React.useState<string>(media.banner);
	const [capsuleImage, setCapsuleImage] = React.useState<string>(media.capsuleImage);
	const [contentRating, setContentRating] = React.useState<string>(media.contentRating);
	const [description, setDescription] = React.useState<string>(media.description);
	const [creators, setCreators] = React.useState<string[]>(media.creators);
	const [executables, setExecutables] = React.useState<string>(JSON.stringify(media.executables, null, 2));
	const [icon, setIcon] = React.useState<string>(media.icon);
	const [longDescription, setLongDescription] = React.useState<string>(media.longDescription);
	const [, setPassword] = React.useState<string>(media.password);
	const [paymentAddress, setPaymentAddress] = React.useState<string>(media.paymentAddress);
	const [productId,] = React.useState<string>(media.productId);
	const [publisherDid, setPublisherDid] = React.useState<string>(media.publisherDid);
	const [screenshots, setScreenshots] = React.useState<string[]>(media.screenshots);
	const [shortDescription, setShortDescription] = React.useState<string>(media.shortDescription);
	const [status, setStatus] = React.useState<string>(media.status);
	const [tags, setTags] = React.useState<string[]>(media.tags);
	const [title, setTitle] = React.useState<string>(media.title);
	const [,] = React.useState<string>(media.torrents);
	const [trailer, setTrailer] = React.useState<string>(media.trailer);
	const [trailerSource, setTrailerSource] = React.useState<string>(media.trailerSource);
	const [version, setVersion] = React.useState<string>(media.version);
	const [publicStatus, setPublicStatus] = React.useState<boolean>(true);

	const [windowsFilePath, setWindowsFilePath] = React.useState<string>("");
	const [macFilePath, setMacFilePath] = React.useState<string>("");
	const [linuxFilePath, setLinuxFilePath] = React.useState<string>("");

	const handleClickOpenStore = () => {
		setOpenStore(true);
	};

	const { gostiConfig, signNostrMessage } = useGostiApi();

	const [marketplaces, setMarketplaces] = React.useState<Marketplace[]>([]);
	const [selectedMarketplaces, setSelectedMarketplaces] = React.useState<Marketplace[]>([]);
	const [addMarketplaceModalOpen, setAddMarketplaceModalOpen] = React.useState<boolean>(false);


	React.useEffect(() => {
		setMarketplaces(gostiConfig.marketplaces || []);
	}, [gostiConfig]);

	const { requestListingOrUpdate } = useMarketplaceApi();

	const onFilesUpdate = () => {
		const randPassword = new Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(x => (function (chars) { const umax = 2 ** 32; const r = new Uint32Array(1); const max = umax - (umax % chars.length); do { crypto.getRandomValues(r); } while (r[0] > max); return chars[r[0] % chars.length]; })(x)).join('');
		setPassword(randPassword);
		media.password = randPassword;
		// const sourcePaths = {
		// 	windows: windowsFilePath,
		// 	mac: macFilePath,
		// 	linux: linuxFilePath,
		// };
	};

	const onRequestListingOrUpdate = async () => {
		console.log("Requesting Listing/Update", selectedMarketplaces);
		selectedMarketplaces.map(async (marketplace: Marketplace) => {
			const result = await requestListingOrUpdate({ url: marketplace.url, media, setPublic: publicStatus } as RequestListingOrUpdateRequest);
			console.log("listing result", result);
		});
	};

	const [openInfoModal, setOpenInfoModal] = React.useState(false);
	const [infoTitle, setInfoTitle] = React.useState("");
	const [infoDescription, setInfoDescription] = React.useState("");

	const [openMintPage, setOpenMintPage] = React.useState(false);

	return (
		<Paper elevation={3} sx={{ m: 2, p: 2 }}>
			<Modal
				open={openInfoModal}
				onClose={() => { setOpenInfoModal(false); }}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={infoModalStyle}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						{infoTitle}
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						{infoDescription}
					</Typography>
				</Box>
			</Modal>
			<Grid container p={4} spacing={4} id="productlist">
				<Grid key={`${productId}preview`} item xs={6} sm={4} md={3} lg={2}>
					<Card sx={{ maxWidth: 345 }} onClick={handleClickOpenStore}>
						<CardActionArea>
							<CardMedia
								component="img"
								height="140"
								image={media.capsuleImage}
								alt={media.title}
							/>
							<CardContent>
								<Typography gutterBottom variant="h5">
									{media.title}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{media.shortDescription}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
				<Grid key={`${productId}preview desc`} item xs={6}>
					<IconButton size="small" onClick={() => {
						setInfoTitle("Preview");
						setInfoDescription("This is a preview of what your product will look like in the Gosti Marketplace. Click it to see a preview of your store page.");
						setOpenInfoModal(true);
					}}>
						<InfoIcon />
					</IconButton>
				</Grid>

				<Grid key={`${productId}productId`} item xs={12}>
					<TextField id="productIdTextField" sx={{ width: '100%' }} label="Product Id" disabled={true} variant="filled" value={productId}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Product Id");
								setInfoDescription("The unique identifier for your product. This cannot be changed.");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}mediaType`} item xs={12}>
					<Autocomplete
						id={`${productId}mediaType-combo-box`}
						defaultValue={mediaType}
						options={MediaTypes}
						sx={{ width: '100%' }}
						renderInput={(params) => <TextField {...params} label="Media Type" />}
						onChange={(event: any) => {
							setMediaType(event.target.innerText);
							media.mediaType = event.target.innerText;
						}} />
				</Grid>
				<Grid key={`${productId}title`} item xs={12}>
					<TextField id="titleTextField" sx={{ width: '100%' }} label="Title" variant="filled" value={title}
						onChange={(event: any) => {
							setTitle(event.target.value);
							media.title = event.target.value;
						}}
						inputProps={{
							endAdornment: <IconButton size="small"><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}shortDescription`} item xs={12}>
					<TextField id="shortDescriptionTextField" sx={{ width: '100%' }} label="Short Description" variant="filled" value={shortDescription}
						onChange={(event: any) => {
							setShortDescription(event.target.value);
							media.shortDescription = event.target.value;
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Short Description");
								setInfoDescription("Optional short description or tagline displayed under your capsule image.");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}description`} item xs={12}>
					<TextField id="descriptionTextField" sx={{ width: '100%' }} multiline maxRows={4} label="Description" variant="filled" value={description}
						onChange={(event: any) => {
							setDescription(event.target.value);
							media.description = event.target.value;
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Description");
								setInfoDescription("The main description of your game.");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}longDescription`} item xs={12}>
					<TextField id="longDescriptionTextField" sx={{ width: '100%' }} multiline maxRows={12} label="Long Description" variant="filled" value={longDescription}
						onChange={(event: any) => {
							setLongDescription(event.target.value);
							media.longDescription = event.target.value;
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Long Description");
								setInfoDescription("The details page shown below your product. Supports Markdown");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}banner`} item xs={12}>
					{ImageUpload({
						marketplaces,
						title: "Banner Image",
						setGui: (value) => {
							setBanner(value);
							media.banner = value;
						},
						initialImage: banner
					})}
					<TextField id="bannerTextField" sx={{ width: '100%' }} label="Banner Image" variant="filled" value={banner}
						onChange={(event: any) => {
							setBanner(event.target.value);
							media.banner = event.target.value;
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Banner Image");
								setInfoDescription("URI to your image (1200x700 recommended)");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}capsuleImage`} item xs={12}>
					{ImageUpload({
						marketplaces,
						title: "Capsule Image",
						setGui: (value) => {
							setCapsuleImage(value);
							media.capsuleImage = value;
						},
						initialImage: capsuleImage
					})}
					<TextField id="capsuleImageTextField" sx={{ width: '100%' }} label="Capsule Image" variant="filled" value={capsuleImage}
						onChange={(event: any) => {
							setCapsuleImage(event.target.value);
							media.capsuleImage = event.target.value;
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Capsule Image");
								setInfoDescription("URI to image (512x512 recommended)");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}icon`} item xs={12}>
					{ImageUpload({
						marketplaces,
						title: "Icon",
						setGui: (value) => {
							setIcon(value);
							media.icon = value;
						},
						initialImage: icon
					})}
					<TextField id="iconTextField" sx={{ width: '100%' }} label="Icon" variant="filled" value={icon}
						onChange={(event: any) => {
							setIcon(event.target.value);
							media.icon = event.target.value;
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Icon");
								setInfoDescription("URI to an icon image (64x64 recommended)");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}screenshots`} item xs={12}>
					{ImageUpload({
						marketplaces,
						title: "Add Screenshot",
						setGui: (value) => {
							screenshots.push(value);
							setScreenshots([...screenshots]);
						},
						initialImage: screenshots[0]
					})}
					<Autocomplete
						multiple
						id={`${productId}screenshots-outlined`}
						options={['']}
						freeSolo
						getOptionLabel={(option: any) => option}
						defaultValue={screenshots}
						filterSelectedOptions
						onChange={(event: any, values: string[]) => {
							setScreenshots(values);
							media.screenshots = values;
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Screenshots"
								placeholder="+"
							/>
						)}
						renderTags={(value: string[], getTagProps) =>
							value.map((option: string, index: number) => (
								<Chip
									label={option}
									{...getTagProps({ index })}
									onClick={() => {
										window.open(option);
									}}
								/>
							))
						}
					/>
				</Grid>
				<Grid key={`${productId}trailerSource`} item xs={12}>
					<Autocomplete
						id={`${productId}trailerSource-combo-box`}
						defaultValue={trailerSource}
						options={VideoSources}
						sx={{ width: '100%' }}
						renderInput={(params) => <TextField {...params} label="Trailer Source" />}
						onChange={(event: any) => {
							setTrailerSource(event.target.innerText);
							media.trailerSource = event.target.innerText;
						}}
					/>
				</Grid>
				<Grid key={`${productId}trailer`} item xs={12}>
					<TextField id="trailerTextField" sx={{ width: '100%' }} label="Trailer" variant="filled" value={trailer}
						onChange={(event: any) => {
							setTrailer(event.target.value);
							media.trailer = event.target.value;
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Trailer");
								setInfoDescription("The identifier for your video, https://www.youtube.com/watch?v=[DKF2-zCNJ0A] 👈 this value");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}contentRating`} item xs={12}>
					<Autocomplete
						id={`${productId}contentRating-combo-box`}
						defaultValue={contentRating}
						disableClearable={true}
						options={RatingOptions}
						sx={{ width: '100%' }}
						renderInput={(params) => <TextField {...params} label="Content Rating" />}
						onChange={(event: any) => {
							setContentRating(event.target.innerText);
							media.contentRating = event.target.innerText;
						}}
					/>
				</Grid>
				<Grid key={`${productId}tags`} item xs={11}>
					<Autocomplete
						multiple
						id={`${productId}tags-outlined`}
						options={ContentTags}
						freeSolo
						getOptionLabel={(option: any) => option}
						defaultValue={tags}
						onChange={(event: any, values: string[]) => {
							setTags(values);
							media.tags = values;
						}}
						filterSelectedOptions
						renderInput={(params) => (
							<TextField
								{...params}
								label="Content Tags"
								placeholder="+"
							/>
						)}
					/>
				</Grid>

				<Grid key={`${productId}showAdult`} item xs={12}>
					<FormControlLabel control={<Switch checked={showAdult} onChange={() => setShowAdult(!showAdult)} />} label="Contains Pornographic Content" />
				</Grid>

				{showAdult && <>
					<Grid key={`${productId}adult content tags`} item xs={11}>
						<Autocomplete
							multiple
							id={`${productId}adulttags-outlined`}
							options={AdultContentTags}
							freeSolo
							getOptionLabel={(option: any) => option}
							defaultValue={adultTags}
							onChange={(event: any, values: string[]) => {
								setAdultTags(values);
								media.adultTags = values;
							}}
							filterSelectedOptions
							renderInput={(params) => (
								<TextField
									{...params}
									label="Adult Content Tags"
									placeholder="+"
								/>
							)}
						/>
					</Grid>
					<Grid key={`${productId}adult tags desc`} item xs={1}>
						<IconButton size="small"
							onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Adult Content Tags");
								setInfoDescription("Select tags that apply to the sexual content included. Or create your own.");
							}}>
							<InfoIcon />
						</IconButton>
					</Grid>
				</>
				}
				<Grid key={`${productId}creators`} item xs={12}>
					<Autocomplete
						multiple
						id={`${productId}creators-outlined`}
						options={[]}
						freeSolo
						getOptionLabel={(option: any) => option}
						defaultValue={creators}
						onChange={(event: any, values: string[]) => {
							setCreators(values);
							media.creators = values;
						}}
						filterSelectedOptions
						renderInput={(params) => (
							<TextField
								{...params}
								label="Creator DIDs"
								placeholder="+"
							/>
						)}
					/>
				</Grid>
				<Grid key={`${productId}publisherDid`} item xs={12}>
					<TextField id="publisherDidTextField" sx={{ width: '100%' }} label="Publisher DID" variant="filled" value={publisherDid}
						onChange={(event: any) => {
							setPublisherDid(event.target.value);
							media.publisherDid = event.target.value;
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Publisher DID");
								setInfoDescription("The DID (Distributed Identity) Profile of the publisher. DID should not be changed after first mint.");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}paymentAddress`} item xs={12}>
					<TextField id="paymentAddressTextField" sx={{ width: '100%' }} label="Payment Address" variant="filled" value={paymentAddress}
						onChange={(event: any) => {
							setPaymentAddress(event.target.value);
							media.paymentAddress = event.target.value;
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Payment Address");
								setInfoDescription("An XCH address where people can donate to support your work. This also works as your default royalty address.");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}version`} item xs={12}>
					<TextField id="versionTextField" sx={{ width: '100%' }} label="Version" variant="filled" value={version}
						onChange={(event: any) => {
							setVersion(event.target.value);
							media.version = event.target.value;
						}}
						inputProps={{
							inputMode: 'numeric',
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Version");
								setInfoDescription("Current version number. Ideally using Semantic Versioning. But other numeric formats should work.");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}status`} item xs={12}>
					<Autocomplete
						id={`${productId}status-combo-box`}
						defaultValue={status}
						options={DevelopmentStatuses}
						sx={{ width: '100%' }}
						onChange={(event: any) => {
							setStatus(event.target.innerText);
							media.status = event.target.innerText;
						}}
						renderInput={(params) => <TextField {...params} label="Development Status" />}
					/>
				</Grid>

				<Grid key={`${productId}Files info`} item xs={12}>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Local file paths are not stored, they are only used to generate torrent files locally.
					</Typography>
				</Grid>
				<Grid key={`${productId}windows files`} item xs={12}>
					<TextField id="windowsTextField" sx={{ width: '100%' }} label="Windows File Path" variant="filled" value={windowsFilePath}
						onChange={(event: any) => {
							setWindowsFilePath(event.target.value);
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("File Path");
								setInfoDescription("Paste the full path to the (un-zipped) root of your projects files that runs on windows.");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}mac files`} item xs={12}>
					<TextField id="windowsTextField" sx={{ width: '100%' }} label="Mac File Path" variant="filled" value={macFilePath}
						onChange={(event: any) => {
							setMacFilePath(event.target.value);
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("File Path");
								setInfoDescription("Paste the full path to the (un-zipped) root of your projects files that runs on mac.");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}linux files`} item xs={12}>
					<TextField id="windowsTextField" sx={{ width: '100%' }} label="Linux File Path" variant="filled" value={linuxFilePath}
						onChange={(event: any) => {
							setLinuxFilePath(event.target.value);
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("File Path");
								setInfoDescription("Paste the full path to the (un-zipped) root of your projects files that runs on linux.");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}Update Files`} item xs={11}>
					<Button sx={{ width: '100%' }} variant="contained" onClick={onFilesUpdate}>
						Update Product Torrent Files
					</Button>
				</Grid>
				<Grid key={`${productId}Update Files desc`} item xs={1}>
					<IconButton size="small"
						onClick={() => {
							setOpenInfoModal(true);
							setInfoTitle("Update Torrent Files");
							setInfoDescription("This button generates your torrent files to be included in an update. Don't press it unless you intend push updated project files to everyone who owns your product.");
						}}>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId}executables`} item xs={12}>
					<TextField id="executablesTextField" sx={{ width: '100%' }} multiline maxRows={6} label="Executables" variant="filled" value={executables} defaultValue={DefaultExecutables}
						onChange={(event: any) => {
							setExecutables(event.target.value);
							media.executables = JSON.parse(event.target.value);
						}}
						inputProps={{
							endAdornment: <IconButton size="small" onClick={() => {
								setOpenInfoModal(true);
								setInfoTitle("Executables");
								setInfoDescription("Specifies the relative path to your executables from your project root. If you do not support a given operating system, leave it empty, don't delete it.");
							}}><InfoIcon /></IconButton>
						}} />
				</Grid>
				<Grid key={`${productId}Update`} item xs={5}>
					<Button sx={{ width: '100%' }} variant="contained" onClick={async () => {
						const nostrPool = new SimplePool();

						const foundEvent = await nostrPool.get(gostiConfig.nostrRelays, { ids: [media.nostrEventId] });
						console.log("query for event", foundEvent);
						console.log("onExecuteUpdate", media);
						if (!media.nostrEventId || foundEvent) {
							console.log("Creating Nostr Thread");
							if (!gostiConfig.identity.currentNostrPublicKey) {
								alert("No public key found. Please set up your profile.");
								return;
							}

							const pk = gostiConfig.identity.currentNostrPublicKey;

							if (!pk) {
								console.log("No public key found");
								alert("No public key found. Please set up your profile.");
								return;
							}

							const createdAt = Math.floor(Date.now() / 1000);

							const event: NostrEvent = {
								content: media.productId,
								kind: 1,
								tags: [
									["i", `chia:${media.publisherDid}`, gostiConfig.identity.proof],
								],
								created_at: createdAt,
								pubkey: pk,
								id: '',
								sig: ''
							};
							event.id = getEventHash(event);
							const signResp = await signNostrMessage({ message: event.id });
							console.log("signResp", signResp);
							event.sig = signResp.signature;
							media.nostrEventId = event.id;

							await Promise.any(nostrPool.publish(gostiConfig.nostrRelays, event));
						}
						onExecuteUpdate(media);
					}}>
						Commit Update
					</Button>
				</Grid>
				<Grid key={`${productId}update desc`} item xs={1}>
					<IconButton size="small" onClick={() => {
						setOpenInfoModal(true);
						setInfoTitle("Commit Update");
						setInfoDescription("Pressing this button will push this update to your dataStore. Please review all fields above before committing, this will require an on chain transaction for every update and will use the transaction fee at the top of the page.");
					}}>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId}Mint`} item xs={5}>
					<Button sx={{ width: '100%' }} variant="contained" onClick={() => {
						setOpenMintPage(true);
					}}>
						Mint Copies
					</Button>
				</Grid>
				<Grid key={`${productId}mint desc`} item xs={1}>
					<IconButton size="small" onClick={() => {
						setOpenInfoModal(true);
						setInfoTitle("Mint Copies");
						setInfoDescription("Mint copies of your product for sale or distribution.");
					}}>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Divider />
				<Grid key={`${productId}marketplaces`} item xs={10}>
					<Autocomplete
						multiple
						id={`${productId}marketplaces-outlined`}
						options={marketplaces.map((marketplace) => marketplace.displayName)}
						onChange={
							(event: any, values: string[]) => {
								const selected: Marketplace[] = [];
								marketplaces.forEach((marketplace) => {
									if (values.includes(marketplace.displayName))
										selected.push(marketplace);
								});

								setSelectedMarketplaces(selected);
							}
						}
						renderTags={(tagValue, getTagProps) =>
							tagValue.map((option, index) => (
								<Chip
									label={option}
									{...getTagProps({ index })}
								/>
							))
						}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Select Marketplaces"
								placeholder="Marketplaces"
							/>
						)}
					/>

				</Grid>
				<Grid key={`${productId}marketplaces add`} item xs={1}>
					<IconButton size="large" aria-label="Add" onClick={() => {
						setAddMarketplaceModalOpen(true);
					}}>
						<AddIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId}marketplaces desc`} item xs={1}>
					<IconButton size="small" onClick={() => {
						setOpenInfoModal(true);
						setInfoTitle("Marketplaces");
						setInfoDescription("Urls of all marketplaces you want to request listing on, or push updates too.");
					}}>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId}Request Listing / Update Marketplaces`} item xs={8}>
					<Button sx={{ width: '100%' }} variant="contained" onClick={onRequestListingOrUpdate}>
						Request Listing / Update Marketplaces
					</Button>
				</Grid>
				<Grid key={`${productId}Set Public`} item xs={3}>
					<ToggleButtonGroup
						color="primary"
						value={publicStatus}
						exclusive
						onChange={(event: any, value: boolean) => {
							if (value !== null)
								setPublicStatus(value);
						}}
						aria-label="Platform"
					>
						<ToggleButton value={true}>Set Public</ToggleButton>
						<ToggleButton value={false}>Set Private</ToggleButton>
					</ToggleButtonGroup>
				</Grid>
				<Grid key={`${productId}Request Listing / Update Marketplaces desc`} item xs={1}>
					<IconButton size="small"
						onClick={() => {
							setOpenInfoModal(true);
							setInfoTitle("Request Listing / Update Marketplaces");
							setInfoDescription("Requests listing on all marketplaces you have selected above. If you have already listed on a marketplace, this will push updates to that marketplace. During the Beta, you can freely set your product to public or private. Once the beta is over, there will be a verification process before you can set your product as public.");
						}}>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId} Divider`} item xs={12}>
					<Divider />
				</Grid>
				{/* <Grid key={"dataStore create"} item xs={4}>
					<Button variant="contained" sx={{ p: 2 }} onClick={async () => {
						await setMediaPublic({ productId: media.productId, isPublic: true } as SetMediaPublicParams);
					}}>
						Set Public
					</Button>
				</Grid> */}
			</Grid>
			{MintingPage({ open: openMintPage, setOpen: setOpenMintPage, marketplaces, ...props })}
			{StorePage({ media, open: openStore, setOpen: setOpenStore } as StorePageProps)}
			{AddMarketplaceModal(addMarketplaceModalOpen, () => { setAddMarketplaceModalOpen(false); })}
		</Paper >
	);
};

