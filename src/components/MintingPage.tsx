import * as React from 'react';
import {
	Grid, Dialog, Typography, Button,
	AppBar, Toolbar, Slide, IconButton,
	Autocomplete, TextField, SlideProps, Paper, Modal, Box, FormControlLabel, Switch, Link
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction } from 'react';

import type { Media } from '../spriggan-shared/types/Media';
import { infoModalStyle } from '../spriggan-shared/constants';
import { SprigganRPCParams, useSprigganRpc } from '../spriggan-shared/contexts/SprigganRpcContext';

const Transition = React.forwardRef((props: SlideProps, ref) => {
	return <Slide direction="up" ref={ref} {...props} />;
});

export type MintingPageProps = {
	media: Media;
	open: boolean,
	datastoreId: string,
	setOpen: Dispatch<SetStateAction<boolean>>
};

export default function MintingPage( props: MintingPageProps ) {

	const [displayImageUris, setDisplayImageUris] = React.useState<string[]>([]);
	const [metadataUris, setMetadataUris] = React.useState<string[]>([]);
	const [licenseUris, setLicenseUris] = React.useState<string[]>([]);
	const [iconUri, setIconUri] = React.useState("");
	const [bannerUri, setBannerUri] = React.useState("");
	const [quantity, setQuantity] = React.useState(100);
	const [batchSize, setBatchSize] = React.useState(25);
	const [edition, setEdition] = React.useState("Standard");
	const [royaltyAddress, setRoyaltyAddress] = React.useState(props.media.paymentAddress);
	const [royaltyPercentage, setRoyaltyPercentage] = React.useState(20);
	const [metadata, setMetadata] = React.useState("");

	const [generateOffers, setGenerateOffers] = React.useState(true);
	const [sensitiveContent, setSensitiveContent] = React.useState(false);
	const [price, setPrice] = React.useState(1.00);
	const [fee, setFee] = React.useState(50000);

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
	const [openGenerateOffersInfo, setOpenGenerateOffersInfo] = React.useState(false);
	const [openDisplayImageSensitiveContent, setOpenDisplayImageSensitiveContent] = React.useState(false);
	const [openPriceInfo, setOpenPriceInfo] = React.useState(false);
	const [openFeeInfo, setOpenFeeInfo] = React.useState(false);
	const [openMintInfo, setOpenMintInfo] = React.useState(false);
	

	

	const {
		sprigganRpc,
		sprigganRpcResult,
	} = useSprigganRpc();

	React.useEffect(() => {
		if (sprigganRpcResult) {
			if (sprigganRpcResult.method === "mintNftCopies") {
				console.log("mintCopies", sprigganRpcResult);
			} else if (sprigganRpcResult.method === "generateTorrents") {
				console.log("generateTorrents", sprigganRpcResult);
			}
		}
	}, [sprigganRpcResult]);

	React.useEffect(() => {
		setMetadata(JSON.stringify({
			"format": "CHIP-0007",
			"name": props.media.title + " - " + edition,
			"description": "A " + edition + " copy of " + props.media.title + " by " + props.media.creator,
			"sensitive_content": sensitiveContent,
			"collection": {
				"name": props.media.title,
				"id": props.media.productId,
				"attributes": [
					{
						"type": "media metadata format",
						"value": "Spriggan-1.0"
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
						"value": props.media.contentRating ? props.media.contentRating : ""
					},
					{
						"type": "content tags",
						"value": props.media.tags ? props.media.tags : ""
					},
					{
						"type": "publisher",
						"value": props.media.publisher ? props.media.publisher : ""
					},
					{
						"type": "creator",
						"value": props.media.creator ? props.media.creator : ""
					},
					{
						"type": "datastore id",
						"value": props.datastoreId
					},
					{
						"type": "website",
						"value": props.media.website ? props.media.website : ""
					},
					{
						"type": "twitter",
						"value": props.media.twitter ? props.media.twitter : ""
					},
					{
						"type": "discord",
						"value": props.media.discord ? props.media.discord : ""
					}
				]
			},
			"attributes": [
				{
					"trait_type": "edition",
					"value": edition
				}
			],
			"minting_tool": "Spriggan-1.0"
		}, null, 4));
		
	}, [iconUri, bannerUri, edition, sensitiveContent]);


	const handleClose = () => {
		props.setOpen(false);
	};
	
	return (
		<Dialog
			fullScreen
			open={props.open}
			onClose={handleClose}
			TransitionComponent={Transition}
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
					{props.media.title}
				</Typography>
			</Toolbar>
			</AppBar>
			<Paper elevation={3} sx={{ m:2, p:2 }}>
				<Grid container p={4} spacing={4} id="mint page">
					<Grid key={props.media.productId + "productId"} item xs={11}>
						<TextField id="productId-TextField" sx={{width: '100%'}} label="Product Id" disabled={true} variant="filled" value={props.media.productId}/>
					</Grid>
					<Grid key={props.media.productId + "productId desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenProductIdInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openProductIdInfo}
							onClose={() => {setOpenProductIdInfo(false)}}
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

					<Grid key={props.media.productId + "uri message"} item xs={11}>
						<Typography sx={{ mt: 2 }}>
							The Uris that go on chain, and in your metadata cannot be changed or updated. You should use a service like <Link href="https://www.arweave.org/">Arweave</Link> or  <Link href="https://ipfs.tech/">IPFS for data permanence</Link>
						</Typography>
					</Grid>


					<Grid key={props.media.productId + "DisplayImageUris"} item xs={11}>
						<Autocomplete
							multiple
							id={props.media.productId + "DisplayImageUris-outlined"}
							options={['']}
							freeSolo
							getOptionLabel={(option) => option}
							defaultValue={[]}
							filterSelectedOptions
							onChange={(event: any, values: string[]) => {setDisplayImageUris(values)}}
							renderInput={(params) => (
							<TextField
								{...params}
								label="Display Image Uris"
								placeholder="+"
							/>
							)}
						/>
					</Grid>
					<Grid key={props.media.productId + "DisplayImageUri desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenDisplayImageUriInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openDisplayImageUriInfo}
							onClose={() => {setOpenDisplayImageUriInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									A URI to the location of your the display image.
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={props.media.productId + "IconUri"} item xs={11}>
						<TextField id="IconUri-TextField" sx={{width: '100%'}} onChange={(event: any) => {setIconUri(event.target.value)}} label="Icon Uri" variant="filled" value={iconUri}/>
					</Grid>
					<Grid key={props.media.productId + "IconUri desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenIconUriInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openIconUriInfo}
							onClose={() => {setOpenIconUriInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={props.media.productId + "Banner"} item xs={11}>
						<TextField id="Banner-TextField" sx={{width: '100%'}} onChange={(event: any) => {setBannerUri(event.target.value)}} label="Banner Image Uri" variant="filled" value={bannerUri}/>
					</Grid>
					<Grid key={props.media.productId + "BannerUri desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenBannerUriInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openBannerUriInfo}
							onClose={() => {setOpenBannerUriInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>

					<Grid key={props.media.productId + "Quantity"} item xs={11}>
						<TextField id="Quantity-TextField" sx={{width: '100%'}}onChange={(event: any) => {setQuantity(event.target.value)}} label="Quantity" variant="filled" value={quantity}/>
					</Grid>
					<Grid key={props.media.productId + "Quantity desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenQuantityInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openQuantityInfo}
							onClose={() => {setOpenQuantityInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					
					<Grid key={props.media.productId + "BatchSize"} item xs={11}>
						<TextField id="BatchSize-TextField" sx={{width: '100%'}} onChange={(event: any) => {setBatchSize(event.target.value)}} label="Batch Size" variant="filled" value={batchSize}/>
					</Grid>
					<Grid key={props.media.productId + "BatchSize desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenBatchSizeInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openBatchSizeInfo}
							onClose={() => {setOpenBatchSizeInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>

					<Grid key={props.media.productId + "Edition"} item xs={11}>
						<TextField id="Edition-TextField" sx={{width: '100%'}} onChange={(event: any) => {setEdition(event.target.value)}} label="Edition" variant="filled" value={edition}/>
					</Grid>
					<Grid key={props.media.productId + "Edition desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenEditionInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openEditionInfo}
							onClose={() => {setOpenEditionInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={props.media.productId + "Royalty Address"} item xs={11}>
						<TextField id="Royalty Address-TextField" sx={{width: '100%'}} onChange={(event: any) => {setRoyaltyAddress(event.target.value)}} label="Royalty Address" variant="filled" value={royaltyAddress}/>
					</Grid>
					<Grid key={props.media.productId + "Royalty Address desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenRoyaltyAddressInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openRoyaltyAddressInfo}
							onClose={() => {setOpenRoyaltyAddressInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={props.media.productId + "Royalty Percentage"} item xs={11}>
						<TextField id="Royalty Percentage-TextField" sx={{width: '100%'}} onChange={(event: any) => {setRoyaltyPercentage(event.target.value)}} label="Royalty Percentage" variant="filled" value={royaltyPercentage}/>
					</Grid>
					<Grid key={props.media.productId + "Royalty Percentage desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenRoyaltyPercentageInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openRoyaltyPercentageInfo}
							onClose={() => {setOpenRoyaltyPercentageInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Display Image Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={props.media.productId + "sensitive"} item xs={12}>
						<FormControlLabel control={<Switch checked={sensitiveContent} onChange={() => setSensitiveContent(!sensitiveContent)} />} label="Display image contains sensitive content" />
					</Grid>


					<Grid key={props.media.productId + "Metadata"} item xs={11}>
						<TextField id="MetadataTextField" sx={{width: '100%'}} multiline maxRows={69} disabled={true} label="Metadata" variant="filled" value={metadata} />
					</Grid>
					<Grid key={props.media.productId + "Metadata desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenMetadataInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Button sx={{width: '100%'}} variant="contained" onClick={() => {
							navigator.clipboard.writeText(metadata)
						}}>
							Copy
						</Button>
						<Modal
							open={openMetadataInfo}
							onClose={() => {setOpenMetadataInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Metadata
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									
								</Typography>
							</Box>
						</Modal>
						<Typography variant="body2"></Typography>
					</Grid>
					<Grid key={props.media.productId + "MetadataUris"} item xs={11}>
						<Autocomplete
							multiple
							id={props.media.productId + "MetadataUris-outlined"}
							options={['']}
							freeSolo
							getOptionLabel={(option) => option}
							defaultValue={[]}
							filterSelectedOptions
							onChange={(event: any, values: string[]) => {setMetadataUris(values)}}
							renderInput={(params) => (
							<TextField
								{...params}
								label="Metadata Uris"
								placeholder="+"
							/>
							)}
						/>
					</Grid>
					<Grid key={props.media.productId + "MetadataUris desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenMetadataUriInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openMetadataUriInfo}
							onClose={() => {setOpenMetadataUriInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Metadata Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={props.media.productId + "LicenseUris"} item xs={11}>
						<Autocomplete
							multiple
							id={props.media.productId + "LicenseUris-outlined"}
							options={['']}
							freeSolo
							getOptionLabel={(option) => option}
							defaultValue={[]}
							filterSelectedOptions
							onChange={(event: any, values: string[]) => {setLicenseUris(values)}}
							renderInput={(params) => (
							<TextField
								{...params}
								label="License Uris"
								placeholder="+"
							/>
							)}
						/>
					</Grid>
					<Grid key={props.media.productId + "LicenseUris desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenLicenseUriInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openLicenseUriInfo}
							onClose={() => {setOpenLicenseUriInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									License Uri
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
									A URI to the location of your metadata
								</Typography>
							</Box>
						</Modal>
					</Grid>
					<Grid key={props.media.productId + "generateOffers"} item xs={12}>
						<FormControlLabel control={<Switch checked={generateOffers} onChange={() => setGenerateOffers(!generateOffers)} />} label="Generate Offer Files" />
					</Grid>
					{generateOffers && <>
						<Grid key={props.media.productId + "price"} item xs={11}>
							<TextField id="productIdTextField" sx={{width: '100%'}} label="Sale Price (XCH)" onChange={(event: any) => {setPrice(event.target.value)}} variant="filled" value={1.0}/>
						</Grid>
						<Grid key={props.media.productId + "price desc"} item xs={1}>
							<IconButton size="small" aria-label="info" onClick={() => {setOpenGenerateOffersInfo(true)}}>
								<InfoIcon />
							</IconButton>
							<Modal
								open={openPriceInfo}
								onClose={() => {setOpenGenerateOffersInfo(false)}}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description"
								>
								<Box sx={infoModalStyle}>
									<Typography id="modal-modal-title" variant="h6" component="h2">
										Price
									</Typography>
									<Typography id="modal-modal-description" sx={{mt:2}}>
										The price (in XCH) to sell for
									</Typography>
								</Box>
							</Modal>
						</Grid>
						</>
					}
					<Grid key={props.media.productId + "Fee"} item xs={11}>
							<TextField id="productIdTextField" sx={{width: '100%'}} label="Minting Fee (mojos)" onChange={(event: any) => {setFee(event.target.value)}} variant="filled" value={50000}/>
						</Grid>
						<Grid key={props.media.productId + "fee desc"} item xs={1}>
							<IconButton size="small" aria-label="info" onClick={() => {setOpenGenerateOffersInfo(true)}}>
								<InfoIcon />
							</IconButton>
							<Modal
								open={openPriceInfo}
								onClose={() => {setOpenGenerateOffersInfo(false)}}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description"
								>
								<Box sx={infoModalStyle}>
									<Typography id="modal-modal-title" variant="h6" component="h2">
										Price
									</Typography>
									<Typography id="modal-modal-description" sx={{mt:2}}>
										The price (in XCH) to sell for
									</Typography>
								</Box>
							</Modal>
						</Grid>
					<Grid key={props.media.productId + "Mint"} item xs={11}>
						<Button sx={{width: '100%'}} variant="contained" onClick={async() => {
							console.log("Starting Mint")
							const mintingConfig = {
								quantity: quantity,
								batchSize: batchSize,
								imageUris: displayImageUris,
								metadataUris: metadataUris,
								licenseUris: licenseUris,
								publisherDid: props.media.publisherDid,
								royaltyAddress: royaltyAddress,
								royaltyPercentage: royaltyPercentage,
								fee: fee,
								salePrice: price,
							}
							console.log(mintingConfig);
							

							await sprigganRpc.mintNftCopies({
								mintingConfig: mintingConfig
							} as SprigganRPCParams);
						}}>
							Start Minting
						</Button>
					</Grid>
					<Grid key={props.media.productId + "mint desc"} item xs={1}>
						<IconButton size="small" aria-label="info" onClick={() => {setOpenMintInfo(true)}}>
							<InfoIcon />
						</IconButton>
						<Modal
							open={openMintInfo}
							onClose={() => {setOpenMintInfo(false)}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							>
							<Box sx={infoModalStyle}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Start Minting
								</Typography>
								<Typography id="modal-modal-description" sx={{mt:2}}>
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

