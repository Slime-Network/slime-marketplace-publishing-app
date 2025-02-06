import { Buffer } from 'buffer';

import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { Autocomplete, Box, Button, Fab, IconButton, Paper, Stack, TextField, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import MainTopBar from './components/MainTopBar';
import ProductList from './components/ProductList';
import { InfoModal } from './slime-shared/components/InfoModal';
import { RatingsOrgs } from './slime-shared/constants/content-ratings';
import { useSlimeApi } from './slime-shared/contexts/SlimeApiContext';
import { useWalletConnect } from './slime-shared/contexts/WalletConnectContext';
import { useWalletConnectRpc } from './slime-shared/contexts/WalletConnectRpcContext';
import { Media } from './slime-shared/types/slime/Media';
import { BatchUpdateRequest } from './slime-shared/types/walletconnect/rpc/BatchUpdate';
import { CreateDataStoreRequest } from './slime-shared/types/walletconnect/rpc/CreateDataStore';
import { GetKeysValuesRequest, GetKeysValuesResponse } from './slime-shared/types/walletconnect/rpc/GetKeysValues';
import { GetOwnedStoresRequest } from './slime-shared/types/walletconnect/rpc/GetOwnedStores';
import { GetRootRequest, GetRootResponse } from './slime-shared/types/walletconnect/rpc/GetRoot';
import { RequestPermissionsRequest } from './slime-shared/types/walletconnect/rpc/RequestPermissions';

export const App = () => {
	const { client, pairings, session, connect, disconnect } = useWalletConnect();

	const { getOwnedStores, createDataStore, getRoot, getKeysValues, batchUpdate, requestPermissions } =
		useWalletConnectRpc();

	const { slimeConfig } = useSlimeApi();

	const onConnect = () => {
		if (typeof client === 'undefined') {
			throw new Error('WalletConnect is not initialized');
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

	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [infoModalTitle, setInfoModalTitle] = useState('');
	const [infoModalDescription, setInfoModalDescription] = useState('');
	const [infoModalStyle, setInfoModalStyle] = useState<'info' | 'success' | 'error'>('info');

	const [transactionFee, setTransactionFee] = useState<number>(500);

	useEffect(() => {
		const getIds = async () => {
			console.log('getting ids', session, client);
			const waitOneSecond = async () => {
				await new Promise((resolve) => {
					setTimeout(resolve, 1000);
				});
			};

			await waitOneSecond();
			console.log('getting ids2', session, client);

			const resp = await requestPermissions({
				commands: ['getOwnedStores', 'getDIDInfo', 'getRoot', 'getKeysValues'],
			} as RequestPermissionsRequest);
			console.log('requestPermissions response', resp);
			const response = await getOwnedStores({} as GetOwnedStoresRequest);
			setDataStoreList(response.storeIds);
		};
		if (dataStoreList && dataStoreList.length === 0) {
			console.log('dataStore list ', dataStoreList);
			getIds();
		} else {
			console.log('dataStore list ', dataStoreList);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- a
	}, [dataStoreList, getOwnedStores, requestPermissions, setDataStoreList]);

	useEffect(() => {
		const getProducts = async (id: string) => {
			const root: GetRootResponse = await getRoot({ id } as GetRootRequest);
			console.log('root', root, id);
			const entries: GetKeysValuesResponse = await getKeysValues({ id, rootHash: root.hash } as GetKeysValuesRequest);
			setProductList(
				entries.keysValues.map((entry: any) => JSON.parse(Buffer.from(entry.value.split('x')[1], 'hex').toString('utf-8')))
			);
		};
		if (dataStoreId !== undefined) {
			getProducts(dataStoreId);
		}
	}, [dataStoreId, getKeysValues, getRoot]);

	const updateDataStore = async (media: Media) => {
		const root: GetRootResponse = await getRoot({ id: dataStoreId } as GetRootRequest);

		const entries: GetKeysValuesResponse = await getKeysValues({
			id: dataStoreId,
			rootHash: root.hash,
		} as GetKeysValuesRequest);

		if (entries.keysValues.length === 0) {
			const changelist = [
				{
					action: 'insert',
					key: Buffer.from(media.productId).toString('hex'),
					value: Buffer.from(JSON.stringify(media)).toString('hex'),
				},
			];

			batchUpdate({ id: dataStoreId, changelist, fee: transactionFee } as BatchUpdateRequest).then((response) => {
				if (response && response.success) {
					setInfoModalOpen(true);
					setInfoModalTitle('Commit Successful');
					setInfoModalDescription(
						`Your update has been committed to your dataStore! Check your wallet, it may take up to a few minutes for the transaction to be confirmed. (Transaction Id: ${response.txId})`
					);
					setInfoModalStyle('success');
				} else {
					setInfoModalOpen(true);
					setInfoModalTitle('Commit Failed');
					setInfoModalDescription(
						'Your commit failed. Possible reasons are: There are no changes, there is already a pending update to your dataStore, you do not have enough XCH in your wallet, there was an issue connecting to your wallet. Please check your wallet and try again.'
					);
					setInfoModalStyle('error');
				}
			});
		} else {
			entries.keysValues.forEach((entry: any) => {
				const productId = Buffer.from(entry.key.split('x')[1], 'hex').toString('utf-8');
				if (productId === media.productId) {
					const changelist = [
						{
							action: 'delete',
							key: Buffer.from(media.productId).toString('hex'),
						},
						{
							action: 'insert',
							key: Buffer.from(media.productId).toString('hex'),
							value: Buffer.from(JSON.stringify(media)).toString('hex'),
						},
					];

					batchUpdate({ id: dataStoreId, changelist, fee: transactionFee } as BatchUpdateRequest).then((response) => {
						if (response && response.success) {
							setInfoModalOpen(true);
							setInfoModalTitle('Commit Successful');
							setInfoModalDescription(
								`Your update has been committed to your dataStore! Check your wallet, it may take up to a few minutes for the transaction to be confirmed. (Transaction Id: ${response.txId})`
							);
							setInfoModalStyle('success');
						} else {
							setInfoModalOpen(true);
							setInfoModalTitle('Commit Failed');
							setInfoModalDescription(
								'Your commit failed. Possible reasons are: There are no changes, there is already a pending update to your dataStore, you do not have enough XCH in your wallet, there was an issue connecting to your wallet. Please check your wallet and try again.'
							);
							setInfoModalStyle('error');
						}
					});
				} else {
					setInfoModalOpen(true);
					setInfoModalTitle('Product not found');
					setInfoModalDescription('The product you are trying to update does not exist in your dataStore');
					setInfoModalStyle('error');
				}
			});
		}
	};

	return (
		<Box>
			<MainTopBar session={session} connectToWallet={onConnect} disconnectFromWallet={disconnect} />
			<InfoModal open={infoModalOpen} setOpen={setInfoModalOpen} title={infoModalTitle} style={infoModalStyle}>
				{infoModalDescription}
			</InfoModal>
			<Paper elevation={1} sx={{ m: 2, p: 2 }}>
				<Stack spacing={2}>
					<Stack direction={'row'} spacing={2} maxWidth={'55rem'}>
						<Autocomplete
							id="asset-combo-box"
							options={dataStoreList}
							sx={{ width: '100%' }}
							renderInput={(params) => <TextField {...params} label="DataStore ID" />}
							filterOptions={(options, state) =>
								options.filter((option) => option.toLowerCase().includes(state.inputValue.toLowerCase()))
							}
							onChange={(event: any, value: string | null) => {
								if (value) {
									setDataStoreId(value);
								}
							}}
						/>
						<Button
							variant="contained"
							onClick={async () => {
								setInfoModalOpen(true);
								setInfoModalTitle('Creating DataStore');
								setInfoModalDescription('Please check your wallet to ensure the transaction is confirmed.');
								setInfoModalStyle('info');
								const response = await createDataStore({ fee: transactionFee } as CreateDataStoreRequest);
								setInfoModalOpen(false);
								setDataStoreList(dataStoreList.concat([response.id]));
								setDataStoreId(response.id);
							}}
						>
							Create New DataStore
						</Button>
					</Stack>
					<Stack direction={'row'} spacing={2} maxWidth={'35rem'}>
						<TextField
							id="Transaction fee tf"
							variant="filled"
							type="number"
							label="Transaction Fee (mojo)"
							value={transactionFee}
							onChange={(e) => {
								const regex = /^[0-9\b]+$/;
								if (e.target.value === '' || regex.test(e.target.value)) {
									setTransactionFee(Number(e.target.value));
								}
							}}
						/>
						<IconButton
							size="small"
							aria-label="info"
							onClick={() => {
								setInfoModalOpen(true);
								setInfoModalTitle('Transaction Fee');
								setInfoModalDescription(
									'Creating a Datastore and creating/updating a product require an on-chain transaction. This optional fee can help speed up your transaction if traffic is high. Fee is in mojo (1 XCH = 1,000,000,000,000 mojo)'
								);
							}}
						>
							<InfoIcon />
						</IconButton>
					</Stack>

					<ProductList
						title={'Your Products'}
						products={productList}
						dataStoreId={dataStoreId || ''}
						onExecuteUpdate={updateDataStore}
					/>
					<Tooltip title="Create New Product" aria-label="Create New Product">
						<Fab
							sx={{ margin: 0, top: 'auto', right: 20, bottom: 20, left: 'auto', position: 'fixed' }}
							aria-label="add"
							color="primary"
							disabled={dataStoreId === undefined}
							onClick={async () => {
								if (!slimeConfig) {
									setInfoModalOpen(true);
									setInfoModalTitle('No Slime Config Found');
									setInfoModalDescription('Please set up your profile.');
									setInfoModalStyle('error');
									return;
								}
								setProductList(
									productList.concat([
										{
											productId: uuid(),
											publisherDid: slimeConfig.activeIdentity.did,
											creators: [slimeConfig.activeIdentity.did],
											mediaType: 'Game',
											contentRatings: [
												{
													name: RatingsOrgs[0].name,
													fullName: RatingsOrgs[0].fullName,
													rating: RatingsOrgs[0].ratings[0],
													containsContent: [],
													link: '',
												},
											],
											descriptions: [
												{
													type: 'Short',
													markdown: false,
													description: '',
													language: {
														english: 'English',
														native: 'English',
													},
												},
												{
													type: 'Medium',
													markdown: false,
													description: '',
													language: {
														english: 'English',
														native: 'English',
													},
												},
												{
													type: 'Long',
													markdown: false,
													description: '',
													language: {
														english: 'English',
														native: 'English',
													},
												},
											],
											credits: [
												{
													role: 'Publisher',
													did: slimeConfig.activeIdentity.did,
												},
											],
											childProducts: [],
											lastUpdated: new Date().getTime(),
											lastUpdatedContent: new Date().getTime(),
											nostrEventId: '',
											password: 'string',
											images: [],
											videos: [],
											donationAddress: '',
											parentProductId: '',
											releaseStatus: '',
											supportContact: slimeConfig.activeIdentity.did,
											tags: [],
											titles: [
												{
													title: '',
													language: {
														english: 'English',
														native: 'English',
													},
												},
											],
											files: [],
										} as Media,
									])
								);
							}}
						>
							<AddIcon />
						</Fab>
					</Tooltip>
				</Stack>
			</Paper>
		</Box>
	);
};
