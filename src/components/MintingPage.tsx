import { Buffer } from 'buffer';

import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import {
	Grid, Dialog, Typography, Button,
	AppBar, Toolbar, IconButton,
	Autocomplete, TextField, Paper, Modal, Box, FormControlLabel, Switch, Chip
} from '@mui/material';
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import ImageUpload from '../gosti-shared/components/ImageUpload';
import { infoModalStyle } from '../gosti-shared/constants';
import { useMarketplaceApi } from '../gosti-shared/contexts/MarketplaceApiContext';
import { useWalletConnectRpc } from '../gosti-shared/contexts/WalletConnectRpcContext';
import { Marketplace, UploadTextRequest } from '../gosti-shared/types/gosti/MarketplaceApiTypes';
import type { Media } from '../gosti-shared/types/gosti/Media';
import { WalletType } from '../gosti-shared/types/walletconnect/WalletType';
import { GetWalletsRequest, GetWalletsResponse } from '../gosti-shared/types/walletconnect/rpc/GetWallets';
import { MintBulkRequest, MintBulkResponse } from '../gosti-shared/types/walletconnect/rpc/MintBulk';
import { PushTxRequest } from '../gosti-shared/types/walletconnect/rpc/PushTx';

export type MintingPageProps = {
	media: Media;
	open: boolean,
	dataStoreId: string,
	marketplaces: Marketplace[],
	setOpen: Dispatch<SetStateAction<boolean>>
};

export default function MintingPage(props: MintingPageProps) {
	const { media, open, dataStoreId, marketplaces, setOpen } = props;

	const [displayImageUris, setDisplayImageUris] = React.useState<string[]>([media.capsuleImage]);
	const [metadataUris, setMetadataUris] = React.useState<string[]>([]);
	const [licenseUris, setLicenseUris] = React.useState<string[]>([]);
	const [iconUri, setIconUri] = React.useState("");
	const [bannerUri, setBannerUri] = React.useState("");
	const [quantity, setQuantity] = React.useState(100);
	const [batchSize, setBatchSize] = React.useState(25);
	const [edition, setEdition] = React.useState("Standard");
	const [receiveAddress, setReceiveAddress] = React.useState(media.paymentAddress);
	const [royaltyAddress, setRoyaltyAddress] = React.useState(media.paymentAddress);
	const [royaltyPercentage, setRoyaltyPercentage] = React.useState(20);
	const [metadata, setMetadata] = React.useState("");

	const [generateOffers, setGenerateOffers] = React.useState(true);
	const [sensitiveContent, setSensitiveContent] = React.useState(false);
	const [price, setPrice] = React.useState(1.00);
	const [fee, setFee] = React.useState(50_000);

	const [openNotice, setOpenNotice] = React.useState(false);
	const [noticeTitle, setNoticeTitle] = React.useState("");
	const [noticeMessage, setNoticeMessage] = React.useState("");

	const { uploadText } = useMarketplaceApi();


	React.useEffect(() => {
		setMetadata(JSON.stringify({
			"format": "CHIP-0007",
			"name": `${media.title} - ${edition}`,
			"description": `A ${edition} copy of ${media.title} by ${media.publisherDid}`,
			"sensitive_content": sensitiveContent,
			"collection": {
				"name": media.title,
				"id": media.productId,
				"attributes": [
					{
						"type": "media metadata format",
						"value": "Gosti-1.0"
					},
					{
						"type": "icon",
						"value": iconUri
					},
					{
						"type": "banner",
						"value": bannerUri
					},
					{
						"type": "content rating",
						"value": media.contentRating ? media.contentRating : ""
					},
					{
						"type": "content tags",
						"value": media.tags ? media.tags : ""
					},
					{
						"type": "creators",
						"value": media.creators ? media.creators : []
					},
					{
						"type": "dataStore id",
						"value": dataStoreId
					}
				]
			},
			"attributes": [
				{
					"trait_type": "edition",
					"value": edition
				}
			],
			"minting_tool": "Gosti-1.0"
		}, null, 4));

	}, [iconUri, bannerUri, edition, sensitiveContent, dataStoreId, media]);

	React.useEffect(() => {
		console.log("metadataUris", metadataUris);
	}, [metadataUris]);

	const {
		getWallets,
		mintBulk,
		pushTx,
		// createNewWallet,
	} = useWalletConnectRpc();

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
		>
			<AppBar sx={{ position: 'relative' }}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={handleClose}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
					<Typography sx={{ ml: 2, flex: 1 }} variant="h6">
						{media.title}
					</Typography>
				</Toolbar>
			</AppBar>
			<Paper elevation={3} sx={{ m: 2, p: 2 }}>
				<Grid container p={4} spacing={4} id="mint page">
					<Grid key={`${media.productId}productId`} item xs={11}>
						<TextField id="productId-TextField" sx={{ width: '100%' }} label="Product Id" disabled={true} variant="filled" value={media.productId} />
					</Grid>
					<Grid key={`${media.productId}productId desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}IconUri`} item xs={11}>
						<TextField id="IconUri-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setIconUri(event.target.value); }} label="Icon Uri" variant="filled" value={iconUri} />
					</Grid>
					<Grid key={`${media.productId}IconUri desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>
					<Grid key={`${media.productId}Banner`} item xs={11}>
						<TextField id="Banner-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setBannerUri(event.target.value); }} label="Banner Image Uri" variant="filled" value={bannerUri} />
					</Grid>
					<Grid key={`${media.productId}BannerUri desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}Quantity`} item xs={11}>
						<TextField id="Quantity-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setQuantity(event.target.value); }} label="Quantity" variant="filled" value={quantity} />
					</Grid>
					<Grid key={`${media.productId}Quantity desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}BatchSize`} item xs={11}>
						<TextField id="BatchSize-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setBatchSize(event.target.value); }} label="Batch Size" variant="filled" value={batchSize} />
					</Grid>
					<Grid key={`${media.productId}BatchSize desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}Edition`} item xs={11}>
						<TextField id="Edition-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setEdition(event.target.value); }} label="Edition" variant="filled" value={edition} />
					</Grid>
					<Grid key={`${media.productId}Edition desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>
					<Grid key={`${media.productId}Receive Address`} item xs={11}>
						<TextField id="Receive Address-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setReceiveAddress(event.target.value); }} label="Receive Address" variant="filled" value={receiveAddress} />
					</Grid>
					<Grid key={`${media.productId}Receive Address desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>
					<Grid key={`${media.productId}Royalty Address`} item xs={11}>
						<TextField id="Royalty Address-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setRoyaltyAddress(event.target.value); }} label="Royalty Address" variant="filled" value={royaltyAddress} />
					</Grid>
					<Grid key={`${media.productId}Royalty Address desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>
					<Grid key={`${media.productId}Royalty Percentage`} item xs={11}>
						<TextField id="Royalty Percentage-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setRoyaltyPercentage(event.target.value); }} label="Royalty Percentage" variant="filled" value={royaltyPercentage} />
					</Grid>
					<Grid key={`${media.productId}Royalty Percentage desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>


					<Grid key={`${media.productId}imageUpload`} item xs={11}>
						<Paper elevation={3} sx={{ m: 2, p: 2 }}>
							{ImageUpload({
								marketplaces,
								title: "Display Image",
								setGui: (uri: string) => {
									displayImageUris.push(uri);
									setDisplayImageUris([...displayImageUris]);
								},
								initialImage: media.capsuleImage
							})}
						</Paper>
					</Grid>
					<Grid key={`${media.productId}sensitive`} item xs={12}>
						<FormControlLabel control={<Switch checked={sensitiveContent} onChange={() => setSensitiveContent(!sensitiveContent)} />} label="Display image contains sensitive content" />
					</Grid>
					<Grid key={`${media.productId}DisplayImageUris`} item xs={11}>
						<Autocomplete
							multiple
							id={`${media.productId}DisplayImageUris-outlined`}
							options={[media.capsuleImage]}
							freeSolo
							getOptionLabel={(option: any) => option}
							defaultValue={displayImageUris}
							filterSelectedOptions
							onChange={(event: any, values: string[]) => { setDisplayImageUris(values); }}
							renderInput={(params: any) => (
								<TextField
									{...params}
									label="Display Image URLs"
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
					<Grid key={`${media.productId}DisplayImageUri desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}Metadata`} item xs={11}>
						<TextField id="MetadataTextField" sx={{ width: '100%' }}
							multiline maxRows={69}
							disabled={false}
							label="Metadata"
							variant="filled"
							value={metadata}
							onChange={(event: any) => { setMetadata(event.target.value); }}
						/>
					</Grid>
					<Grid key={`${media.productId}Metadata desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
						<Button sx={{ width: '100%' }} variant="contained" onClick={() => {
							navigator.clipboard.writeText(metadata);
						}}>
							Copy
						</Button>
						<Button sx={{ width: '100%', marginTop: "5px" }} variant="contained" onClick={async () => {
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
								alert("No Marketplaces Available");
							} else {
								alert("Upload Complete");
							}
						}}>
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
							onChange={(event: any, values: string[]) => { setMetadataUris(values); }}
							renderInput={(params: any) => (
								<TextField
									{...params}
									label="Metadata URLs"
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
					<Grid key={`${media.productId}MetadataUris desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
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
							onChange={(event: any, values: string[]) => { setLicenseUris(values); }}
							renderInput={(params: any) => (
								<TextField
									{...params}
									label="License URLs"
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
					<Grid key={`${media.productId}LicenseUris desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>

					<Grid key={`${media.productId}generateOffers`} item xs={12}>
						<FormControlLabel control={<Switch checked={generateOffers} onChange={() => setGenerateOffers(!generateOffers)} />} label="Generate Offer Files" />
					</Grid>
					{generateOffers && <>
						<Grid key={`${media.productId}price`} item xs={11}>
							<TextField id="productIdTextField" sx={{ width: '100%' }} label="Sale Price (XCH)" onChange={(event: any) => { setPrice(event.target.value); }} variant="filled" value={price} />
						</Grid>
						<Grid key={`${media.productId}price desc`} item xs={1}>
							<IconButton size="small" aria-label="info" onClick={() => {
								setNoticeTitle("Product ID");
								setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
								setOpenNotice(true);
							}}>
								<InfoIcon />
							</IconButton>
						</Grid>
					</>
					}
					<Grid key={`${media.productId}Fee`} item xs={11}>
						<TextField id="productIdTextField" sx={{ width: '100%' }} label="Minting Fee (mojos)" onChange={(event: any) => { setFee(event.target.value); }} variant="filled" value={fee} />
					</Grid>
					<Grid key={`${media.productId}fee desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Product ID");
							setNoticeMessage("An auto generated unique identifier (UUID v4). It is used as your NFT collection ID to identify your product. Cannot be changed.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>
					<Grid key={`${media.productId}Mint`} item xs={11}>
						<Button sx={{ width: '100%' }} variant="contained" onClick={async () => {
							console.log("Starting Mint");

							const wallets: GetWalletsResponse = await getWallets({ includeData: false } as GetWalletsRequest);
							let mintWallet = 0;
							console.log("wallets: ", wallets);
							wallets.forEach((wallet) => {
								console.log("wallet: ", wallet);
								if (wallet.type === WalletType.Nft) {
									if (wallet.meta.did === media.publisherDid) {
										mintWallet = wallet.id;
									}
								}
							});

							if (mintWallet === 0) {
								console.log("wallet not found");
								return;
								// const response = await createNewWallet({
								// 	wallet_type: "nft_wallet",
								// 	did_id: media.publisherDid,
								// 	name: "Gosti NFT Mint Wallet"
								// } as CreateNewWalletRequest);
								// mintWallet = response.wallet_id;
							}

							console.log("mintWallet: ", mintWallet);
							console.log("displayImageUris: ", displayImageUris);
							const imageHash = await crypto.subtle.digest("SHA-256", await fetch(displayImageUris[0]).then((response) => response.arrayBuffer()));
							const metadataHash = await crypto.subtle.digest("SHA-256", await fetch(metadataUris[0]).then((response) => response.arrayBuffer()));
							const licenseHash = await crypto.subtle.digest("SHA-256", await fetch(licenseUris[0]).then((response) => response.arrayBuffer()));

							console.log("imageHash: ", Buffer.from(imageHash).toString('hex'));
							console.log("metadataHash: ", Buffer.from(metadataHash).toString('hex'));
							console.log("licenseHash: ", Buffer.from(licenseHash).toString('hex'));
							const targetList: string[] = [];
							const metadataList: any[] = [];

							for (let num = 0; num < quantity; num++) {
								console.log("num: ", num);
								targetList.push(receiveAddress);
								metadataList.push({
									uris: displayImageUris,
									meta_uris: metadataUris,
									license_uris: licenseUris,
									hash: Buffer.from(imageHash).toString('hex'),
									meta_hash: Buffer.from(metadataHash).toString('hex'),
									license_hash: Buffer.from(licenseHash).toString('hex'),
									edition_number: num,
									edition_total: quantity,
								});
							}

							console.log("metadata_list: ", metadataList);



							const response: MintBulkResponse = await mintBulk({
								walletId: mintWallet,
								metadataList,
								royaltyPercentage: royaltyPercentage * 100,
								royaltyAddress: media.paymentAddress,
								targetList,
								mintFromDid: true,
								fee,
								reusePuzhash: false,
							} as MintBulkRequest);

							console.log("mint response: ", response);

							const transaction = await pushTx({
								spendBundle: response.spendBundle,
							} as PushTxRequest);

							console.log("transaction: ", transaction);

							// await invoke("gosti_bulk_nft_mint", {
							// 	params: {
							// 		quantity,
							// 		batchSize,
							// 		imageUris: displayImageUris,
							// 		metadataUris,
							// 		licenseUris,
							// 		publisherDid: media.publisherDid,
							// 		receiveAddress,
							// 		royaltyAddress,
							// 		royaltyPercentage,
							// 		fee,
							// 		salePrice: price,
							// 	}
							// } as MintNftCopiesRequest);
						}}>
							Start Minting
						</Button>
					</Grid>
					<Grid key={`${media.productId}mint desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {
							setNoticeTitle("Minting");
							setNoticeMessage("Minting will take a while. Please be patient.");
							setOpenNotice(true);
						}}>
							<InfoIcon />
						</IconButton>
					</Grid>
				</Grid>
				<Modal
					open={openNotice}
					onClose={() => { setOpenNotice(false); }}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={infoModalStyle}>
						<Typography id="modal-modal-title" variant="h6" component="h2">
							{noticeTitle}
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							{noticeMessage}
						</Typography>
					</Box>
				</Modal>
			</Paper>
		</Dialog >
	);
};

