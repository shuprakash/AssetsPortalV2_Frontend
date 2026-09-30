import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, PaletteMode } from '@mui/material';
import { IFilterOption, IFilterState } from '../../components/Assets/FilterSidebar';
import NavigationBar, { PortalNavKey } from '../../components/Layout/NavigationBar';
import { DEFAULT_VISIBLE_ASSET_COUNT } from '../../constants/dashboard';
import { IAsset } from '../../models/IAsset';
import { AssetRepository } from '../../repositories/AssetRepository';
import { buildAssetFilterOptions, filterAndSortAssets, getActiveFilterCount } from '../../utils/assetSelectors';
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
  const [visibleCount, setVisibleCount] = useState<number>(DEFAULT_VISIBLE_ASSET_COUNT);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<PortalNavKey>(searchQuery.trim() ? 'results' : 'home');

  useEffect(() => {
    let mounted = true;
    const assetRepository = new AssetRepository();
    setLoading(true);
    setError(null);

    assetRepository.getAssets()
      .then((items) => {
        if (!mounted) return;
        setAssets(items);
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
    setVisibleCount(DEFAULT_VISIBLE_ASSET_COUNT);
  }, [searchQuery]);

  const patchFilters = useCallback((nextFilters: IFilterState) => {
    setFilters(nextFilters);
    setVisibleCount(DEFAULT_VISIBLE_ASSET_COUNT);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setVisibleCount(DEFAULT_VISIBLE_ASSET_COUNT);
  }, []);

  const clearSearch = useCallback(() => {
    setTerms([]);
    setSort('az');
    setVisibleCount(DEFAULT_VISIBLE_ASSET_COUNT);
  }, []);

  const setDashboardNav = useCallback((nav: PortalNavKey) => {
    if (nav === 'results') {
      onBackToSearch();
      return;
    }

    setActiveNav(nav);
    setVisibleCount(DEFAULT_VISIBLE_ASSET_COUNT);
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

  const filterOptions = useMemo(() => buildAssetFilterOptions(assets), [assets]);

  const filteredAssets = useMemo(() => (
    filterAndSortAssets({ assets, filters, sort, termMode, terms })
  ), [assets, filters, sort, termMode, terms]);

  const visibleAssets = filteredAssets.slice(0, visibleCount);
  const activeFilterCount = getActiveFilterCount(filters);

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

