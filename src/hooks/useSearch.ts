import { useState, useCallback } from 'react';
import { SearchService } from '../services/SearchService';
import { ISearchResult } from '../models/ISearchResult';

/**
 * Hook for performing search operations.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ MIGRATION NOTE:                                                  │
 * │ When copying back to SPFx, restore the useAppContext import      │
 * │ and pass `sp` from context to SearchService constructor.         │
 * └──────────────────────────────────────────────────────────────────┘
 */
export interface IUseSearchReturn {
  results: ISearchResult[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
}

export const useSearch = (): IUseSearchReturn => {
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);
      try {
        const searchService = new SearchService();
        const searchResults = await searchService.search(query);
        setResults(searchResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { results, loading, error, search };
};
