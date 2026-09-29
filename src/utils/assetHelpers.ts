import { IAsset } from '../models/IAsset';

export const getInitials = (value: string): string => {
  return value
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

export const getAssetHaystack = (asset: IAsset): string => {
  return [
    asset.title,
    asset.description,
    asset.category,
    asset.portfolioName,
    asset.theme,
    asset.assetType,
    asset.availability,
    asset.owner,
    ...asset.geography,
    ...asset.tags,
  ].join(' ').toLowerCase();
};

export const assetMatchesTerms = (asset: IAsset, terms: string[], mode: 'any' | 'all'): boolean => {
  const cleanTerms = terms.map((term) => term.trim().toLowerCase()).filter(Boolean);
  if (!cleanTerms.length) return true;

  const haystack = getAssetHaystack(asset);
  return mode === 'all'
    ? cleanTerms.every((term) => haystack.includes(term))
    : cleanTerms.some((term) => haystack.includes(term));
};

export const getRelevanceScore = (asset: IAsset, terms: string[]): number => {
  const cleanTerms = terms.map((term) => term.trim().toLowerCase()).filter(Boolean);
  if (!cleanTerms.length) return 0;

  return cleanTerms.reduce((score, term) => {
    const title = asset.title.toLowerCase();
    let nextScore = score;
    if (title === term) nextScore += 100;
    else if (title.startsWith(term)) nextScore += 60;
    else if (title.includes(term)) nextScore += 40;
    if (asset.theme.toLowerCase().includes(term)) nextScore += 25;
    if (asset.geography.some((geo) => geo.toLowerCase().includes(term))) nextScore += 20;
    if (asset.portfolioName.toLowerCase().includes(term)) nextScore += 15;
    if (asset.description.toLowerCase().includes(term)) nextScore += 8;
    return nextScore;
  }, asset.downloads * 0.4 + asset.rating);
};

export const getPortfolioOptions = (assets: IAsset[]): string[] => {
  return Array.from(new Set(assets.map((asset) => asset.portfolioName))).sort();
};

export const getOptionCounts = (assets: IAsset[], selector: (asset: IAsset) => string): Record<string, number> => {
  return assets.reduce<Record<string, number>>((acc, asset) => {
    const key = selector(asset);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
};

