import { Typography, Stack, Box } from '@mui/material';
import React from 'react';

import { Media } from '../slime-shared/types/slime/Media';
import PublishingCard from './PublishingCard';

interface ProductListProps {
	title: string;
	products: Media[];
	dataStoreId: string;
	onExecuteUpdate: (media: Media) => Promise<void>;
}

const ProductList: React.FC<ProductListProps> = ({ title, products, dataStoreId, onExecuteUpdate }) => (
	<Box sx={{ display: 'flex', justifyContent: 'center' }}>
		{products.length > 0 ? (
			<Box sx={{ maxWidth: '100rem' }}>
				<Stack direction="column" spacing={2}>
					<Typography variant="h4">
						{title}: {dataStoreId.slice(0, 4)}...{dataStoreId.slice(dataStoreId.length - 4, dataStoreId.length)}
					</Typography>
					<Stack justifyContent={'center'}>
						{products &&
							products.map((result: Media) => (
								<PublishingCard media={result} onExecuteUpdate={onExecuteUpdate} dataStoreId={dataStoreId} />
							))}
					</Stack>
				</Stack>
			</Box>
		) : (
			<></>
		)}
	</Box>
);

export default ProductList;
