import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SessionTypes } from '@walletconnect/types';

import WalletConnectMenu from '../slime-shared/components/WalletConnectMenu';

export interface MainTopBarProps {
	session: SessionTypes.Struct | undefined;
	connectToWallet: () => void;
	disconnectFromWallet: () => void;
}

export default function MainTopBar(props: MainTopBarProps) {
	const { session, connectToWallet, disconnectFromWallet } = props;

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Stack direction="row" spacing={2} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
						<Typography variant="h6" noWrap sx={{ display: { xs: 'none', sm: 'block' } }}>
							Slime Publishing
						</Typography>

						<Stack direction="row">
							<IconButton
								color="inherit"
								size="large"
								onClick={() => {
									window.location.reload();
								}}
							>
								<RefreshIcon />
							</IconButton>
							<WalletConnectMenu
								session={session}
								connectToWallet={connectToWallet}
								disconnectFromWallet={disconnectFromWallet}
							/>
						</Stack>
					</Stack>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
