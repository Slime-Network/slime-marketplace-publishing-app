import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import {
	Grid, Dialog, Typography, Button,
	AppBar, Toolbar, IconButton,
	Autocomplete, TextField, Paper, Modal, Box, FormControlLabel, Switch, Link
} from '@mui/material';
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import { infoModalStyle } from '../gosti-shared/constants';
import { useGostiRpc } from '../gosti-shared/contexts/GostiRpcContext';
import { MintNftCopiesRequest } from '../gosti-shared/types/gosti/GostiRpcTypes';
import type { Media } from '../gosti-shared/types/gosti/Media';

export type MintingPageProps = {
	media: Media;
	open: boolean,
	dataStoreId: string,
	setOpen: Dispatch<SetStateAction<boolean>>
};

export default function MintingPage(props: MintingPageProps) {
	const { media, open, dataStoreId, setOpen } = props;

	const [displayImageUris, setDisplayImageUris] = React.useState<string[]>([]);
	const [metadataUris, setMetadataUris] = React.useState<string[]>([]);
	const [licenseUris, setLicenseUris] = React.useState<string[]>([]);
	const [iconUri, setIconUri] = React.useState("");
	const [bannerUri, setBannerUri] = React.useState("");
	const [quantity, setQuantity] = React.useState(100);
	const [batchSize, setBatchSize] = React.useState(25);
	const [edition, setEdition] = React.useState("Standard");
	const [royaltyAddress, setRoyaltyAddress] = React.useState(media.paymentAddress);
	const [royaltyPercentage, setRoyaltyPercentage] = React.useState(20);
	const [metadata, setMetadata] = React.useState("");

	const [generateOffers, setGenerateOffers] = React.useState(true);
	const [sensitiveContent, setSensitiveContent] = React.useState(false);
	const [price, setPrice] = React.useState(1.00);
	const [fee, setFee] = React.useState(50_000);

	const [openProductIdInfo, setOpenProductIdInfo] = React.useState(false);
	const [openDisplayImageUriInfo, setOpenDisplayImageUriInfo] = React.useState(false);
	const [openIconUriInfo, setOpenIconUriInfo] = React.useState(false);
	const [openBannerUriInfo, setOpenBannerUriInfo] = React.useState(false);
	const [openQuantityInfo, setOpenQuantityInfo] = React.useState(false);
	const [openBatchSizeInfo, setOpenBatchSizeInfo] = React.useState(false);
	const [openEditionInfo, setOpenEditionInfo] = React.useState(false);
	const [openRoyaltyAddressInfo, setOpenRoyaltyAddressInfo] = React.useState(false);
	const [openRoyaltyPercentageInfo, setOpenRoyaltyPercentageInfo] = React.useState(false);
	const [openMetadataInfo, setOpenMetadataInfo] = React.useState(false);
	const [openMetadataUriInfo, setOpenMetadataUriInfo] = React.useState(false);
	const [openLicenseUriInfo, setOpenLicenseUriInfo] = React.useState(false);
	// const [openGenerateOffersInfo, setOpenGenerateOffersInfo] = React.useState(false);
	// const [openDisplayImageSensitiveContent, setOpenDisplayImageSensitiveContent] = React.useState(false);
	const [openPriceInfo, setOpenPriceInfo] = React.useState(false);
	const [openFeeInfo, setOpenFeeInfo] = React.useState(false);
	const [openMintInfo, setOpenMintInfo] = React.useState(false);

	const {
		mintNftCopies,
		gostiRpcResult,
	} = useGostiRpc();

	React.useEffect(() => {
		if (gostiRpcResult) {
			if (gostiRpcResult.method === "mintNftCopies") {
				console.log("mintCopies", gostiRpcResult);
			}
		}
	}, [gostiRpcResult]);

	React.useEffect(() => {
		setMetadata(JSON.stringify({
			"format": "CHIP-0007",
			"name": `${media.title} - ${edition}`,
			"description": `A ${edition} copy of ${media.title} by ${media.creator}`,
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
						"type": "publisher",
						"value": media.publisher ? media.publisher : ""
					},
					{
						"type": "creator",
						"value": media.creator ? media.creator : ""
					},
					{
						"type": "dataStore id",
						"value": dataStoreId
					},
					{
						"type": "website",
						"value": media.website ? media.website : ""
					},
					{
						"type": "twitter",
						"value": media.twitter ? media.twitter : ""
					},
					{
						"type": "discord",
						"value": media.discord ? media.discord : ""
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

					<Grid key={`${media.productId}uri message`} item xs={11}>
						<Typography sx={{ mt: 2 }}>
							The Uris that go on chain, and in your metadata cannot be changed or updated. You should use a service like <Link href="https://www.arweave.org/">Arweave</Link> or  <Link href="https://ipfs.tech/">IPFS for data permanence</Link>
						</Typography>
					</Grid>


					<Grid key={`${media.productId}DisplayImageUris`} item xs={11}>
						<Autocomplete
							multiple
							id={`${media.productId}DisplayImageUris-outlined`}
							options={['']}
							freeSolo
							getOptionLabel={(option: any) => option}
							defaultValue={[]}
							filterSelectedOptions
							onChange={(event: any, values: string[]) => { setDisplayImageUris(values); }}
							renderInput={(params: any) => (
								<TextField
									{...params}
									label="Display Image Uris"
									placeholder="+"
								/>
							)}
						/>
					</Grid>
					<Grid key={`${media.productId}DisplayImageUri desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenDisplayImageUriInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openDisplayImageUriInfo}
							onClose={() => { setOpenDisplayImageUriInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									A URI to the location of your the display image.
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={`${media.productId}IconUri`} item xs={11}>
						<TextField id="IconUri-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setIconUri(event.target.value); }} label="Icon Uri" variant="filled" value={iconUri} />
					</Grid>
					<Grid key={`${media.productId}IconUri desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenIconUriInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openIconUriInfo}
							onClose={() => { setOpenIconUriInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={`${media.productId}Banner`} item xs={11}>
						<TextField id="Banner-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setBannerUri(event.target.value); }} label="Banner Image Uri" variant="filled" value={bannerUri} />
					</Grid>
					<Grid key={`${media.productId}BannerUri desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenBannerUriInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openBannerUriInfo}
							onClose={() => { setOpenBannerUriInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>

					<Grid key={`${media.productId}Quantity`} item xs={11}>
						<TextField id="Quantity-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setQuantity(event.target.value); }} label="Quantity" variant="filled" value={quantity} />
					</Grid>
					<Grid key={`${media.productId}Quantity desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenQuantityInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openQuantityInfo}
							onClose={() => { setOpenQuantityInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>

					<Grid key={`${media.productId}BatchSize`} item xs={11}>
						<TextField id="BatchSize-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setBatchSize(event.target.value); }} label="Batch Size" variant="filled" value={batchSize} />
					</Grid>
					<Grid key={`${media.productId}BatchSize desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenBatchSizeInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openBatchSizeInfo}
							onClose={() => { setOpenBatchSizeInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>

					<Grid key={`${media.productId}Edition`} item xs={11}>
						<TextField id="Edition-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setEdition(event.target.value); }} label="Edition" variant="filled" value={edition} />
					</Grid>
					<Grid key={`${media.productId}Edition desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenEditionInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openEditionInfo}
							onClose={() => { setOpenEditionInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={`${media.productId}Royalty Address`} item xs={11}>
						<TextField id="Royalty Address-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setRoyaltyAddress(event.target.value); }} label="Royalty Address" variant="filled" value={royaltyAddress} />
					</Grid>
					<Grid key={`${media.productId}Royalty Address desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenRoyaltyAddressInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openRoyaltyAddressInfo}
							onClose={() => { setOpenRoyaltyAddressInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={`${media.productId}Royalty Percentage`} item xs={11}>
						<TextField id="Royalty Percentage-TextField" sx={{ width: '100%' }} onChange={(event: any) => { setRoyaltyPercentage(event.target.value); }} label="Royalty Percentage" variant="filled" value={royaltyPercentage} />
					</Grid>
					<Grid key={`${media.productId}Royalty Percentage desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenRoyaltyPercentageInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openRoyaltyPercentageInfo}
							onClose={() => { setOpenRoyaltyPercentageInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={`${media.productId}sensitive`} item xs={12}>
						<FormControlLabel control={<Switch checked={sensitiveContent} onChange={() => setSensitiveContent(!sensitiveContent)} />} label="Display image contains sensitive content" />
					</Grid>


					<Grid key={`${media.productId}Metadata`} item xs={11}>
						<TextField id="MetadataTextField" sx={{ width: '100%' }} multiline maxRows={69} disabled={true} label="Metadata" variant="filled" value={metadata} />
					</Grid>
					<Grid key={`${media.productId}Metadata desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenMetadataInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Button sx={{ width: '100%' }} variant="contained" onClick={() => {
							navigator.clipboard.writeText(metadata);
						}}>
							Copy
						</Button>
						<Modal
							open={openMetadataInfo}
							onClose={() => { setOpenMetadataInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Metadata
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>

								</Typography>
							</Box>
						</Modal>
						<Typography variant="body2"></Typography>
					</Grid>
					<Grid key={`${media.productId}MetadataUris`} item xs={11}>
						<Autocomplete
							multiple
							id={`${media.productId}MetadataUris-outlined`}
							options={['']}
							freeSolo
							getOptionLabel={(option: any) => option}
							defaultValue={[]}
							filterSelectedOptions
							onChange={(event: any, values: string[]) => { setMetadataUris(values); }}
							renderInput={(params: any) => (
								<TextField
									{...params}
									label="Metadata Uris"
									placeholder="+"
								/>
							)}
						/>
					</Grid>
					<Grid key={`${media.productId}MetadataUris desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenMetadataUriInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openMetadataUriInfo}
							onClose={() => { setOpenMetadataUriInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Metadata Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
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
									label="License Uris"
									placeholder="+"
								/>
							)}
						/>
					</Grid>
					<Grid key={`${media.productId}LicenseUris desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenLicenseUriInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openLicenseUriInfo}
							onClose={() => { setOpenLicenseUriInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									License Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={`${media.productId}generateOffers`} item xs={12}>
						<FormControlLabel control={<Switch checked={generateOffers} onChange={() => setGenerateOffers(!generateOffers)} />} label="Generate Offer Files" />
					</Grid>
					{generateOffers && <>
						<Grid key={`${media.productId}price`} item xs={11}>
							<TextField id="productIdTextField" sx={{ width: '100%' }} label="Sale Price (XCH)" onChange={(event: any) => { setPrice(event.target.value); }} variant="filled" value={1.0} />
						</Grid>
						<Grid key={`${media.productId}price desc`} item xs={1}>
							<IconButton size="small" aria-label="info" onClick={() => { setOpenPriceInfo(true); }}>
								<InfoIcon />
							</IconButton>
							<Modal
								open={openPriceInfo}
								onClose={() => { setOpenPriceInfo(false); }}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description"
							>
								<Box sx={infoModalStyle}>
									<Typography id="modal-modal-title" variant="h6" component="h2">
										Price
									</Typography>
									<Typography id="modal-modal-description" sx={{ mt: 2 }}>
										The price (in XCH) to sell each copy for
									</Typography>
								</Box>
							</Modal>
						</Grid>
					</>
					}
					<Grid key={`${media.productId}Fee`} item xs={11}>
						<TextField id="productIdTextField" sx={{ width: '100%' }} label="Minting Fee (mojos)" onChange={(event: any) => { setFee(event.target.value); }} variant="filled" value={50_000} />
					</Grid>
					<Grid key={`${media.productId}fee desc`} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => { setOpenFeeInfo(true); }}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openFeeInfo}
							onClose={() => { setOpenFeeInfo(false); }}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Fee
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									The fee (in mojo) for minting each spend bundle.
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={`${media.productId}Mint`} item xs={11}>
						<Button sx={{ width: '100%' }} variant="contained" onClick={async () => {
							console.log("Starting Mint");

							await mintNftCopies({
								mintingConfig: {
									quantity,
									batchSize,
									imageUris: displayImageUris,
									metadataUris,
									licenseUris,
									publisherDid: media.publisherDid,
									royaltyAddress,
									royaltyPercentage,
									fee,
									salePrice: price,
								}
							} as MintNftCopiesRequest);
						}}>
							Start Minting
						</Button>
					</Grid>
					<Grid key={`${media.productId}mint desc`} item xs={1}>
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
									Start Minting
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									Mint copies of your product for sale or distribution.
								</Typography>
							</Box>
						</Modal>
					</Grid>
				</Grid>
			</Paper>
		</Dialog>
	);
};

