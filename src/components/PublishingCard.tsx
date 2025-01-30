import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import {
	Paper,
	Grid,
	TextField,
	Autocomplete,
	Button,
	IconButton,
	Chip,
	Divider,
	ToggleButtonGroup,
	ToggleButton,
} from '@mui/material';
import { SimplePool } from 'nostr-tools';
import * as React from 'react';

import { AddMarketplaceModal } from '../slime-shared/components/AddMarketplaceModal';
import GameCard from '../slime-shared/components/GameCard';
import { InfoModal } from '../slime-shared/components/InfoModal';
import { DefaultExecutables, DevelopmentStatuses, MediaTypes } from '../slime-shared/constants';
import { useMarketplaceApi } from '../slime-shared/contexts/MarketplaceApiContext';
import { useSlimeApi } from '../slime-shared/contexts/SlimeApiContext';
import { RequestListingOrUpdateRequest, Marketplace } from '../slime-shared/types/slime/MarketplaceApiTypes';
import type { Media, MediaExecutable, MediaTag, MediaTorrent, MediaUrlSource } from '../slime-shared/types/slime/Media';
import { SignNostrMessageRequest } from '../slime-shared/types/slime/SlimeRpcTypes';
import { getEventHash, NostrEvent } from '../slime-shared/utils/nostr';
import { ContentRatingsEditor } from './ContentRatingEditor';
import { CreditsEditor } from './CreditsEditor';
import { DescriptionsEditor } from './DescriptionsEditor';
import { EditTorrents } from './EditTorrent';
import { ImagesEditor } from './ImagesEditor';
import MintingPage from './MintingPage';
import { TagsEditor } from './TagsEditor';
import { TitlesEditor } from './TitlesEditor';
import { VideosEditor } from './VideosEditor';

export type PublishingCardProps = {
	media: Media;
	dataStoreId: string;
	onExecuteUpdate: (media: Media) => Promise<void>;
};

export default function PublishingCard(props: PublishingCardProps) {
	const { media, onExecuteUpdate } = props;
	const { slimeConfig, signNostrMessage } = useSlimeApi();

	const [showAdult, setShowAdult] = React.useState(false);

	const [mediaLocal, setMediaLocal] = React.useState<Media>(media);

	const [mediaType, setMediaType] = React.useState<string>(media.mediaType);
	// const [childProducts, setChildProducts] = React.useState<string[]>(media.childProducts);
	const [executables, setExecutables] = React.useState<MediaExecutable[]>(media.executables);
	const [lastUpdated, setLastUpdated] = React.useState<number>(media.lastUpdated);
	const [lastUpdatedContent, setLastUpdatedContent] = React.useState<number>(media.lastUpdatedContent);
	const [nostrEventId, setNostrEventId] = React.useState<string>(media.nostrEventId);
	const [password, setPassword] = React.useState<string>(media.password);
	const [images, setImages] = React.useState<MediaUrlSource[]>(media.images);
	const [videos, setVideos] = React.useState<MediaUrlSource[]>(media.videos);
	const [donationAddress, setDonationAddress] = React.useState<string>(media.donationAddress);
	// const [parentProductId, setParentProductId] = React.useState<string>(media.parentProductId);
	const [productId] = React.useState<string>(media.productId);
	const [publisherDid, setPublisherDid] = React.useState<string>(media.publisherDid);
	const [releaseStatus, setReleaseStatus] = React.useState<string>(media.releaseStatus);
	const [supportContact, setSupportContact] = React.useState<string>(media.supportContact);
	const [tags, setTags] = React.useState<MediaTag[]>(media.tags);
	const [torrents, setTorrents] = React.useState<MediaTorrent[]>(media.torrents);
	const [version, setVersion] = React.useState<string>(media.version);
	const [publicStatus, setPublicStatus] = React.useState<boolean>(true);

	React.useEffect(() => {
		media.mediaType = mediaType;
		// media.childProducts = childProducts;
		media.executables = executables;
		media.lastUpdated = lastUpdated;
		media.lastUpdatedContent = lastUpdatedContent;
		media.nostrEventId = nostrEventId;
		media.password = password;
		media.images = images;
		media.videos = videos;
		media.donationAddress = donationAddress;
		// media.parentProductId = parentProductId;
		media.productId = productId;
		media.publisherDid = publisherDid;
		media.releaseStatus = releaseStatus;
		media.supportContact = supportContact;
		media.tags = tags;
		media.torrents = torrents;
		media.version = version;
	}, [
		media,
		mediaType,
		// childProducts,
		executables,
		lastUpdated,
		lastUpdatedContent,
		nostrEventId,
		password,
		images,
		videos,
		donationAddress,
		// parentProductId,
		productId,
		publisherDid,
		releaseStatus,
		supportContact,
		tags,
		torrents,
		version,
	]);

	const createNostrThread = async () => {
		const nostrPool = new SimplePool();

		if (!slimeConfig) {
			alert('No public key found. Please set up your profile.');
			return;
		}

		console.log(
			'start createNostrThread relays',
			slimeConfig.nostrRelays.map((relay) => relay.url)
		);

		const foundEvent = await nostrPool.get(
			slimeConfig.nostrRelays.map((relay) => relay.url),
			{ ids: [media.nostrEventId] }
		);
		console.log('query for event', foundEvent);
		console.log('createNostrThread media', media);

		if (!media.nostrEventId || foundEvent) {
			console.log('Creating Nostr Thread');

			const pk = slimeConfig.activeIdentity.currentNostrPublicKey;

			if (!pk) {
				console.log('No public key found');
				alert('No public key found. Please set up your profile.');
				return;
			}

			console.log('here 1');

			const createdAt = Math.floor(Date.now() / 1000);

			const event: NostrEvent = {
				content: media.productId,
				kind: 1,
				tags: [['i', `chia:${media.publisherDid}`, slimeConfig.activeIdentity.proof]],
				created_at: createdAt,
				pubkey: pk,
				id: '',
				sig: '',
			};
			event.id = getEventHash(event);

			console.log('event before sign', event);
			const signResp = await signNostrMessage({ message: event.id } as SignNostrMessageRequest);
			console.log('signResp', signResp);
			event.sig = signResp.signature;
			media.nostrEventId = event.id;

			await Promise.any(
				nostrPool.publish(
					slimeConfig.nostrRelays.map((relay) => relay.url),
					event
				)
			);
			setNostrEventId(event.id);
		}
	};

	const [marketplaces] = React.useState<Marketplace[]>(slimeConfig?.marketplaces ?? []);
	const [selectedMarketplaces, setSelectedMarketplaces] = React.useState<Marketplace[]>([]);
	const [addMarketplaceModalOpen, setAddMarketplaceModalOpen] = React.useState<boolean>(false);

	React.useEffect(() => {
		setSelectedMarketplaces(marketplaces);
	}, [marketplaces]);

	const { requestListingOrUpdate } = useMarketplaceApi();

	const onFilesUpdate = async () => {
		const randPassword = new Array(10)
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
		setPassword(randPassword);
		media.password = randPassword;
		// const resp = await generateTorrents({ media, sourcePaths } as GenerateTorrentsRequest);
	};

	const onRequestListingOrUpdate = async () => {
		console.log('Requesting Listing/Update', selectedMarketplaces, media);
		setLastUpdated(Math.floor(Date.now() / 1000));
		setLastUpdatedContent(Math.floor(Date.now() / 1000)); // move to torrents
		selectedMarketplaces.map(async (marketplace: Marketplace) => {
			const result = await requestListingOrUpdate({
				url: marketplace.url,
				media,
				setPublic: publicStatus,
			} as RequestListingOrUpdateRequest);
			console.log('listing result', result);
		});
	};

	const [openInfoModal, setOpenInfoModal] = React.useState(false);
	const [infoTitle, setInfoTitle] = React.useState('');
	const [infoDescription, setInfoDescription] = React.useState('');

	const [openMintPage, setOpenMintPage] = React.useState(false);

	return (
		<Paper elevation={3} sx={{ m: 2, p: 2 }}>
			<InfoModal open={openInfoModal} setOpen={setOpenInfoModal} title={infoTitle} style="info">
				{infoDescription}
			</InfoModal>
			<Grid container p={4} spacing={4} id="productlist">
				<Grid key={`${productId}preview`} item xs={6} sm={4} md={3} lg={2}>
					<GameCard media={media} />
				</Grid>
				<Grid key={`${productId}preview desc`} item xs={6}>
					<IconButton
						size="small"
						onClick={() => {
							setInfoTitle('Preview');
							setInfoDescription(
								'This is a preview of what your product will look like in the Slime Marketplace. Click it to see a preview of your store page.'
							);
							setOpenInfoModal(true);
						}}
					>
						<InfoIcon />
					</IconButton>
				</Grid>

				<Grid key={`${productId}productId`} item xs={12} md={6}>
					<TextField
						id="productIdTextField"
						sx={{ width: '100%' }}
						label="Product Id"
						disabled={true}
						variant="filled"
						value={productId}
						inputProps={{
							endAdornment: (
								<IconButton
									size="small"
									onClick={() => {
										setOpenInfoModal(true);
										setInfoTitle('Product Id');
										setInfoDescription('The unique identifier for your product. This cannot be changed.');
									}}
								>
									<InfoIcon />
								</IconButton>
							),
						}}
					/>
				</Grid>
				<Grid key={`${productId}mediaType`} item xs={12} md={6}>
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
				<Grid key={`${productId}title`} item xs={12}>
					<TitlesEditor media={mediaLocal} setMedia={setMediaLocal} />
				</Grid>

				<Grid key={`${productId}Descriptions`} item xs={12}>
					<DescriptionsEditor media={mediaLocal} setMedia={setMediaLocal} />
				</Grid>

				<Grid key={`${productId}images`} item xs={12}>
					<ImagesEditor media={mediaLocal} setImages={setImages} />
				</Grid>

				<Grid key={`${productId}videos`} item xs={12}>
					<VideosEditor media={mediaLocal} setVideos={setVideos} />
				</Grid>

				<Grid key={`${productId}contentRating`} item xs={12}>
					<ContentRatingsEditor media={mediaLocal} setMedia={setMediaLocal} setAdultContent={setShowAdult} />
				</Grid>

				<Grid key={`${productId}tags`} item xs={12}>
					<TagsEditor media={mediaLocal} setTags={setTags} includeAdult={showAdult} />
				</Grid>

				<Grid key={`${productId}credits`} item xs={12}>
					<CreditsEditor media={mediaLocal} setMedia={setMediaLocal} />
				</Grid>

				<Grid key={`${productId}publisherDid`} item xs={12} md={6}>
					<TextField
						id="publisherDidTextField"
						sx={{ width: '100%' }}
						label="Publisher DID"
						variant="filled"
						disabled={true}
						value={publisherDid}
						onChange={(event: any) => {
							setPublisherDid(event.target.value);
							setSupportContact(event.target.value);
							media.publisherDid = event.target.value;
						}}
						inputProps={{
							endAdornment: (
								<IconButton
									size="small"
									onClick={() => {
										setOpenInfoModal(true);
										setInfoTitle('Publisher DID');
										setInfoDescription(
											'The DID (Distributed Identity) Profile of the publisher. DID should not be changed after first mint.'
										);
									}}
								>
									<InfoIcon />
								</IconButton>
							),
						}}
					/>
				</Grid>
				<Grid key={`${productId}donationAddress`} item xs={12} md={6}>
					<TextField
						id="donationAddressTextField"
						sx={{ width: '100%' }}
						label="Donation Address"
						variant="filled"
						value={donationAddress}
						onChange={(event: any) => {
							setDonationAddress(event.target.value);
						}}
						inputProps={{
							endAdornment: (
								<IconButton
									size="small"
									onClick={() => {
										setOpenInfoModal(true);
										setInfoTitle('Donation Address');
										setInfoDescription(
											'An XCH address where people can donate to support your work. This will also be your default royalty address.'
										);
									}}
								>
									<InfoIcon />
								</IconButton>
							),
						}}
					/>
				</Grid>
				<Grid key={`${productId}version`} item xs={12} md={6}>
					<TextField
						id="versionTextField"
						sx={{ width: '100%' }}
						label="Version"
						variant="filled"
						value={version}
						onChange={(event: any) => {
							setVersion(event.target.value);
						}}
						inputProps={{
							inputMode: 'numeric',
							endAdornment: (
								<IconButton
									size="small"
									onClick={() => {
										setOpenInfoModal(true);
										setInfoTitle('Version');
										setInfoDescription(
											'Current version number. Ideally using Semantic Versioning. But other numeric formats should work.'
										);
									}}
								>
									<InfoIcon />
								</IconButton>
							),
						}}
					/>
				</Grid>
				<Grid key={`${productId}status`} item xs={12} md={6}>
					<Autocomplete
						id={`${productId}status-combo-box`}
						defaultValue={releaseStatus}
						options={DevelopmentStatuses}
						sx={{ width: '100%' }}
						onChange={(event: any) => {
							setReleaseStatus(event.target.innerText);
						}}
						renderInput={(params) => <TextField {...params} label="Development Status" />}
					/>
				</Grid>

				<Grid key={`${productId}Torrents`} item xs={12}>
					<EditTorrents media={media} setTorrents={setTorrents} />
				</Grid>

				<Grid key={`${productId}Update Files`} item xs={11}>
					<Button sx={{ width: '100%' }} variant="contained" onClick={onFilesUpdate}>
						Update Product Torrent Files
					</Button>
				</Grid>
				<Grid key={`${productId}Update Files desc`} item xs={1}>
					<IconButton
						size="small"
						onClick={() => {
							setOpenInfoModal(true);
							setInfoTitle('Update Torrent Files');
							setInfoDescription(
								"This button generates your torrent files to be included in an update. Don't press it unless you intend push updated project files to everyone who owns your product."
							);
						}}
					>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId}executables`} item xs={12}>
					<TextField
						id="executablesTextField"
						sx={{ width: '100%' }}
						multiline
						maxRows={6}
						label="Executables"
						variant="filled"
						value={executables}
						defaultValue={DefaultExecutables}
						onChange={(event: any) => {
							setExecutables(event.target.value);
						}}
						inputProps={{
							endAdornment: (
								<IconButton
									size="small"
									onClick={() => {
										setOpenInfoModal(true);
										setInfoTitle('Executables');
										setInfoDescription(
											"Specifies the relative path to your executables from your project root. If you do not support a given operating system, leave it empty, don't delete it."
										);
									}}
								>
									<InfoIcon />
								</IconButton>
							),
						}}
					/>
				</Grid>
				<Grid key={`${productId}Update`} item xs={5}>
					<Button
						sx={{ width: '100%' }}
						variant="contained"
						onClick={async () => {
							try {
								await createNostrThread();
							} catch (error) {
								console.error('Error creating Nostr Thread', error);
							}
							console.log('onExecuteUpdate before', media);
							onExecuteUpdate(media);
						}}
					>
						Commit Update
					</Button>
				</Grid>
				<Grid key={`${productId}update desc`} item xs={1}>
					<IconButton
						size="small"
						onClick={() => {
							setOpenInfoModal(true);
							setInfoTitle('Commit Update');
							setInfoDescription(
								'Pressing this button will push this update to your dataStore. Please review all fields above before committing, this will require an on chain transaction for every update and will use the transaction fee at the top of the page.'
							);
						}}
					>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId}Mint`} item xs={5}>
					<Button
						sx={{ width: '100%' }}
						variant="contained"
						onClick={() => {
							setOpenMintPage(true);
						}}
					>
						Mint Copies
					</Button>
				</Grid>
				<Grid key={`${productId}mint desc`} item xs={1}>
					<IconButton
						size="small"
						onClick={() => {
							setOpenInfoModal(true);
							setInfoTitle('Mint Copies');
							setInfoDescription('Mint copies of your product for sale or distribution.');
						}}
					>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Divider />
				<Grid key={`${productId}marketplaces`} item xs={10}>
					<Autocomplete
						multiple
						id={`${productId}marketplaces-outlined`}
						options={marketplaces.map((marketplace) => marketplace.displayName)}
						onChange={(event: any, values: string[]) => {
							const selected: Marketplace[] = [];
							marketplaces.forEach((marketplace) => {
								if (values.includes(marketplace.displayName)) selected.push(marketplace);
							});

							setSelectedMarketplaces(selected);
						}}
						renderTags={(tagValue, getTagProps) =>
							tagValue.map((option, index) => <Chip label={option} {...getTagProps({ index })} />)
						}
						renderInput={(params) => <TextField {...params} label="Select Marketplaces" placeholder="Marketplaces" />}
					/>
				</Grid>
				<Grid key={`${productId}marketplaces add`} item xs={1}>
					<IconButton
						size="large"
						aria-label="Add"
						onClick={() => {
							setAddMarketplaceModalOpen(true);
						}}
					>
						<AddIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId}marketplaces desc`} item xs={1}>
					<IconButton
						size="small"
						onClick={() => {
							setOpenInfoModal(true);
							setInfoTitle('Marketplaces');
							setInfoDescription('Urls of all marketplaces you want to request listing on, or push updates too.');
						}}
					>
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
							if (value !== null) setPublicStatus(value);
						}}
						aria-label="Platform"
					>
						<ToggleButton value={true}>Set Public</ToggleButton>
						<ToggleButton value={false}>Set Private</ToggleButton>
					</ToggleButtonGroup>
				</Grid>
				<Grid key={`${productId}Request Listing / Update Marketplaces desc`} item xs={1}>
					<IconButton
						size="small"
						onClick={() => {
							setOpenInfoModal(true);
							setInfoTitle('Request Listing / Update Marketplaces');
							setInfoDescription(
								'Requests listing on all marketplaces you have selected above. If you have already listed on a marketplace, this will push updates to that marketplace. During the Beta, you can freely set your product to public or private. Once the beta is over, there will be a verification process before you can set your product as public.'
							);
						}}
					>
						<InfoIcon />
					</IconButton>
				</Grid>
				<Grid key={`${productId} Divider`} item xs={12}>
					<Divider />
				</Grid>
				<Grid key={`${productId} Divideeer`} item xs={12}>
					<Button
						onClick={() => {
							console.log('aoeuaoeu', mediaLocal);
						}}
					>
						aoeuao
					</Button>
				</Grid>
			</Grid>
			<MintingPage open={openMintPage} setOpen={setOpenMintPage} marketplaces={marketplaces} {...props} />
			<AddMarketplaceModal open={addMarketplaceModalOpen} setOpen={setAddMarketplaceModalOpen} />
		</Paper>
	);
}
