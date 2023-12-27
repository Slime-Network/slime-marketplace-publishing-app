import { Grid, Typography, Paper } from "@mui/material";

import { GostiConfig } from "../gosti-shared/types/gosti/GostiRpcTypes";
import { Media } from "../gosti-shared/types/gosti/Media";
import PublishingCard from "./PublishingCard";

export const ProductList = (
	title: string,
	products: Media[],
	dataStoreId: string,
	config: GostiConfig,
	setConfig: React.Dispatch<React.SetStateAction<GostiConfig>>,
	onExecuteUpdate: (media: Media) => Promise<void>,
) => {

	let render = <></>;

	if (products.length > 0) {
		render =
			<Paper elevation={1} sx={{ m: 2 }}>
				<Typography sx={{ p: 2 }} variant="h4">{title}</Typography>
				<Grid container p={4} spacing={4} id="productlist">
					{products && products.map((result: Media) => (
						<Grid key={result.productId} item xs={12}>
							<PublishingCard
								media={result}
								onExecuteUpdate={onExecuteUpdate}
								dataStoreId={dataStoreId}
								config={config}
								setConfig={setConfig}
							/>
						</Grid>
					))}
				</Grid>
			</Paper>;
	}

	return (
		<Paper elevation={1} sx={{ m: 2 }}>
			{render}
		</Paper>
	);
};
