import { Buffer } from 'buffer';

import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { Autocomplete, Box, Button, Fab, Grid, IconButton, Modal, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

import MainTopBar from "./components/MainTopBar";
import { ProductList } from "./components/ProductList";
import { errorModalStyle, infoModalStyle, successModalStyle } from "./gosti-shared/constants";
import { useWalletConnect } from './gosti-shared/contexts/WalletConnectContext';
import { useWalletConnectRpc } from './gosti-shared/contexts/WalletConnectRpcContext';
import { Media } from "./gosti-shared/types/gosti/Media";
import { BatchUpdateRequest } from './gosti-shared/types/walletconnect/rpc/BatchUpdate';
import { CreateDataStoreRequest } from './gosti-shared/types/walletconnect/rpc/CreateDataStore';
import { GetKeysValuesRequest, GetKeysValuesResponse } from './gosti-shared/types/walletconnect/rpc/GetKeysValues';
import { GetOwnedStoresRequest } from './gosti-shared/types/walletconnect/rpc/GetOwnedStores';
import { GetRootRequest, GetRootResponse } from './gosti-shared/types/walletconnect/rpc/GetRoot';
import { RequestPermissionsRequest } from './gosti-shared/types/walletconnect/rpc/RequestPermissions';

export const App = () => {

	const {
		client,
		pairings,
		session,
		connect,
		disconnect,
	} = useWalletConnect();

	const {
		getOwnedStores,
		createDataStore,
		getRoot,
		getKeysValues,
		batchUpdate,
		requestPermissions,
	} = useWalletConnectRpc();

	const onConnect = () => {
		if (typeof client === "undefined") {
			throw new Error("WalletConnect is not initialized");
		}
		// Suggest existing pairings (if any).
		if (pairings.length) {
			connect(pairings[pairings.length - 1]);
		} else {
			// If no existing pairings are available, trigger `WalletConnectClient.connect`.
			connect();
		}
	};

	const [dataStoreId, setDataStoreId] = useState<string>();
	const [dataStoreList, setDataStoreList] = useState<string[]>([]);
	const [productList, setProductList] = useState<Media[]>([]);

	const [openFeeInfo, setOpenFeeInfo] = useState(false);

	const [openCommitStatusSuccess, setOpenCommitStatusSuccess] = useState(false);
	const [openCommitStatusFailed, setOpenCommitStatusFailed] = useState(false);
	const [openCreatingDataStore, setOpenCreatingDataStore] = useState(false);
	const [commitTransactionId, setCommitTransactionId] = useState("");

	const [transactionFee, setTransactionFee] = useState<number>(500);

	useEffect(() => {
		const getIds = async () => {
			const resp = await requestPermissions({ commands: ['getOwnedStores', 'getDIDInfo', 'getRoot', 'getKeysValues'] } as RequestPermissionsRequest);
			console.log("requestPermissions response", resp);
			const response = await getOwnedStores({} as GetOwnedStoresRequest);
			setDataStoreList(response.storeIds);
		};
		if (dataStoreList && dataStoreList.length === 0) {
			console.log("dataStore list ", dataStoreList);
			getIds();
		} else {
			console.log("dataStore list ", dataStoreList);
		}

	}, [dataStoreList, getOwnedStores, requestPermissions, setDataStoreList]);

	useEffect(() => {
		const getProducts = async (id: string) => {
			const root: GetRootResponse = await getRoot({ id } as GetRootRequest);
			const entries: GetKeysValuesResponse = await getKeysValues({ id, rootHash: root.hash } as GetKeysValuesRequest);
			setProductList(entries.keysValues.map((entry: any) => JSON.parse(Buffer.from(entry.value.split('x')[1], 'hex').toString('utf-8'))));
		};
		if (dataStoreId !== undefined) {
			getProducts(dataStoreId);
		}

	}, [dataStoreId, getKeysValues, getRoot]);

	const updateDataStore = async (media: Media) => {

		const root: GetRootResponse = await getRoot({ id: dataStoreId } as GetRootRequest);

		console.log("root", root);

		const entries: GetKeysValuesResponse = await getKeysValues({ id: dataStoreId, rootHash: root.hash } as GetKeysValuesRequest);

		console.log("entries", entries);

		console.log("media", media);
		if (entries.keysValues.length === 0) {
			const changelist = [
				{
					"action": "insert",
					"key": Buffer.from(media.productId).toString('hex'),
					"value": Buffer.from(JSON.stringify(media)).toString('hex'),
				},
			];
			console.log("changelist", changelist, media);

			batchUpdate({ id: dataStoreId, changelist, fee: transactionFee } as BatchUpdateRequest).then((response) => {
				console.log("batch update response", response);
				if (response && response.success) {
					setOpenCommitStatusSuccess(true);
					setCommitTransactionId(response.txId);
				}
				else {
					setOpenCommitStatusFailed(true);
				}
			});
		} else {
			entries.keysValues.forEach((entry: any) => {
				const productId = Buffer.from(entry.key.split('x')[1], 'hex').toString('utf-8');
				console.log("productId", productId, media.productId);
				if (productId === media.productId) {
					console.log("found product", productId);

					const changelist = [
						{
							"action": "delete",
							"key": Buffer.from(media.productId).toString('hex'),
						},
						{
							"action": "insert",
							"key": Buffer.from(media.productId).toString('hex'),
							"value": Buffer.from(JSON.stringify(media)).toString('hex'),
						},
					];
					console.log("changelist", changelist, media);

					batchUpdate({ id: dataStoreId, changelist, fee: transactionFee } as BatchUpdateRequest).then((response) => {
						console.log("batch update response", response);
						if (response && response.success) {
							setOpenCommitStatusSuccess(true);
							setCommitTransactionId(response.txId);
						}
						else {
							setOpenCommitStatusFailed(true);
						}
					});
				} else {
					console.log("Product found", productId);
					setOpenCommitStatusFailed(true);
				}
			});
		}
	};

	return (
		<Box>
			{MainTopBar(session, onConnect, disconnect)}
			<Paper elevation={1} sx={{ m: 2 }}>
				<Typography sx={{ p: 2 }} variant="h4">Product Datastores</Typography>
				<Grid container p={4} id="medialist">
					<Grid key={"dataStore select"} item xs={8}>
						<Autocomplete
							id="asset-combo-box"
							options={dataStoreList}
							sx={{ width: '100%' }}
							renderInput={(params) => <TextField {...params} label="DataStore ID" />}
							filterOptions={(options, state) => options.filter((option) => option.toLowerCase().includes(state.inputValue.toLowerCase()))}
							onChange={(event: any, value: string | null) => {
								console.log(value);
								if (value) {
									setDataStoreId(value);
								}
							}}
						/>
					</Grid>
					<Grid key={"dataStore create"} item xs={4}>
						<Button variant="contained" sx={{ p: 2 }} onClick={async () => {
							const response = await createDataStore({ fee: transactionFee } as CreateDataStoreRequest);
							console.log("Created Datastore", response);
							setDataStoreList(dataStoreList.concat([response.id]));
							setDataStoreId(response.id);
							setOpenCreatingDataStore(true);
						}}>
							Create New DataStore
						</Button>
					</Grid>
					<Grid key={"Transaction Fee"} item xs={12}>
						<TextField id="Transaction fee tf" variant="filled" type="number" label="Transaction Fee (mojo)" value={transactionFee} onChange={(e) => {
							const regex = /^[0-9\b]+$/;
							if (e.target.value === "" || regex.test(e.target.value)) {
								setTransactionFee(Number(e.target.value));
							}
						}
						} />
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
									Transaction Fee
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									Creating a Datastore and creating/updating a product require an on-chain transaction. This optional fee can help speed up your transaction if traffic is high. Fee is in mojo (1 XCH = 1,000,000,000,000 mojo)
								</Typography>
							</Box>
						</Modal>
					</Grid>
				</Grid>

				{ProductList("Your Products", productList, dataStoreId as string, updateDataStore,)}
				<Fab sx={{ margin: 0, top: 'auto', right: 20, bottom: 20, left: 'auto', position: 'fixed' }} aria-label="add" color="primary" disabled={dataStoreId === undefined} onClick={async () => {
					setProductList(productList.concat([{ productId: uuid() } as Media]));
				}}><AddIcon /></Fab>
			</Paper>
			<Modal
				open={openCommitStatusSuccess}
				onClose={() => { setOpenCommitStatusSuccess(false); }}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={successModalStyle}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Commit Successful
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Your update has been committed to your dataStore! Check your wallet, it may take up to a few minutes for the transaction to be confirmed.
						(Transaction Id: {commitTransactionId})
					</Typography>
				</Box>
			</Modal>
			<Modal
				open={openCommitStatusFailed}
				onClose={() => { setOpenCommitStatusFailed(false); }}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={errorModalStyle}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Commit Failed
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Your commit failed. Possible reasons are: <ul><li>There are no changes</li><li>There is already a pending update to your dataStore</li><li>You do not have enough XCH in your wallet</li><li>There was an issue connecting to your wallet</li></ul> Please check your wallet and try again.
					</Typography>
				</Box>
			</Modal>
			<Modal
				open={openCreatingDataStore}
				onClose={() => { setOpenCreatingDataStore(false); }}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={successModalStyle}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Creating DataStore
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Please check your wallet to ensure the transaction is confirmed.
					</Typography>
				</Box>
			</Modal>
		</Box>
	);
};

