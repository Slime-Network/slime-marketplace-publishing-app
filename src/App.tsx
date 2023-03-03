import { useEffect, useState } from "react";
import './App.css';

import { Autocomplete, Box, Button, Fab, Grid, Modal, Paper, TextField, Typography } from "@mui/material";
import MainTopBar from "./components/MainTopBar";
import { Media } from "./spriggan-shared/types/Media";
import AddIcon from '@mui/icons-material/Add';

import { useWalletConnectClient } from "./chia-walletconnect/WalletConnectClientContext";
import { useWalletConnectRpc } from "./chia-walletconnect/WalletConnectRpcContext";
import { ProductList } from "./components/ProductList";

import { SprigganRPCParams, useSprigganRpc } from "./spriggan-shared/contexts/SprigganRpcContext";
import { v4 as uuid } from 'uuid';
import { errorModalStyle, successModalStyle } from "./spriggan-shared/constants";

export const App = () => {

	// Initialize the WalletConnect client.
	const {
		client,
		pairings,
		session,
		connect,
		disconnect,
		isInitializing,
	} = useWalletConnectClient();

	// Use `JsonRpcContext` to provide us with relevant RPC methods and states.
	const {
		ping,
		walletconnectRpc,
	} = useWalletConnectRpc();

	useEffect(() => {
		async function testConnection() {
			try {
				const connected = await ping();
				if (!connected) {
					disconnect()
				}
				return connected
			} catch (e) {
				console.log("ping fail", e)
				disconnect();
			}
		}

		if (!isInitializing) {
			testConnection()
		}

		const interval = setInterval(() => {
			// This will run every 10 mins
			console.log("Ping: ", testConnection());
		}, 1000 * 60 * 1);

		return () => clearInterval(interval)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	const onConnect = () => {
		if (typeof client === "undefined") {
			throw new Error("WalletConnect is not initialized");
		}
		// Suggest existing pairings (if any).
		if (pairings.length) {
			connect(pairings[pairings.length-1]);
		} else {
			// If no existing pairings are available, trigger `WalletConnectClient.connect`.
			connect();
		}
	};

	const {
		sprigganRpc,
		sprigganRpcResult,
	} = useSprigganRpc();
	
	const [datastoreId, setDatastoreId] = useState<string>();
	const [datastoreList, setDatastoreList] = useState<string[]>([]);
	const [productList, setProductList] = useState<Media[]>([]);

	const [openCommitStatusSuccess, setOpenCommitStatusSuccess] = useState(false);
	const [openCommitStatusFailed, setOpenCommitStatusFailed] = useState(false);
	const [commitTransactionId, setCommitTransactionId] = useState("");

	useEffect(() => {
		const getIds = async() => {
			await sprigganRpc.getOwnedDatastores({} as SprigganRPCParams);
		}
		if (datastoreList && datastoreList.length === 0) {
			console.log("datastore list ", datastoreList)
			getIds()
		}
	}, [datastoreList]);
	
	useEffect(() => {
		if (sprigganRpcResult) {
			if (sprigganRpcResult.method === "getOwnedDatastores") {
				console.log("getOwnedDatastores", sprigganRpcResult);
				setDatastoreList(sprigganRpcResult.result);
			} else if (sprigganRpcResult.method === "getPublishedMedia") {
				console.log(sprigganRpcResult.result);
				
				setProductList(sprigganRpcResult.result)
			} else if (sprigganRpcResult.method === "createDatastore") {
				console.log("getOwnedDatastores", sprigganRpcResult);
				setDatastoreList(datastoreList.concat([sprigganRpcResult.result.id]));
				setDatastoreId(sprigganRpcResult.result.id);
			} else if (sprigganRpcResult.method === "publishMedia") {
				console.log("publishMedia", sprigganRpcResult);
				if (sprigganRpcResult.result && sprigganRpcResult.result.success) {
					setOpenCommitStatusSuccess(true);
					setCommitTransactionId(sprigganRpcResult.result.tx_id);
				}
				else {
					setOpenCommitStatusFailed(true);
				}
			} else if (sprigganRpcResult.method === "mintNftCopies") {
				console.log("mintCopies", sprigganRpcResult);
			} else if (sprigganRpcResult.method === "generateTorrents") {
				console.log("generateTorrents", sprigganRpcResult);
			}
		}
	}, [sprigganRpcResult]);

	useEffect(() => {
		const getProducts = async(id: string) => {
			console.log("datastore id", id)
			await sprigganRpc.getPublishedMedia({datastoreId: id} as SprigganRPCParams);
		}
		if (datastoreId !== undefined) {
			getProducts(datastoreId)
		}
	}, [datastoreId]);


	const updateDatastore = async (datastoreId: string, media: Media) => {
		await sprigganRpc.publishMedia({datastoreId: datastoreId, media: media} as SprigganRPCParams);
	}

	return (
		<Box>
			{MainTopBar(session, onConnect, disconnect)}
			<Paper elevation={1} sx={{ m:2 }}>
				<Typography sx={{ p:2 }} variant="h4">Datastore</Typography>
				<Grid container p={4} id="medialist">
					<Grid key={"datastore select"} item xs={9}>
						<Autocomplete
							id="asset-combo-box"
							options={datastoreList}
							sx={{ width: '100%' }}
							renderInput={(params) => <TextField {...params} label="Datastore ID" />}
							onChange={(_, newValue) => {
								console.log(newValue)
								if (newValue) {
									setDatastoreId(newValue);
								}
							}}
						/>
					</Grid>
					<Grid key={"datastore create"} item xs={3}>
						<Button variant="contained" sx={{ p:2 }} onClick={async () =>{
							await sprigganRpc.createDatastore({} as SprigganRPCParams);
						}}>
							Create New Datastore
						</Button>
					</Grid>
				</Grid>

				{ProductList("Your Products", productList, datastoreId as string, updateDatastore,)}
				<Fab sx={{ margin: 0, top: 'auto', right: 20, bottom: 20, left: 'auto', position: 'fixed' }} aria-label="add" color="primary" disabled={datastoreId === undefined} onClick={async () => {
					setProductList(productList.concat([{productId: uuid()} as Media]))
				}}><AddIcon /></Fab>
			</Paper>
			<Modal
				open={openCommitStatusSuccess}
				onClose={() => {setOpenCommitStatusSuccess(false)}}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				>
				<Box sx={successModalStyle}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Commit Successful
					</Typography>
					<Typography id="modal-modal-description" sx={{mt:2}}>
						Your update has been committed to your datastore! Check your wallet, it may take up to a few minutes for the transaction to be confirmed.
						(Transaction Id: {commitTransactionId})
					</Typography>
				</Box>
			</Modal>
			<Modal
				open={openCommitStatusFailed}
				onClose={() => {setOpenCommitStatusFailed(false)}}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				>
				<Box sx={errorModalStyle}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Commit Failed
					</Typography>
					<Typography id="modal-modal-description" sx={{mt:2}}>
						Your commit failed. Possible reasons are: <ul><li>There are no changes</li><li>There is already a pending update to your datastore</li><li>You do not have enough XCH in your wallet</li><li>There was an issue connecting to your wallet</li></ul> Please check your wallet and try again.
					</Typography>
				</Box>
			</Modal>
		</Box>
	);
}

