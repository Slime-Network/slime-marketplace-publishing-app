import AddIcon from '@mui/icons-material/Add';
import { Autocomplete, Box, Button, Fab, Grid, Modal, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

import MainTopBar from "./components/MainTopBar";
import { ProductList } from "./components/ProductList";
import { errorModalStyle, successModalStyle } from "./gosti-shared/constants";
// import { useJsonRpc } from './gosti-shared/contexts/JsonRpcContext';
import { useGostiRpc } from "./gosti-shared/contexts/GostiRpcContext";
import { useWalletConnect } from './gosti-shared/contexts/WalletConnectContext';
import { CreateDataStoreRequest, CreateDataStoreResponse, GetOwnedDataStoresRequest, GetOwnedDataStoresResponse, GetPublishedMediaRequest, GetPublishedMediaResponse, PublishMediaRequest, PublishMediaResponse } from './gosti-shared/types/gosti/GostiRpcTypes';
import { Media } from "./gosti-shared/types/gosti/Media";

export const App = () => {

	const {
		client,
		pairings,
		session,
		connect,
		disconnect,
	} = useWalletConnect();

	// const {

	// } = useJsonRpc();

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

	const {
		getOwnedDataStores,
		getPublishedMedia,
		publishMedia,
		createDataStore,
		getConfig,
		saveConfig,
		config,
		gostiRpcResult,
	} = useGostiRpc();

	const [dataStoreId, setDataStoreId] = useState<string>();
	const [dataStoreList, setDataStoreList] = useState<string[]>([]);
	const [productList, setProductList] = useState<Media[]>([]);

	const [openCommitStatusSuccess, setOpenCommitStatusSuccess] = useState(false);
	const [openCommitStatusFailed, setOpenCommitStatusFailed] = useState(false);
	const [openCreatingDataStore, setOpenCreatingDataStore] = useState(false);
	const [commitTransactionId, setCommitTransactionId] = useState("");

	const [transactionFee, setTransactionFee] = useState<number>(500);

	useEffect(() => {
		const getIds = async () => {
			await getOwnedDataStores({} as GetOwnedDataStoresRequest);
			getConfig({} as GetOwnedDataStoresRequest);
		};
		if (dataStoreList && dataStoreList.length === 0) {
			console.log("dataStore list ", dataStoreList);
			getIds();
		} else {
			console.log("dataStore list ", dataStoreList);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- can't include gostiRpc
	}, [dataStoreList, setDataStoreList]);

	useEffect(() => {
		if (gostiRpcResult) {
			if (gostiRpcResult.method === "getOwnedDataStores") {
				console.log("getOwnedDataStores", gostiRpcResult);
				const response = gostiRpcResult.result as GetOwnedDataStoresResponse;
				setDataStoreList(response.dataStoreIds);
			} else if (gostiRpcResult.method === "getPublishedMedia") {
				console.log("getPublishedMedia", gostiRpcResult.result);
				const response = gostiRpcResult.result as GetPublishedMediaResponse;
				setProductList(response.media);
			} else if (gostiRpcResult.method === "createDataStore") {
				console.log("createDataStore", gostiRpcResult);
				const response = gostiRpcResult.result as CreateDataStoreResponse;
				setDataStoreList(dataStoreList.concat([response.dataStoreId]));
				setDataStoreId(response.dataStoreId);
			} else if (gostiRpcResult.method === "publishMedia") {
				console.log("publishMedia", gostiRpcResult);
				const response = gostiRpcResult.result as PublishMediaResponse;
				if (response && response.message) {
					setOpenCommitStatusSuccess(true);
					setCommitTransactionId(response.message);
				}
				else {
					setOpenCommitStatusFailed(true);
				}
			} else if (gostiRpcResult.method === "getConfig") {
				console.log("getConfig", gostiRpcResult);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- cab't include dataStore list
	}, [gostiRpcResult]);

	useEffect(() => {
		const getProducts = async (id: string) => {
			console.log("getting products", id);
			await getPublishedMedia({ dataStoreId: id } as GetPublishedMediaRequest);
		};
		if (dataStoreId !== undefined) {
			getProducts(dataStoreId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- can't include gostiRpc
	}, [dataStoreId]);

	// useEffect(() => {
	// 	if (walletconnectRpcResult) {
	// 		if (walletconnectRpcResult.method === "createDataStore") {
	// 			console.log("createDataStore", walletconnectRpcResult);
	// 		}
	// 	}
	// }, [walletconnectRpcResult]);

	const updateDataStore = async (media: Media) => {
		await publishMedia({ dataStoreId, media, fee: transactionFee } as PublishMediaRequest);
	};

	return (
		<Box>
			{MainTopBar(session, onConnect, disconnect)}
			<Paper elevation={1} sx={{ m: 2 }}>
				<Typography sx={{ p: 2 }} variant="h4">DataStore</Typography>
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
							// const fingerprint = session?.namespaces.chia.accounts[0].split(":")[2];
							// await walletconnectRpc.createDataStore({ fingerprint, fee: transactionFee } as WalletConnectRpcParams);
							await createDataStore({ fee: transactionFee } as CreateDataStoreRequest);
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
					</Grid>
				</Grid>

				{ProductList("Your Products", productList, dataStoreId as string, config, saveConfig, updateDataStore,)}
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
						Please check your wallet, wait for the transaction to go through, then refresh the page to find your dataStore in the dropdown
					</Typography>
				</Box>
			</Modal>
		</Box>
	);
};

