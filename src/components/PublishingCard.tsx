import InfoIcon from '@mui/icons-material/Info';
import {
	CardActionArea, Typography, CardMedia, CardContent, Card, Paper,
	Grid, TextField, Autocomplete, Link, Switch, FormControlLabel,
	Button, Box, Modal, IconButton
} from '@mui/material';
import * as React from 'react';

import {
	AdultContentTags, ContentTags, DefaultExecutables,
	DevelopmentStatuses, infoModalStyle, KnownMarketplaces,
	MediaTypes, RatingOptions, VideoSources
} from '../spriggan-shared/constants';
import { useMarketplaceApi } from '../spriggan-shared/contexts/MarketplaceApiContext';
import { GenerateTorrentsRequest, GenerateTorrentsResponse, useSprigganRpc } from '../spriggan-shared/contexts/SprigganRpcContext';
import { RequestListingOrUpdateRequest } from '../spriggan-shared/types/spriggan/MarketplaceApiTypes';
import type { Media } from '../spriggan-shared/types/spriggan/Media';
import MintingPage from './MintingPage';
import StorePage, { StorePageProps } from './StorePage';


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
	const [creator, setCreator] = React.useState<string>(media.creator);
	const [discord, setDiscord] = React.useState<string>(media.discord);
	const [executables, setExecutables] = React.useState<string>(JSON.stringify(media.executables, null, 2));
	const [facebook, setFacebook] = React.useState<string>(media.facebook);
	const [icon, setIcon] = React.useState<string>(media.icon);
	const [instagram, setInstagram] = React.useState<string>(media.instagram);
	const [longDescription, setLongDescription] = React.useState<string>(media.longDescription);
	const [, setPassword] = React.useState<string>(media.password);
	const [paymentAddress, setPaymentAddress] = React.useState<string>(media.paymentAddress);
	const [productId,] = React.useState<string>(media.productId);
	const [publisher, setPublisher] = React.useState<string>(media.publisher);
	const [publisherDid, setPublisherDid] = React.useState<string>(media.publisherDid);
	const [screenshots, setScreenshots] = React.useState<string[]>(media.screenshots);
	const [shortDescription, setShortDescription] = React.useState<string>(media.shortDescription);
	const [status, setStatus] = React.useState<string>(media.status);
	const [tags, setTags] = React.useState<string[]>(media.tags);
	const [title, setTitle] = React.useState<string>(media.title);
	const [, setTorrents] = React.useState<string>(media.torrents);
	const [trailer, setTrailer] = React.useState<string>(media.trailer);
	const [trailerSource, setTrailerSource] = React.useState<string>(media.trailerSource);
	const [twitter, setTwitter] = React.useState<string>(media.twitter);
	const [version, setVersion] = React.useState<string>(media.version);
	const [website, setWebsite] = React.useState<string>(media.website);

	const [windowsFilePath, setWindowsFilePath] = React.useState<string>("");
	const [macFilePath, setMacFilePath] = React.useState<string>("");
	const [linuxFilePath, setLinuxFilePath] = React.useState<string>("");

	const [marketplaces, setMarketplaces] = React.useState<string[]>([]);

	const handleClickOpenStore = () => {
		setOpenStore(true);
	};

	const {
		generateTorrents,
		sprigganRpcResult,
	} = useSprigganRpc();

	const { requestListingOrUpdate } = useMarketplaceApi();

	const onFilesUpdate = () => {
		const randPassword = new Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(x => (function (chars) { const umax = 2 ** 32; const r = new Uint32Array(1); const max = umax - (umax % chars.length); do { crypto.getRandomValues(r); } while (r[0] > max); return chars[r[0] % chars.length]; })(x)).join('');
		setPassword(randPassword);
		media.password = randPassword;
		const sourcePaths = {
			windows: windowsFilePath,
			mac: macFilePath,
			linux: linuxFilePath,
		};
		generateTorrents({ sourcePaths, media } as GenerateTorrentsRequest);
	};

	const onRequestListingOrUpdate = async () => {
		console.log("Requesting Listing/Update", marketplaces);
		marketplaces.map(async (marketplace: string) => {
			const result = await requestListingOrUpdate({ url: marketplace, media } as RequestListingOrUpdateRequest);
			console.log("listing result", result);
		});
	};

	React.useEffect(() => {
		if (sprigganRpcResult && sprigganRpcResult.method === "generateTorrents") {
			console.log("generateTorrents", sprigganRpcResult.result);
			const response = sprigganRpcResult.result as GenerateTorrentsResponse;
			setTorrents(response.torrents);
			media.torrents = response.torrents;
		}
	}, [sprigganRpcResult, media]);

	const [openPreviewInfo, setOpenPreviewInfo] = React.useState(false);
	const [openProductIdInfo, setOpenProductIdInfo] = React.useState(false);
	const [openTitleInfo, setOpenTitleInfo] = React.useState(false);
	const [openShortDescriptionInfo, setOpenShortDescriptionInfo] = React.useState(false);
	const [openDescriptionInfo, setOpenDescriptionInfo] = React.useState(false);
	const [openLongDescriptionInfo, setOpenLongDescriptionInfo] = React.useState(false);
	const [openBannerInfo, setOpenBannerInfo] = React.useState(false);
	const [openCapsuleImageInfo, setOpenCapsuleImageInfo] = React.useState(false);
	const [openIconInfo, setOpenIconInfo] = React.useState(false);
	const [openScreenshotsInfo, setOpenScreenshotsInfo] = React.useState(false);
	const [openTrailerSourceInfo, setOpenTrailerSourceInfo] = React.useState(false);
	const [openTrailerInfo, setOpenTrailerInfo] = React.useState(false);
	const [openContentRatingInfo, setOpenContentRatingInfo] = React.useState(false);
	const [openTagsInfo, setOpenTagsInfo] = React.useState(false);
	const [openAdultInfo, setOpenAdultInfo] = React.useState(false);
	const [openCreatorInfo, setOpenCreatorInfo] = React.useState(false);
	const [openPublisherInfo, setOpenPublisherInfo] = React.useState(false);
	const [openPublisherDidInfo, setOpenPublisherDidInfo] = React.useState(false);
	const [openPaymentAddressInfo, setOpenPaymentAddressInfo] = React.useState(false);
	const [openTwitterInfo, setOpenTwitterInfo] = React.useState(false);
	const [openWebsiteInfo, setOpenWebsiteInfo] = React.useState(false);
	const [openDiscordInfo, setOpenDiscordInfo] = React.useState(false);
	const [openInstagramInfo, setOpenInstagramInfo] = React.useState(false);
	const [openFacebookInfo, setOpenFacebookInfo] = React.useState(false);
	const [openVersionInfo, setOpenVersionInfo] = React.useState(false);
	const [openStatusInfo, setOpenStatusInfo] = React.useState(false);
	const [openFilesInfo, setOpenFilesInfo] = React.useState(false);
	const [openTorrentsInfo, setOpenTorrentsInfo] = React.useState(false);
	const [openExecutablesInfo, setOpenExecutablesInfo] = React.useState(false);
	const [openUpdateInfo, setOpenUpdateInfo] = React.useState(false);
	const [openMintInfo, setOpenMintInfo] = React.useState(false);
	const [openRequestListingOrUpdateInfo, setOpenRequestListingOrUpdateInfo] = React.useState(false);
	const [openMintPage, setOpenMintPage] = React.useState(false);

	return (
		<Paper elevation={3} sx={{ m: 2, p: 2 }}>
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
					<IconButton size="small" aria-label="info" onClick={() => { setOpenPreviewInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openPreviewInfo}
						onClose={() => { setOpenPreviewInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Preview
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								This is a preview of what your product will look like in the Spriggan Marketplace. Click it to see a preview of your store page.
							</Typography>
						</Box>
					</Modal>
				</Grid>

				<Grid key={`${productId}productId`} item xs={11}>
					<TextField id="productIdTextField" sx={{ width: '100%' }} label="Product Id" disabled={true} variant="filled" value={productId} />
				</Grid>
				<Grid key={`${productId}productId desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenProductIdInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openProductIdInfo}
						onClose={() => { setOpenProductIdInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Product ID
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}mediaType`} item xs={11}>
					<Autocomplete
						id={`${productId}mediaType-combo-box`}
						defaultValue={mediaType}
						options={MediaTypes}
						sx={{ width: '100%' }}
						renderInput={(params) => <TextField {...params} label="Media Type" />}
						onChange={(event: any) => {
							setMediaType(event.target.innerText);
							media.mediaType = event.target.innerText;
						}}
					/>
				</Grid>
				<Grid key={`${productId}title`} item xs={11}>
					<TextField id="titleTextField" sx={{ width: '100%' }} label="Title" variant="filled" value={title} onChange={(event: any) => {
						setTitle(event.target.value);
						media.title = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}title desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenTitleInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openTitleInfo}
						onClose={() => { setOpenTitleInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Title
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								The name of your product.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}shortDescription`} item xs={11}>
					<TextField id="shortDescriptionTextField" sx={{ width: '100%' }} label="Short Description" variant="filled" value={shortDescription} onChange={(event: any) => {
						setShortDescription(event.target.value);
						media.shortDescription = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}shortDescription desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenShortDescriptionInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openShortDescriptionInfo}
						onClose={() => { setOpenShortDescriptionInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Short Description
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Optional short description or tagline displayed under your capsule image.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}description`} item xs={11}>
					<TextField id="descriptionTextField" sx={{ width: '100%' }} multiline maxRows={4} label="Description" variant="filled" value={description} onChange={(event: any) => {
						setDescription(event.target.value);
						media.description = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}description desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenDescriptionInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openDescriptionInfo}
						onClose={() => { setOpenDescriptionInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Description
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								The main description of your game.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}longDescription`} item xs={11}>
					<TextField id="longDescriptionTextField" sx={{ width: '100%' }} multiline maxRows={12} label="Long Description" variant="filled" value={longDescription} onChange={(event: any) => {
						setLongDescription(event.target.value);
						media.longDescription = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}longDescription desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenLongDescriptionInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openLongDescriptionInfo}
						onClose={() => { setOpenLongDescriptionInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								longDescription
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								The details page shown below your product. Supports <Link href="https://www.markdownguide.org/cheat-sheet/">Markdown</Link>
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}banner`} item xs={11}>
					<TextField id="bannerTextField" sx={{ width: '100%' }} label="Banner Image" variant="filled" value={banner} onChange={(event: any) => {
						setBanner(event.target.value);
						media.banner = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}banner desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenBannerInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openBannerInfo}
						onClose={() => { setOpenBannerInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								banner
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								URI to your image (1200x700 recommended)
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}capsuleImage`} item xs={11}>
					<TextField id="capsuleImageTextField" sx={{ width: '100%' }} label="Capsule Image" variant="filled" value={capsuleImage} onChange={(event: any) => {
						setCapsuleImage(event.target.value);
						media.capsuleImage = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}capsuleImage desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenCapsuleImageInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openCapsuleImageInfo}
						onClose={() => { setOpenCapsuleImageInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								capsuleImage
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								URI to image (512x512 recommended)
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}icon`} item xs={11}>
					<TextField id="iconTextField" sx={{ width: '100%' }} label="Icon" variant="filled" value={icon} onChange={(event: any) => {
						setIcon(event.target.value);
						media.icon = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}icon desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenIconInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openIconInfo}
						onClose={() => { setOpenIconInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								icon
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								URI to an image (64x64 recommended)
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}screenshots`} item xs={11}>
					<Autocomplete
						multiple
						id={`${productId}screenshots-outlined`}
						options={screenshots}
						freeSolo
						getOptionLabel={(option: any) => option}
						defaultValue={[]}
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
					/>
				</Grid>
				<Grid key={`${productId}screenshots desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenScreenshotsInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openScreenshotsInfo}
						onClose={() => { setOpenScreenshotsInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								screenshots
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								List of URIs to images (1920x1080 recommended)
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}trailerSource`} item xs={11}>
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
				<Grid key={`${productId}trailerSource desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenTrailerSourceInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openTrailerSourceInfo}
						onClose={() => { setOpenTrailerSourceInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								trailerSource
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Where your video trailer is hosted
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}trailer`} item xs={11}>
					<TextField id="trailerTextField" sx={{ width: '100%' }} label="Trailer" variant="filled" value={trailer} onChange={(event: any) => {
						setTrailer(event.target.value);
						media.trailer = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}trailer desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenTrailerInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openTrailerInfo}
						onClose={() => { setOpenTrailerInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								trailer
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								The identifier for your video, https://www.youtube.com/watch?v=3_LIsH1VD7w 👈 this value
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}contentRating`} item xs={11}>
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
				<Grid key={`${productId}contentRating desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenContentRatingInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openContentRatingInfo}
						onClose={() => { setOpenContentRatingInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								contentRating
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Self reported content rating based on <Link href="https://www.esrb.org/ratings-guide/">ESRB Rating</Link>
							</Typography>
						</Box>
					</Modal>
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
				<Grid key={`${productId}tags desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenTagsInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openTagsInfo}
						onClose={() => { setOpenTagsInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Content Tags
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Select tags that apply to the content included. Or create your own.
							</Typography>
						</Box>
					</Modal>
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
						<IconButton size="small" aria-label="info" onClick={() => { setOpenAdultInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openAdultInfo}
							onClose={() => { setOpenAdultInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Adult Content Tags
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									Select tags that apply to the sexual content included. Or create your own.
								</Typography>
							</Box>
						</Modal>
					</Grid>
				</>
				}
				<Grid key={`${productId}creator`} item xs={11}>
					<TextField id="creatorTextField" sx={{ width: '100%' }} label="Developer/Creator" variant="filled" value={creator} onChange={(event: any) => {
						setCreator(event.target.value);
						media.creator = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}creator desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenCreatorInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openCreatorInfo}
						onClose={() => { setOpenCreatorInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								creator
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								The entity that created/developed the product
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}publisher`} item xs={11}>
					<TextField id="publisherTextField" sx={{ width: '100%' }} label="Publisher" variant="filled" value={publisher} onChange={(event: any) => {
						setPublisher(event.target.value);
						media.publisher = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}publisher desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenPublisherInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openPublisherInfo}
						onClose={() => { setOpenPublisherInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								publisher
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								The entity who is publishing the product. (Can be same as creator)
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}publisherDid`} item xs={11}>
					<TextField id="publisherDidTextField" sx={{ width: '100%' }} label="Publisher DID" variant="filled" value={publisherDid} onChange={(event: any) => {
						setPublisherDid(event.target.value);
						media.publisherDid = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}publisherDid desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenPublisherDidInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openPublisherDidInfo}
						onClose={() => { setOpenPublisherDidInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								publisherDid
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								The DID (Distributed Identity) of the publisher. DID cannot be changed after first mint.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}paymentAddress`} item xs={11}>
					<TextField id="paymentAddressTextField" sx={{ width: '100%' }} label="Payment Address" variant="filled" value={paymentAddress} onChange={(event: any) => {
						setPaymentAddress(event.target.value);
						media.paymentAddress = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}paymentAddress desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenPaymentAddressInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openPaymentAddressInfo}
						onClose={() => { setOpenPaymentAddressInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								paymentAddress
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								An XCH address where people can donate to support your work. This also works as your default royalty address.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}twitter`} item xs={11}>
					<TextField id="twitterTextField" sx={{ width: '100%' }} label="Twitter" variant="filled" value={twitter} onChange={(event: any) => {
						setTwitter(event.target.value);
						media.twitter = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}twitter desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenTwitterInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openTwitterInfo}
						onClose={() => { setOpenTwitterInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								twitter
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								ex. @username
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}website`} item xs={11}>
					<TextField id="websiteTextField" sx={{ width: '100%' }} label="Website" variant="filled" value={website} onChange={(event: any) => {
						setWebsite(event.target.value);
						media.website = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}website desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenWebsiteInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openWebsiteInfo}
						onClose={() => { setOpenWebsiteInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								website
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Your Products Website.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}discord`} item xs={11}>
					<TextField id="discordTextField" sx={{ width: '100%' }} label="Discord" variant="filled" value={discord} onChange={(event: any) => {
						setDiscord(event.target.value);
						media.discord = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}discord desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenDiscordInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openDiscordInfo}
						onClose={() => { setOpenDiscordInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								discord
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								An invite link to your discord server
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}instagram`} item xs={11}>
					<TextField id="instagramTextField" sx={{ width: '100%' }} label="Instagram" variant="filled" value={instagram} onChange={(event: any) => {
						setInstagram(event.target.value);
						media.instagram = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}instagram desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenInstagramInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openInstagramInfo}
						onClose={() => { setOpenInstagramInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								instagram
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								ex. @username
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}facebook`} item xs={11}>
					<TextField id="facebookTextField" sx={{ width: '100%' }} label="Facebook" variant="filled" value={facebook} onChange={(event: any) => {
						setFacebook(event.target.value);
						media.facebook = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}facebook desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenFacebookInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openFacebookInfo}
						onClose={() => { setOpenFacebookInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								facebook
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Facebook link
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}version`} item xs={11}>
					<TextField id="versionTextField" inputProps={{ inputMode: 'numeric' }} sx={{ width: '100%' }} label="Version" variant="filled" value={version} onChange={(event: any) => {
						setVersion(event.target.value);
						media.version = event.target.value;
					}} />
				</Grid>
				<Grid key={`${productId}version desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenVersionInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openVersionInfo}
						onClose={() => { setOpenVersionInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								version
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Current version number. Ideally using <Link href="https://semver.org/">Semantic Versioning</Link>. But other numeric formats should work.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}status`} item xs={11}>
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
				<Grid key={`${productId}status desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenStatusInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openStatusInfo}
						onClose={() => { setOpenStatusInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								status
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Current Development Status
							</Typography>
						</Box>
					</Modal>
				</Grid>

				<Grid key={`${productId}Files info`} item xs={12}>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Local file paths are not stored, they are only used to generate torrent files locally.
					</Typography>
				</Grid>
				<Grid key={`${productId}windows files`} item xs={11}>
					<TextField id="windowsTextField" sx={{ width: '100%' }} label="Windows File Path" variant="filled" value={windowsFilePath} onChange={(event: any) => {
						setWindowsFilePath(event.target.value);
					}} />
				</Grid>
				<Grid key={`${productId}windows files desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenFilesInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openFilesInfo}
						onClose={() => { setOpenFilesInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Files
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Paste the full path to the (un-zipped) root of your projects files.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}mac files`} item xs={11}>
					<TextField id="windowsTextField" sx={{ width: '100%' }} label="Mac File Path" variant="filled" value={macFilePath} onChange={(event: any) => {
						setMacFilePath(event.target.value);
					}} />
				</Grid>
				<Grid key={`${productId}mac files desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenFilesInfo(true); }}>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId}linux files`} item xs={11}>
					<TextField id="windowsTextField" sx={{ width: '100%' }} label="Linux File Path" variant="filled" value={linuxFilePath} onChange={(event: any) => {
						setLinuxFilePath(event.target.value);
					}} />
				</Grid>
				<Grid key={`${productId}linux files desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenFilesInfo(true); }}>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId}Update Files`} item xs={11}>
					<Button sx={{ width: '100%' }} variant="contained" onClick={onFilesUpdate}>
						Update Product Torrent Files
					</Button>
				</Grid>
				<Grid key={`${productId}Update Files desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenTorrentsInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openTorrentsInfo}
						onClose={() => { setOpenTorrentsInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Updating Torrents
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								This button generates your torrent files to be included in an update. Don't press it unless you intend push updated project files to everyone who owns your product.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}executables`} item xs={11}>
					<TextField id="executablesTextField" sx={{ width: '100%' }} multiline maxRows={6} label="Executables" variant="filled" value={executables} defaultValue={DefaultExecutables} onChange={(event: any) => {
						setExecutables(event.target.value);
						media.executables = JSON.parse(event.target.value);
					}} />
				</Grid>
				<Grid key={`${productId}executables desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenExecutablesInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openExecutablesInfo}
						onClose={() => { setOpenExecutablesInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Executables
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Specifies the relative path to your executables from your project root. If you do not support a given operating system, leave it empty, don't delete it.
							</Typography>
						</Box>
					</Modal>
					<Typography variant="body2"></Typography>
				</Grid>
				<Grid key={`${productId}Update`} item xs={5}>
					<Button sx={{ width: '100%' }} variant="contained" onClick={() => {
						onExecuteUpdate(media);
					}}>
						Commit Update
					</Button>
				</Grid>
				<Grid key={`${productId}update desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenUpdateInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openUpdateInfo}
						onClose={() => { setOpenUpdateInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Commit Update
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Pressing this button will push this update to your dataStore. Please review all fields above before committing, this will require an on chain transaction for every update and will use the transaction fee at the top of the page.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}Mint`} item xs={5}>
					<Button sx={{ width: '100%' }} variant="contained" onClick={() => { setOpenMintPage(true); }}>
						Mint Copies
					</Button>
				</Grid>
				<Grid key={`${productId}mint desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenMintInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openMintInfo}
						onClose={() => { setOpenMintInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Mint Copies
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Mint copies of your product for sale or distribution.
							</Typography>
						</Box>
					</Modal>
				</Grid>

				<Grid key={`${productId}marketplaces`} item xs={11}>
					<Autocomplete
						multiple
						id={`${productId}marketplaces-outlined`}
						options={KnownMarketplaces}
						freeSolo
						getOptionLabel={(option: any) => option}
						defaultValue={[]}
						filterSelectedOptions
						onChange={(event: any, values: string[]) => {
							setMarketplaces(values);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Marketplaces"
								placeholder="+"
							/>
						)}
					/>
				</Grid>
				<Grid key={`${productId}marketplaces desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenStatusInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openStatusInfo}
						onClose={() => { setOpenStatusInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Marketplaces
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Urls of all marketplaces you want to request listing on, or push updates too.
							</Typography>
						</Box>
					</Modal>
				</Grid>
				<Grid key={`${productId}Request Listing / Update Marketplaces`} item xs={11}>
					<Button sx={{ width: '100%' }} variant="contained" onClick={onRequestListingOrUpdate}>
						Request Listing / Update Marketplaces
					</Button>
				</Grid>
				<Grid key={`${productId}Request Listing / Update Marketplaces desc`} item xs={1}>
					<IconButton size="small" aria-label="info" onClick={() => { setOpenRequestListingOrUpdateInfo(true); }}>
						<InfoIcon />
					</IconButton>
					<Modal
						open={openRequestListingOrUpdateInfo}
						onClose={() => { setOpenRequestListingOrUpdateInfo(false); }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={infoModalStyle}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Request Listing / Update Marketplaces
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>

							</Typography>
						</Box>
					</Modal>
				</Grid>
				{/* <Grid key={"dataStore create"} item xs={4}>
					<Button variant="contained" sx={{ p: 2 }} onClick={async () => {
						await setMediaPublic({ productId: media.productId, isPublic: true } as SetMediaPublicParams);
					}}>
						Set Public
					</Button>
				</Grid> */}
			</Grid>
			{MintingPage({ open: openMintPage, setOpen: setOpenMintPage, ...props })}
			{StorePage({ open: openStore, setOpen: setOpenStore, ...props } as StorePageProps)}
		</Paper>
	);
};

