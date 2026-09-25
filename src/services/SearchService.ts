import { ISearchResult } from '../models/ISearchResult';
import { APP_CONFIG } from '../constants/config';

/**
 * Mock SearchService that calls JSON Server instead of PnP/SP.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ MIGRATION NOTE:                                                  │
 * │ When copying back to SPFx, replace this file with the original   │
 * │ SearchService.ts that uses SPFI and @pnp/sp/search.             │
 * └──────────────────────────────────────────────────────────────────┘
 */
export class SearchService {
  private baseUrl: string;

  constructor(baseUrl: string = APP_CONFIG.MOCK_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  public async search(queryText: string, rowLimit: number = APP_CONFIG.SEARCH_ROW_LIMIT): Promise<ISearchResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/searchResults`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allResults: ISearchResult[] = await response.json();

      // Client-side filtering to simulate search
      const filtered = queryText.trim()
        ? allResults.filter((item) =>
            item.title.toLowerCase().includes(queryText.toLowerCase()) ||
            item.summary.toLowerCase().includes(queryText.toLowerCase()) ||
            item.author.toLowerCase().includes(queryText.toLowerCase()) ||
            item.siteName.toLowerCase().includes(queryText.toLowerCase())
          )
        : allResults;

      return filtered.slice(0, rowLimit);
    } catch (error) {
      console.error('SearchService.search error:', error);
      throw error;
    }
  }
}
