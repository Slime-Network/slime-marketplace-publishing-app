import { Grid, Typography, Paper, Stack } from '@mui/material';
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
	<Paper elevation={1} sx={{ display: 'flex', justifyContent: 'center' }}>
		{products.length > 0 ? (
			<Paper elevation={1} sx={{ maxWidth: '100rem' }}>
				<Stack direction="column" spacing={2}>
					<Typography variant="h4">
						{title}: {dataStoreId.slice(0, 4)}...{dataStoreId.slice(dataStoreId.length - 4, dataStoreId.length)}
					</Typography>
					<Grid container spacing={4} id="productlist" justifyContent={'center'}>
						{products &&
							products.map((result: Media) => (
								<Grid key={result.productId} item xs={12}>
									<PublishingCard media={result} onExecuteUpdate={onExecuteUpdate} dataStoreId={dataStoreId} />
								</Grid>
							))}
					</Grid>
				</Stack>
			</Paper>
		) : (
			<></>
		)}
	</Paper>
);

export default ProductList;
