import { CssBaseline } from '@mui/material';
import { green } from '@mui/material/colors';
import {
	Experimental_CssVarsProvider as CssVarsProvider,
	experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { CHAIN_ID, PROJECT_ID, RELAY_URL } from './slime-shared/constants/env';
import { MarketplaceApiContextProvider } from './slime-shared/contexts/MarketplaceApiContext';
import { SlimeApiContextProvider } from './slime-shared/contexts/SlimeApiContext';
import { WalletConnectProvider } from './slime-shared/contexts/WalletConnectContext';
import { WalletConnectRpcProvider } from './slime-shared/contexts/WalletConnectRpcContext';

const theme = extendTheme({
	colorSchemes: {
		dark: {
			// palette for dark mode
			palette: {
				primary: {
					main: green[500],
				},
				secondary: {
					main: green[500],
				},
			},
		},
		light: {
			// palette for dark mode
			palette: {
				primary: {
					main: green[300],
				},
				secondary: {
					main: green[200],
				},
			},
		},
	},
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<CssVarsProvider theme={theme} defaultMode="dark">
			<WalletConnectProvider projectId={PROJECT_ID} relayUrl={RELAY_URL} chainId={CHAIN_ID}>
				<WalletConnectRpcProvider>
					<MarketplaceApiContextProvider>
						<SlimeApiContextProvider>
							<CssBaseline />
							<App />
						</SlimeApiContextProvider>
					</MarketplaceApiContextProvider>
				</WalletConnectRpcProvider>
			</WalletConnectProvider>
		</CssVarsProvider>
	</React.StrictMode>
);
