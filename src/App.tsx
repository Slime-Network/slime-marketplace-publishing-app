import AddIcon from '@mui/icons-material/Add';
import { Autocomplete, Box, Button, Fab, Grid, Modal, Paper, TextField, Typography } from "@mui/material";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

import MainTopBar from "./components/MainTopBar";
import { ProductList } from "./components/ProductList";
import { errorModalStyle, successModalStyle } from "./gosti-shared/constants";
// import { useJsonRpc } from './gosti-shared/contexts/JsonRpcContext';
import { useWalletConnect } from './gosti-shared/contexts/WalletConnectContext';
import { CreateDataStoreRequest, GetOwnedDataStoresRequest, GetPublishedMediaRequest, PublishMediaRequest } from './gosti-shared/types/gosti/GostiRpcTypes';
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
			const response = await invoke<any>("make_chia_rpc_call", { command: "get_owned_stores", params: {} as GetOwnedDataStoresRequest });
			setDataStoreList(response.store_ids);
		};
		if (dataStoreList && dataStoreList.length === 0) {
			console.log("dataStore list ", dataStoreList);
			getIds();
		} else {
			console.log("dataStore list ", dataStoreList);
		}

	}, [dataStoreList, setDataStoreList]);

	useEffect(() => {
		const getProducts = async (id: string) => {
			console.log("getting products", id);
			const response = await invoke<any>("get_published_media", { params: { dataStoreId: id } as GetPublishedMediaRequest });
			console.log("products", response);
			setProductList(response.media);
		};
		if (dataStoreId !== undefined) {
			getProducts(dataStoreId);
		}

	}, [dataStoreId]);

	const updateDataStore = async (media: Media) => {
		const response = await invoke<any>("publish_media", { params: { dataStoreId, media, fee: transactionFee } as PublishMediaRequest });
		if (response && response.message) {
			setOpenCommitStatusSuccess(true);
			setCommitTransactionId(response.message);
		}
		else {
			setOpenCommitStatusFailed(true);
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
							const response = await invoke<any>("make_chia_rpc_call", { command: "create_data_store", params: { fee: transactionFee } as CreateDataStoreRequest });
							console.log("Created Datastore", response);
							setDataStoreList(dataStoreList.concat([response.id]));
							setDataStoreId(response.dataStoreId);
							setOpenCreatingDataStore(true);
						}}>
							Create New DataStore
						</Button>
					</Grid>
					<Grid key={"Transaction Fee"} item xs={3}>
						<TextField id="Transaction fee tf" variant="filled" type="number" label="Transaction Fee (mojo)" value={transactionFee} onChange={(e) => {
							const regex = /^[0-9\b]+$/;
							if (e.target.value === "" || regex.test(e.target.value)) {
								setTransactionFee(Number(e.target.value));
							}
						}
						} />
					</Grid>
					<Grid key={"Transaction Fee"} item xs={9}>
						<Typography>Creating a Datastore and updating a product require an on-chain transaction. This optional fee can help speed up your transactions.</Typography>
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

