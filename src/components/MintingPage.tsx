import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import {
	Grid,
	Dialog,
	Typography,
	Button,
	AppBar,
	Toolbar,
	IconButton,
	Autocomplete,
	TextField,
	Paper,
	FormControlLabel,
	Switch,
	Chip,
} from '@mui/material';
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import ImageUpload from '../slime-shared/components/ImageUpload';
import { InfoModal } from '../slime-shared/components/InfoModal';
import { useMarketplaceApi } from '../slime-shared/contexts/MarketplaceApiContext';
import { useSlimeApi } from '../slime-shared/contexts/SlimeApiContext';
import { useWalletConnectRpc } from '../slime-shared/contexts/WalletConnectRpcContext';
import { Marketplace, UploadTextRequest } from '../slime-shared/types/slime/MarketplaceApiTypes';
import type { Media } from '../slime-shared/types/slime/Media';
import { WalletType } from '../slime-shared/types/walletconnect/WalletType';
import { GetWalletsRequest, GetWalletsResponse } from '../slime-shared/types/walletconnect/rpc/GetWallets';
import { MintBulkRequest, MintBulkResponse } from '../slime-shared/types/walletconnect/rpc/MintBulk';
import { PushTxRequest } from '../slime-shared/types/walletconnect/rpc/PushTx';
import { validateXCHAddress } from '../slime-shared/utils/validation';

export type MintingPageProps = {
	media: Media;
	open: boolean;
	dataStoreId: string;
	marketplaces: Marketplace[];
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function MintingPage(props: MintingPageProps) {
	const { media, open, dataStoreId, marketplaces, setOpen } = props;

	const [displayImageUris, setDisplayImageUris] = React.useState<string[]>(
		media.images && media.images.map((image) => image.url)
	);
	const [metadataUris, setMetadataUris] = React.useState<string[]>([]);
	const [licenseUris, setLicenseUris] = React.useState<string[]>([]);
	const [iconUri, setIconUri] = React.useState('');
	const [bannerUri, setBannerUri] = React.useState('');
	const [quantity, setQuantity] = React.useState(100);
	const [batchSize, setBatchSize] = React.useState(25);
	const [edition, setEdition] = React.useState('Standard');
	const [receiveAddress, setReceiveAddress] = React.useState(media.donationAddress);
	const [royaltyAddress, setRoyaltyAddress] = React.useState(media.donationAddress);
	const [royaltyPercentage, setRoyaltyPercentage] = React.useState(20);
	const [metadata, setMetadata] = React.useState('');

	const [validated, setValidated] = React.useState(false);

	const [generateOffers, setGenerateOffers] = React.useState(true);
	const [sensitiveContent, setSensitiveContent] = React.useState(false);
	const [price, setPrice] = React.useState(1.0);
	const [fee, setFee] = React.useState(50_000);

	const [openNotice, setOpenNotice] = React.useState(false);
	const [noticeTitle, setNoticeTitle] = React.useState('');
	const [noticeMessage, setNoticeMessage] = React.useState('');

	const { uploadText } = useMarketplaceApi();

	React.useEffect(() => {
		if (
			displayImageUris.length === 0 ||
			metadataUris.length === 0 ||
			licenseUris.length === 0 ||
			!validateXCHAddress(receiveAddress) ||
			!validateXCHAddress(royaltyAddress)
		) {
			setValidated(false);
		} else {
			setValidated(true);
		}
	}, [displayImageUris, licenseUris, metadataUris, receiveAddress, royaltyAddress]);

	React.useEffect(() => {
		setMetadata(
			JSON.stringify(
				{
					format: 'CHIP-0007',
					name: `${media.titles[0]} - ${edition}`,
					description: `A ${edition} copy of ${media.titles[0]} by ${media.publisherDid}`,
					sensitive_content: sensitiveContent,
					collection: {
						name: media.titles[0],
						id: media.productId,
						attributes: [
							{
								type: 'media metadata format',
								value: 'Slime-1.0',
							},
							{
								type: 'icon',
								value: iconUri,
							},
							{
								type: 'banner',
								value: bannerUri,
							},
							{
								type: 'content rating',
								value: media.contentRatings[0].rating,
							},
							{
								type: 'content tags',
								value: media.tags ? media.tags : '',
							},
							{
								type: 'dataStore id',
								value: dataStoreId,
							},
						],
					},
					attributes: [
						{
							trait_type: 'edition',
							value: edition,
						},
					],
					minting_tool: 'Slime-1.0',
				},
				null,
				4
			)
		);
	}, [iconUri, bannerUri, edition, sensitiveContent, dataStoreId, media]);

	React.useEffect(() => {
		console.log('metadataUris', metadataUris);
	}, [metadataUris]);

	const {
		getWallets,
		mintBulk,
		pushTx,
		// createNewWallet,
	} = useWalletConnectRpc();

	const { getUrlDataHash } = useSlimeApi();

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog fullScreen open={open} onClose={handleClose}>
			<AppBar sx={{ position: 'relative' }}>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
						<CloseIcon />
					</IconButton>
					<Typography sx={{ ml: 2, flex: 1 }} variant="h6">
						{JSON.stringify(media)}
					</Typography>
				</Toolbar>
			</AppBar>
			<Paper elevation={2} sx={{ m: 2, p: 2 }}>
				<Grid container p={4} spacing={4} id="mint page">
					<Grid key={`${media.productId}productId`} item xs={11}>
						<TextField
							id="productId-TextField"
							sx={{ width: '100%' }}
							label="Product Id"
							disabled={true}
							variant="filled"
							value={media.productId}
						/>
					</Grid>
					<Grid key={`${media.productId}productId desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}IconUri`} item xs={11}>
						<TextField
							id="IconUri-TextField"
							sx={{ width: '100%' }}
							onChange={(event: any) => {
								setIconUri(event.target.value);
							}}
							label="Icon Uri"
							variant="filled"
							value={iconUri}
						/>
					</Grid>
					<Grid key={`${media.productId}IconUri desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>
					<Grid key={`${media.productId}Banner`} item xs={11}>
						<TextField
							id="Banner-TextField"
							sx={{ width: '100%' }}
							onChange={(event: any) => {
								setBannerUri(event.target.value);
							}}
							label="Banner Image Uri"
							variant="filled"
							value={bannerUri}
						/>
					</Grid>
					<Grid key={`${media.productId}BannerUri desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}Quantity`} item xs={11}>
						<TextField
							id="Quantity-TextField"
							sx={{ width: '100%' }}
							onChange={(event: any) => {
								setQuantity(event.target.value);
							}}
							label="Quantity"
							variant="filled"
							value={quantity}
						/>
					</Grid>
					<Grid key={`${media.productId}Quantity desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}BatchSize`} item xs={11}>
						<TextField
							id="BatchSize-TextField"
							sx={{ width: '100%' }}
							onChange={(event: any) => {
								setBatchSize(event.target.value);
							}}
							label="Batch Size"
							variant="filled"
							value={batchSize}
						/>
					</Grid>
					<Grid key={`${media.productId}BatchSize desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}Edition`} item xs={11}>
						<TextField
							id="Edition-TextField"
							sx={{ width: '100%' }}
							onChange={(event: any) => {
								setEdition(event.target.value);
							}}
							label="Edition"
							variant="filled"
							value={edition}
						/>
					</Grid>
					<Grid key={`${media.productId}Edition desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>
					<Grid key={`${media.productId}Receive Address`} item xs={11}>
						<TextField
							id="Receive Address-TextField"
							error={!validateXCHAddress(receiveAddress)}
							sx={{ width: '100%' }}
							onChange={(event: any) => {
								setReceiveAddress(event.target.value);
							}}
							label="Receive Address"
							variant="filled"
							value={receiveAddress}
						/>
					</Grid>
					<Grid key={`${media.productId}Receive Address desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>
					<Grid key={`${media.productId}Royalty Address`} item xs={11}>
						<TextField
							id="Royalty Address-TextField"
							sx={{ width: '100%' }}
							error={!validateXCHAddress(royaltyAddress)}
							onChange={(event: any) => {
								setRoyaltyAddress(event.target.value);
							}}
							label="Royalty Address"
							variant="filled"
							value={royaltyAddress}
						/>
					</Grid>
					<Grid key={`${media.productId}Royalty Address desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>
					<Grid key={`${media.productId}Royalty Percentage`} item xs={11}>
						<TextField
							id="Royalty Percentage-TextField"
							sx={{ width: '100%' }}
							onChange={(event: any) => {
								setRoyaltyPercentage(event.target.value);
							}}
							label="Royalty Percentage"
							variant="filled"
							value={royaltyPercentage}
						/>
					</Grid>
					<Grid key={`${media.productId}Royalty Percentage desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}imageUpload`} item xs={11}>
						<Paper elevation={4} sx={{ m: 2, p: 2 }}>
							{ImageUpload({
								marketplaces,
								title: 'Display Image',
								setGui: (uri: string) => {
									displayImageUris.push(uri);
									setDisplayImageUris([...displayImageUris]);
								},
								initialImage: media.images[0] ? media.images[0].url : '',
							})}
						</Paper>
					</Grid>
					<Grid key={`${media.productId}sensitive`} item xs={12}>
						<FormControlLabel
							control={<Switch checked={sensitiveContent} onChange={() => setSensitiveContent(!sensitiveContent)} />}
							label="Display image contains sensitive content"
						/>
					</Grid>
					<Grid key={`${media.productId}DisplayImageUris`} item xs={11}>
						<Autocomplete
							multiple
							id={`${media.productId}DisplayImageUris-outlined`}
							options={[media.images[0] ? media.images[0].url : '']}
							freeSolo
							getOptionLabel={(option: any) => option}
							defaultValue={displayImageUris}
							filterSelectedOptions
							onChange={(event: any, values: string[]) => {
								setDisplayImageUris(values);
							}}
							renderInput={(params: any) => <TextField {...params} label="Display Image URLs" placeholder="+" />}
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
					<Grid key={`${media.productId}DisplayImageUri desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}Metadata`} item xs={11}>
						<TextField
							id="MetadataTextField"
							sx={{ width: '100%' }}
							multiline
							maxRows={69}
							disabled={false}
							label="Metadata"
							variant="filled"
							value={metadata}
							onChange={(event: any) => {
								setMetadata(event.target.value);
							}}
						/>
					</Grid>
					<Grid key={`${media.productId}Metadata desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
						<Button
							sx={{ width: '100%' }}
							variant="contained"
							onClick={() => {
								navigator.clipboard.writeText(metadata);
							}}
						>
							Copy
						</Button>
						<Button
							sx={{ width: '100%', marginTop: '5px' }}
							variant="contained"
							onClick={async () => {
								marketplaces.forEach(async (marketplace) => {
									const res = await uploadText({ text: metadata, url: marketplace.url } as UploadTextRequest);
									if (res.id) {
										metadataUris.push(`${marketplace.url}/public/${res.id}.json`);
										setMetadataUris([...metadataUris]);
									} else {
										alert(`Unknown Error during upload to ${marketplace.url}\n${res.message}`);
									}
								});
								if (marketplaces.length === 0) {
									alert('No Marketplaces Available');
								} else {
									alert('Upload Complete');
								}
							}}
						>
							Upload
						</Button>
					</Grid>
					<Grid key={`${media.productId}MetadataUris`} item xs={11}>
						<Autocomplete
							multiple
							id={`${media.productId}MetadataUris-outlined`}
							options={['']}
							freeSolo
							getOptionLabel={(option: any) => option}
							defaultValue={metadataUris}
							filterSelectedOptions
							onChange={(event: any, values: string[]) => {
								setMetadataUris(values);
							}}
							renderInput={(params: any) => <TextField {...params} label="Metadata URLs" placeholder="+" />}
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
					<Grid key={`${media.productId}MetadataUris desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}LicenseUris`} item xs={11}>
						<Autocomplete
							multiple
							id={`${media.productId}LicenseUris-outlined`}
							options={['']}
							freeSolo
							getOptionLabel={(option: any) => option}
							defaultValue={[]}
							filterSelectedOptions
							onChange={(event: any, values: string[]) => {
								setLicenseUris(values);
							}}
							renderInput={(params: any) => <TextField {...params} label="License URLs" placeholder="+" />}
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
					<Grid key={`${media.productId}LicenseUris desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}generateOffers`} item xs={12}>
						<FormControlLabel
							control={<Switch checked={generateOffers} onChange={() => setGenerateOffers(!generateOffers)} />}
							label="Generate Offer Files"
						/>
					</Grid>
					{generateOffers && (
						<>
							<Grid key={`${media.productId}price`} item xs={11}>
								<TextField
									id="productIdTextField"
									sx={{ width: '100%' }}
									label="Sale Price (XCH)"
									onChange={(event: any) => {
										setPrice(event.target.value);
									}}
									variant="filled"
									value={price}
								/>
							</Grid>
							<Grid key={`${media.productId}price desc`} item xs={1}>
								<IconButton
									size="small"
									aria-label="info"
									onClick={() => {
										setNoticeTitle('Product ID');
										setNoticeMessage(
											'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
										);
										setOpenNotice(true);
									}}
								>
									<InfoIcon />
								</IconButton>
							</Grid>
						</>
					)}
					<Grid key={`${media.productId}Fee`} item xs={11}>
						<TextField
							id="productIdTextField"
							sx={{ width: '100%' }}
							label="Minting Fee (mojos)"
							onChange={(event: any) => {
								setFee(event.target.value);
							}}
							variant="filled"
							value={fee}
						/>
					</Grid>
					<Grid key={`${media.productId}fee desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Product ID');
								setNoticeMessage(
									'An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.'
								);
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>
					<Grid key={`${media.productId}Mint`} item xs={11}>
						{!validated && (
							<Paper elevation={4} sx={{ m: 2, p: 2 }}>
								<Typography variant="h6" color="error">
									<ul>
										{!validateXCHAddress(receiveAddress) && <li>Invalid Receive Address</li>}
										{!validateXCHAddress(royaltyAddress) && <li>Invalid Royalty Address</li>}
										{displayImageUris.length === 0 && <li>No Display Image URL(s)</li>}
										{metadataUris.length === 0 && <li>No Metadata URL(s)</li>}
										{licenseUris.length === 0 && <li>No License URL(s)</li>}
									</ul>
								</Typography>
							</Paper>
						)}

						<Button
							sx={{ width: '100%' }}
							disabled={!validated}
							variant="contained"
							onClick={async () => {
								console.log('Starting Mint');

								const wallets: GetWalletsResponse = await getWallets({ includeData: false } as GetWalletsRequest);
								let mintWallet = 0;
								console.log('wallets: ', wallets);
								wallets.forEach((wallet) => {
									console.log('wallet: ', wallet);
									if (wallet.type === WalletType.Nft) {
										if (wallet.meta.did === media.publisherDid) {
											mintWallet = wallet.id;
										}
									}
								});

								if (mintWallet === 0) {
									console.log('wallet not found');
									return;
								}

								console.log('mintWallet: ', mintWallet);
								console.log('displayImageUris: ', displayImageUris);
								const imageHash = await getUrlDataHash({ url: displayImageUris[0] });
								const metadataHash = await getUrlDataHash({ url: metadataUris[0] });
								const licenseHash = await getUrlDataHash({ url: licenseUris[0] });

								console.log('imageHash: ', imageHash.hash);
								console.log('metadataHash: ', metadataHash.hash);
								console.log('licenseHash: ', licenseHash.hash);
								const targetList: string[] = [];
								const metadataList: any[] = [];

								for (let num = 0; num < quantity; num++) {
									console.log('num: ', num);
									targetList.push(receiveAddress);
									metadataList.push({
										uris: displayImageUris,
										meta_uris: metadataUris,
										license_uris: licenseUris,
										hash: imageHash.hash,
										meta_hash: metadataHash.hash,
										license_hash: licenseHash.hash,
										edition_number: num,
										edition_total: quantity,
									});
								}

								console.log('metadata_list: ', metadataList);

								const mintRequest: MintBulkRequest = {
									walletId: mintWallet,
									metadataList,
									royaltyPercentage: royaltyPercentage * 100,
									royaltyAddress: media.donationAddress,
									targetList,
									mintFromDid: true,
									fee,
									reusePuzhash: false,
								};
								console.log('mintRequest: ', mintRequest);

								const response: MintBulkResponse = await mintBulk(mintRequest);

								console.log('mint response: ', response);

								const transaction = await pushTx({
									spendBundle: response.spendBundle,
								} as PushTxRequest);

								console.log('transaction: ', transaction);
							}}
						>
							Start Minting
						</Button>
					</Grid>
					<Grid key={`${media.productId}mint desc`} item xs={1}>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setNoticeTitle('Minting');
								setNoticeMessage('Minting will take a while. Please be patient.');
								setOpenNotice(true);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Grid>
				</Grid>
				<InfoModal open={openNotice} setOpen={setOpenNotice} title={noticeTitle} style="info">
					{noticeMessage}
				</InfoModal>
			</Paper>
		</Dialog>
	);
}
