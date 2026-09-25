import { APP_CONFIG } from '../constants/config';

/**
 * Mock SharePointService that calls JSON Server instead of PnP/SP.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ MIGRATION NOTE:                                                  │
 * │ When copying back to SPFx, replace this file with the original   │
 * │ SharePointService.ts that uses SPFI and @pnp/sp.                │
 * └──────────────────────────────────────────────────────────────────┘
 */
export class SharePointService {
  private baseUrl: string;

  constructor(baseUrl: string = APP_CONFIG.MOCK_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  public async getListItems(listTitle: string, _select?: string[], top?: number): Promise<any[]> {
    try {
      // Map list titles to JSON Server endpoints
      const endpointMap: Record<string, string> = {
        'Assets': 'assets',
        'SearchResults': 'searchResults',
      };
      const endpoint = endpointMap[listTitle] || listTitle.toLowerCase();
      let url = `${this.baseUrl}/${endpoint}`;
      if (top) {
        url += `?_limit=${top}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`SharePointService.getListItems error for list "${listTitle}":`, error);
      throw error;
    }
  }

  public async getWebInfo(): Promise<any> {
    return {
      Title: 'Mock SharePoint Site',
      Url: 'https://sharepoint.example.com/sites/etp',
      Description: 'Mock site for local development',
    };
  }
}
