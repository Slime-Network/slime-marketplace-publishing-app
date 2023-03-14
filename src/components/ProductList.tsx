import { Grid, Typography, Paper } from "@mui/material";

import PublishingCard from "./PublishingCard";
import { Media } from "../spriggan-shared/types/Media";

export const ProductList = (
	title: string,
	products: Media[],
	datastoreId: string,
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
								datastoreId={datastoreId}
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
