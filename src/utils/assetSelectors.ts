import type { IFilterOption, IFilterState } from '../components/Assets/FilterSidebar';
import type { ExploreSortKey } from '../features/dashboard/AssetFilterComponent';
import { IAsset } from '../models/IAsset';
import {
  assetMatchesTerms,
  getAssetHaystack,
  getOptionCounts,
  getPortfolioOptions,
  getRelevanceScore,
} from './assetHelpers';

export interface IAssetFilterOptions {
  portfolios: IFilterOption[];
  assetTypes: IFilterOption[];
  availability: IFilterOption[];
  geography: IFilterOption[];
  themes: IFilterOption[];
}

export interface IFilterAssetsArgs {
  assets: IAsset[];
  filters: IFilterState;
  sort: ExploreSortKey;
  termMode: 'any' | 'all';
  terms: string[];
}

export const buildAssetFilterOptions = (assets: IAsset[]): IAssetFilterOptions => {
  const portfolios = getPortfolioOptions(assets);
  const portfolioCounts = getOptionCounts(assets, (asset) => asset.portfolioName);
  const typeCounts = getOptionCounts(assets, (asset) => asset.assetType);
  const availabilityCounts = getOptionCounts(assets, (asset) => asset.availability);
  const themeCounts = getOptionCounts(assets, (asset) => asset.theme);
  const geographyValues = Array.from(new Set(assets.flatMap((asset) => asset.geography))).sort();
  const geographyCounts = geographyValues.reduce<Record<string, number>>((acc, geo) => {
    acc[geo] = assets.filter((asset) => asset.geography.includes(geo)).length;
    return acc;
  }, {});

  return {
    portfolios: [
      { value: 'all', label: 'All portfolios', count: assets.length },
      ...portfolios.map((portfolio) => ({ value: portfolio, label: portfolio, count: portfolioCounts[portfolio] || 0 })),
    ],
    assetTypes: Object.keys(typeCounts).sort().map((type) => ({ value: type, label: type, count: typeCounts[type] })),
    availability: Object.keys(availabilityCounts).sort().map((availability) => ({ value: availability, label: availability, count: availabilityCounts[availability] })),
    geography: geographyValues.map((geo) => ({ value: geo, label: geo, count: geographyCounts[geo] })),
    themes: Object.keys(themeCounts).sort().map((theme) => ({ value: theme, label: theme, count: themeCounts[theme] })),
  };
};

export const filterAndSortAssets = ({
  assets,
  filters,
  sort,
  termMode,
  terms,
}: IFilterAssetsArgs): IAsset[] => {
  const refineText = filters.refineText.trim().toLowerCase();

  const filtered = assets.filter((asset) => {
    if (!assetMatchesTerms(asset, terms, termMode)) return false;
    if (refineText && !getAssetHaystack(asset).includes(refineText)) return false;
    if (filters.portfolio !== 'all' && asset.portfolioName !== filters.portfolio) return false;
    if (filters.assetTypes.length && !filters.assetTypes.includes(asset.assetType)) return false;
    if (filters.availability.length && !filters.availability.includes(asset.availability)) return false;
    if (filters.geography.length && !asset.geography.some((geo) => filters.geography.includes(geo))) return false;
    if (filters.themes.length && !filters.themes.includes(asset.theme)) return false;
    if (filters.residency === 'required' && !asset.dataResidency.required) return false;
    if (filters.residency === 'none' && asset.dataResidency.required) return false;
    if (filters.minRating !== 'all' && asset.rating < Number(filters.minRating)) return false;
    if (filters.quick.includes('new') && !['Pilot', 'Beta'].includes(asset.availability)) return false;
    if (filters.quick.includes('featured') && asset.downloads < 4 && asset.rating < 4.5) return false;
    if (filters.quick.includes('top') && asset.rating < 4.5) return false;
    if (filters.quick.includes('agentic') && asset.badge !== 'agentic') return false;
    if (filters.quick.includes('genai') && asset.badge !== 'genai') return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (sort === 'rel') return getRelevanceScore(b, terms) - getRelevanceScore(a, terms);
    if (sort === 'az') return a.title.localeCompare(b.title);
    if (sort === 'za') return b.title.localeCompare(a.title);
    if (sort === 'dl') return b.downloads - a.downloads || a.title.localeCompare(b.title);
    if (sort === 'rt') return b.rating - a.rating || a.title.localeCompare(b.title);
    return a.portfolioName.localeCompare(b.portfolioName) || a.title.localeCompare(b.title);
  });
};

export const getActiveFilterCount = (filters: IFilterState): number => (
  (filters.refineText ? 1 : 0) +
  filters.quick.length +
  (filters.portfolio !== 'all' ? 1 : 0) +
  filters.assetTypes.length +
  filters.availability.length +
  filters.geography.length +
  filters.themes.length +
  (filters.residency !== 'all' ? 1 : 0) +
  (filters.minRating !== 'all' ? 1 : 0)
);

export const getAgenticAssets = (assets: IAsset[], limit: number): IAsset[] => (
  assets
    .filter((asset) => asset.badge === 'agentic')
    .sort((a, b) => b.rating - a.rating || b.downloads - a.downloads)
    .slice(0, limit)
);

export const getFreshAssets = (assets: IAsset[], limit: number): IAsset[] => (
  [...assets]
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, limit)
);

export const getPortfolioCount = (assets: IAsset[]): number => (
  new Set(assets.map((asset) => asset.portfolioName)).size
);

export const getTrendingAssets = (assets: IAsset[], limit: number): IAsset[] => (
  [...assets]
    .sort((a, b) => b.downloads - a.downloads || b.rating - a.rating)
    .slice(0, limit)
);
