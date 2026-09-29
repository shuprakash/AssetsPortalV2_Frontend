import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, PaletteMode } from '@mui/material';
import { IFilterOption, IFilterState } from '../../components/Assets/FilterSidebar';
import NavigationBar, { PortalNavKey } from '../../components/Layout/NavigationBar';
import { IAsset } from '../../models/IAsset';
import { SharePointService } from '../../services/SharePointService';
import { assetMatchesTerms, getAssetHaystack, getOptionCounts, getPortfolioOptions, getRelevanceScore } from '../../utils/assetHelpers';
import { getModeTokens } from '../../theme/etpTheme';
import AssetChampionCmp from './AssetChampionCmp';
import AssetFilterComponent, { ExploreSortKey } from './AssetFilterComponent';
import HomeComponent from './HomeComponent';

export interface IDashboardProps {
  searchQuery: string;
  onBackToSearch: () => void;
  onSearch: (query: string) => void;
  onAssetSelect: (asset: IAsset) => void;
  mode: PaletteMode;
  onToggleTheme: () => void;
}

type SortKey = ExploreSortKey;

const defaultFilters: IFilterState = {
  refineText: '',
  quick: [],
  portfolio: 'all',
  assetTypes: [],
  availability: [],
  geography: [],
  themes: [],
  residency: 'all',
  minRating: 'all',
};

const quickOptions: IFilterOption[] = [
  { value: 'new', label: 'New' },
  { value: 'featured', label: 'Featured' },
  { value: 'top', label: 'Top Rated' },
  { value: 'agentic', label: 'Agentic AI' },
  { value: 'genai', label: 'GenAI' },
];

const ratingOptions: IFilterOption[] = [
  { value: 'all', label: 'Any rating' },
  { value: '4.2', label: '4.2 & up' },
  { value: '4.5', label: '4.5 & up' },
  { value: '4.7', label: '4.7 & up' },
];

const sortLabels: Record<SortKey, string> = {
  rel: 'Relevance',
  az: 'A - Z',
  za: 'Z - A',
  dl: 'Most Downloaded',
  rt: 'Top Rated',
  pf: 'Portfolio',
};

const Dashboard: React.FC<IDashboardProps> = ({
  searchQuery,
  onBackToSearch,
  onSearch,
  onAssetSelect,
  mode,
  onToggleTheme,
}) => {
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState<string[]>([]);
  const [termMode, setTermMode] = useState<'any' | 'all'>('any');
  const [filters, setFilters] = useState<IFilterState>(defaultFilters);
  const [sort, setSort] = useState<SortKey>('az');
  const [visibleCount, setVisibleCount] = useState<number>(25);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<PortalNavKey>(searchQuery.trim() ? 'results' : 'home');

  useEffect(() => {
    let mounted = true;
    const service = new SharePointService();
    setLoading(true);
    setError(null);

    service.getListItems('Assets')
      .then((items) => {
        if (!mounted) return;
        setAssets(items as IAsset[]);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load assets');
        setAssets([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const cleanQuery = searchQuery.trim();
    setTerms(cleanQuery ? [cleanQuery] : []);
    setSort(cleanQuery ? 'rel' : 'az');
    setActiveNav(cleanQuery ? 'results' : 'home');
    setVisibleCount(25);
  }, [searchQuery]);

  const patchFilters = useCallback((nextFilters: IFilterState) => {
    setFilters(nextFilters);
    setVisibleCount(25);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setVisibleCount(25);
  }, []);

  const clearSearch = useCallback(() => {
    setTerms([]);
    setSort('az');
    setVisibleCount(25);
  }, []);

  const setDashboardNav = useCallback((nav: PortalNavKey) => {
    if (nav === 'results') {
      onBackToSearch();
      return;
    }

    setActiveNav(nav);
    setVisibleCount(25);
    if (nav === 'home' || nav === 'explore' || nav === 'champions') {
      setTerms([]);
      setFilters(defaultFilters);
      setSort(nav === 'champions' ? 'pf' : 'az');
      return;
    }
    if (nav === 'agentic') {
      setTerms([]);
      setFilters({ ...defaultFilters, quick: ['agentic'] });
      setSort('az');
      return;
    }
    if (nav === 'popular') {
      setTerms([]);
      setFilters(defaultFilters);
      setSort('dl');
    }
  }, [onBackToSearch]);

  const filterOptions = useMemo(() => {
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
  }, [assets]);

  const filteredAssets = useMemo(() => {
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
  }, [assets, filters, sort, termMode, terms]);

  const visibleAssets = filteredAssets.slice(0, visibleCount);
  const activeFilterCount = (
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

  const pageTitle = terms.length
    ? (
      <>
        Results for <Box component="span" sx={(theme) => ({ color: getModeTokens(theme.palette.mode).lime })}>"{terms.join('" - "')}"</Box>
      </>
    )
    : activeNav === 'explore'
      ? 'Explore the Library'
      : activeNav === 'popular'
        ? 'Most Popular'
        : activeNav === 'agentic'
          ? 'Agentic AI'
          : activeNav === 'champions'
            ? 'Asset Champions'
          : 'Search the ET&P catalogue';

  const pageSubtitle = terms.length
    ? 'Review matching assets and tune the filters to narrow the result set.'
    : activeNav === 'agentic'
      ? 'Autonomous agents that sense, decide and act.'
      : activeNav === 'popular'
        ? 'Ranked by downloads across the practice.'
        : 'Browse every ET&P accelerator, tool and asset - App-store style discovery.';

  const dashboardContent = activeNav === 'home'
    ? (
      <HomeComponent
        assets={assets}
        loading={loading}
        onAssetSelect={onAssetSelect}
        onNavigate={setDashboardNav}
      />
    )
    : activeNav === 'champions'
      ? (
        <AssetChampionCmp
          assets={assets}
          onAssetSelect={onAssetSelect}
        />
      )
      : (
        <AssetFilterComponent
          activeFilterCount={activeFilterCount}
          clearFilters={clearFilters}
          clearSearch={clearSearch}
          error={error}
          filteredAssets={filteredAssets}
          filterOptions={filterOptions}
          filters={filters}
          filtersOpen={filtersOpen}
          loading={loading}
          onAssetSelect={onAssetSelect}
          pageTitle={pageTitle}
          patchFilters={patchFilters}
          quickOptions={quickOptions}
          ratingOptions={ratingOptions}
          setFiltersOpen={setFiltersOpen}
          setSort={setSort}
          setVisibleCount={setVisibleCount}
          sort={sort}
          sortLabels={sortLabels}
          subtitle={pageSubtitle}
          terms={terms}
          visibleAssets={visibleAssets}
          visibleCount={visibleCount}
        />
      );

  return (
    <NavigationBar
      activeNav={activeNav}
      mode={mode}
      onSearch={onSearch}
      onNavigate={setDashboardNav}
      onToggleTheme={onToggleTheme}
    >
      {dashboardContent}
    </NavigationBar>
  );

};

export default Dashboard;

