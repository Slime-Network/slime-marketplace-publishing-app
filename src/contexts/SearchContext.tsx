import axios from "axios";

import {
	createContext,
	ReactNode,
	useContext,
	useState,
} from "react";
import { Media } from "../spriggan-shared/types/Media";
import { SearchParams } from "../spriggan-shared/types/SearchTypes";

/**
 * Types
 */
interface IContext {
	apiUrl: string,
	setApiUrl: React.Dispatch<React.SetStateAction<string>>,
	search: SearchCallback,
	mostRecent: SearchCallback,
}

type SearchCallback = (params: SearchParams) => Promise<Media[]>;

/**
 * Context
 */
export const SearchContext = createContext<IContext>({} as IContext);

/**
 * Provider
 */
export function SearchContextProvider({children}: {
	children: ReactNode | ReactNode[];
}) {
	const [apiUrl, setApiUrl] = useState('http://localhost:5233')

	const hitsToGameList = (hits: any) => {
		const media = new Array<Media>()
		if (hits) {
			hits.forEach((hit: any) => {
				media.push(hit._source as Media)
			});
		}
		return media
	}

	const search = async (params: SearchParams) => {
		const response = await axios.get(`${apiUrl}/media/search`, { params: { titleTerm: params.titleTerm } })
		return hitsToGameList(response.data.hits.hits);
	}

	const mostRecent = async (params: SearchParams) => {
		const response = await axios.get(`${apiUrl}/media/mostRecent`, { params: {} })
		return hitsToGameList(response.data.hits.hits);
	}

	return (
		<SearchContext.Provider
			value={{
				apiUrl,
				setApiUrl,
				search,
				mostRecent,
			}}
			>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearch() {
	const context = useContext(SearchContext);
	if (context === undefined) {
		throw new Error(
			"useSearch must be used within a SearchContextProvider"
		);
	}
	return context;
}
