import AddIcon from '@mui/icons-material/Add';
import { Autocomplete, Box, Button, Fab, Grid, Modal, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

import { useWalletConnectClient } from "./chia-walletconnect/contexts/WalletConnectClientContext";
import { useWalletConnectRpc } from "./chia-walletconnect/contexts/WalletConnectRpcContext";
import MainTopBar from "./components/MainTopBar";
import { ProductList } from "./components/ProductList";
import { errorModalStyle, successModalStyle } from "./spriggan-shared/constants";
import { SprigganRPCParams, useSprigganRpc } from "./spriggan-shared/contexts/SprigganRpcContext";
import { Media } from "./spriggan-shared/types/Media";

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
	} = useWalletConnectRpc();

	useEffect(() => {
		async function testConnection() {
			try {
				const connected = await ping();
				if (!connected) {
					disconnect();
				}
				return connected;
			} catch (e) {
				console.log("ping fail", e);
				disconnect();
				return null;
			}
		}

		if (!isInitializing) {
			testConnection();
		}

		const interval = setInterval(() => {
			console.log("Ping WalletConnect: ", testConnection());
		}, 1000 * 60 * 1);

		return () => clearInterval(interval);
	}, [session, disconnect, isInitializing, ping]);

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
		sprigganRpc,
		sprigganRpcResult,
	} = useSprigganRpc();

	const [datastoreId, setDatastoreId] = useState<string>();
	const [datastoreList, setDatastoreList] = useState<string[]>([]);
	const [productList, setProductList] = useState<Media[]>([]);

	const [openCommitStatusSuccess, setOpenCommitStatusSuccess] = useState(false);
	const [openCommitStatusFailed, setOpenCommitStatusFailed] = useState(false);
	const [openCreatingDatastore, setOpenCreatingDatastore] = useState(false);
	const [commitTransactionId, setCommitTransactionId] = useState("");

	const [createDatastoreFee,] = useState<number>(500);


	useEffect(() => {
		const getIds = async () => {
			await sprigganRpc.getOwnedDatastores({} as SprigganRPCParams);
		};
		if (datastoreList && datastoreList.length === 0) {
			console.log("datastore list ", datastoreList);
			getIds();
		}
	}, [datastoreList, sprigganRpc]);

	useEffect(() => {
		if (sprigganRpcResult) {
			if (sprigganRpcResult.method === "getOwnedDatastores") {
				console.log("getOwnedDatastores", sprigganRpcResult);
				setDatastoreList(sprigganRpcResult.result);
			} else if (sprigganRpcResult.method === "getPublishedMedia") {
				console.log(sprigganRpcResult.result);

				setProductList(sprigganRpcResult.result);
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
	}, [datastoreList, sprigganRpcResult]);

	useEffect(() => {
		const getProducts = async (id: string) => {
			console.log("datastore id", id);
			await sprigganRpc.getPublishedMedia({ datastoreId: id } as SprigganRPCParams);
		};
		if (datastoreId !== undefined) {
			getProducts(datastoreId);
		}
	}, [datastoreId, sprigganRpc]);


	const updateDatastore = async (media: Media) => {
		await sprigganRpc.publishMedia({ datastoreId, media } as SprigganRPCParams);
	};

	return (
		<Box>
			{MainTopBar(session, onConnect, disconnect)}
			<Paper elevation={1} sx={{ m: 2 }}>
				<Typography sx={{ p: 2 }} variant="h4">Datastore</Typography>
				<Grid container p={4} id="medialist">
					<Grid key={"datastore select"} item xs={9}>
						<Autocomplete
							id="asset-combo-box"
							options={datastoreList}
							sx={{ width: '100%' }}
							renderInput={(params) => <TextField {...params} label="Datastore ID" />}
							onChange={(event: any, value: string | null) => {
								console.log(value);
								if (value) {
									setDatastoreId(value);
								}
							}}
						/>
					</Grid>
					<Grid key={"datastore create"} item xs={3}>
						<Button variant="contained" sx={{ p: 2 }} onClick={async () => {
							await sprigganRpc.createDatastore({} as SprigganRPCParams);
						}}>
							Create New Datastore
						</Button>
					</Grid>
					<Grid key={"datastore create fee"} item xs={3}>
						<TextField variant="filled" sx={{ p: 2 }} label="Fee (mojo)" value={createDatastoreFee} />
					</Grid>
				</Grid>

				{ProductList("Your Products", productList, datastoreId as string, updateDatastore,)}
				<Fab sx={{ margin: 0, top: 'auto', right: 20, bottom: 20, left: 'auto', position: 'fixed' }} aria-label="add" color="primary" disabled={datastoreId === undefined} onClick={async () => {
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
						Your update has been committed to your datastore! Check your wallet, it may take up to a few minutes for the transaction to be confirmed.
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
						Your commit failed. Possible reasons are: <ul><li>There are no changes</li><li>There is already a pending update to your datastore</li><li>You do not have enough XCH in your wallet</li><li>There was an issue connecting to your wallet</li></ul> Please check your wallet and try again.
					</Typography>
				</Box>
			</Modal>
			<Modal
				open={openCreatingDatastore}
				onClose={() => { setOpenCreatingDatastore(false); }}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={successModalStyle}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Creating Datastore
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Please check your wallet, wait for the transaction to go through, then refresh the page to find your datastore in the dropdown
					</Typography>
				</Box>
			</Modal>
		</Box>
	);
};

