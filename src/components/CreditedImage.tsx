import { Box, Button, Chip } from '@mui/material';
import React, { useState } from 'react';

import { InfoModal } from '../slime-shared/components/InfoModal';

export interface CreditedImageProps {
	src: string;
	artistName: string;
	artistSocials: {
		platform: string;
		link: string;
	}[];
	hidden?: boolean;
	hiddenMessage?: string;
}

const CreditedImage: React.FC<CreditedImageProps> = ({
	src,
	artistName,
	artistSocials,
	hidden = false,
	hiddenMessage = 'Show NSFW',
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isShowHide, setIsShowHide] = useState(hidden);
	const [isHidden, setIsHidden] = useState(true);
	const [source, setSource] = useState(src);

	React.useEffect(() => {
		setIsShowHide(hidden);
		setSource(src);
	}, [hidden, src]);

	const handleArtistNameClick = () => {
		setIsModalOpen(true);
	};

	const toggleHiddenVisibility = () => {
		setIsHidden(!isHidden);
	};

	return (
		<Box>
			<Box sx={{ width: '100%', aspectRatio: '570/372' }}>
				<Box sx={{ width: '100%', height: '100%', display: 'block' }}>
					<img src={source} width={'100%'} alt={artistName} style={isHidden && isShowHide ? { filter: 'blur(15px)' } : {}} />
					{isHidden && isShowHide && (
						<Button
							variant="outlined"
							onClick={toggleHiddenVisibility}
							sx={{
								width: '33%',
								left: '33%',
								height: '33%',
								bottom: '66%',
								color: 'white',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							{hiddenMessage}
						</Button>
					)}
				</Box>
			</Box>
			{artistName !== '' && <Chip component="div" onClick={handleArtistNameClick} label={`By: ${artistName}`} />}
			<InfoModal open={isModalOpen} title={artistName} style={'info'} setOpen={setIsModalOpen}>
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					{artistSocials.map((social, _) => (
						<Button href={social.link} target="_blank" rel="noopener noreferrer">
							{social.platform}
						</Button>
					))}
				</Box>
			</InfoModal>
		</Box>
	);
};

export default CreditedImage;
