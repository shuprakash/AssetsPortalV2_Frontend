import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { PaletteMode } from '@mui/material';
import AssetCard from '../../components/Assets/AssetCard';
import FilterSidebar, { IFilterOption, IFilterState } from '../../components/Assets/FilterSidebar';
import PortalShell, { PortalNavKey } from '../../components/Layout/PortalShell';
import { IAsset } from '../../models/IAsset';
import { SharePointService } from '../../services/SharePointService';
import { assetMatchesTerms, getAssetHaystack, getOptionCounts, getPortfolioOptions, getRelevanceScore } from '../../utils/assetHelpers';
import { etpTokens, getModeTokens } from '../../theme/etpTheme';

export interface IDashboardProps {
  searchQuery: string;
  onBackToSearch: () => void;
  onSearch: (query: string) => void;
  onAssetSelect: (asset: IAsset) => void;
  mode: PaletteMode;
  onToggleTheme: () => void;
}

type SortKey = 'rel' | 'az' | 'za' | 'dl' | 'rt' | 'pf';

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
  const [pendingTerm, setPendingTerm] = useState<string>('');
  const [termMode, setTermMode] = useState<'any' | 'all'>('any');
  const [filters, setFilters] = useState<IFilterState>(defaultFilters);
  const [sort, setSort] = useState<SortKey>('az');
  const [visibleCount, setVisibleCount] = useState<number>(25);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<PortalNavKey>('results');

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
    setActiveNav('results');
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

  const addTerm = useCallback((value: string = pendingTerm) => {
    const cleanTerm = value.trim();
    if (!cleanTerm) return;
    setTerms((current) => current.some((term) => term.toLowerCase() === cleanTerm.toLowerCase()) ? current : [...current, cleanTerm]);
    setPendingTerm('');
    setSort('rel');
    setVisibleCount(25);
  }, [pendingTerm]);

  const dropTerm = useCallback((index: number) => {
    setTerms((current) => current.filter((_, termIndex) => termIndex !== index));
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
    : activeNav === 'popular'
      ? 'Most Popular'
      : activeNav === 'agentic'
        ? 'Agentic AI'
        : activeNav === 'champions'
          ? 'Asset Champions'
          : 'Search the ET&P catalogue';

  return (
    <PortalShell
      activeNav={activeNav}
      mode={mode}
      onSearch={onSearch}
      onNavigate={setDashboardNav}
      onToggleTheme={onToggleTheme}
    >
      <Box sx={{ mb: 3.25 }}>
        <Typography
          sx={(theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.125,
            color: t.lime,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            '&:before': {
              content: '""',
              width: 24,
              height: 1,
              background: `linear-gradient(90deg, ${t.green}, transparent)`,
            },
          };
          }}
        >
          Search results
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
            fontSize: { xs: 27, md: 34 },
            fontWeight: 800,
            letterSpacing: '-1px',
            mt: 1,
            mb: 0.5,
          }}
        >
          {pageTitle}
        </Typography>
        <Typography sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 14.5, mb: 3.25 })}>
          Add more terms to widen the search, or narrow it down with the filters on the left.
        </Typography>

        <Box sx={{ mb: 2.75 }}>
          <Box
            sx={(theme) => {
              const t = getModeTokens(theme.palette.mode);
              return {
                display: 'flex',
                alignItems: 'center',
                gap: 1.375,
                maxWidth: 660,
                p: '6px 6px 6px 16px',
                borderRadius: '15px',
                bgcolor: t.surface,
                border: `1px solid ${t.borderSoft}`,
                transition: '.2s',
                '&:focus-within': { borderColor: t.green, boxShadow: '0 0 0 3px rgba(134,188,37,.12)' },
              };
            }}
          >
            <SearchIcon sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 18, flexShrink: 0 })} />
            <Box
              component="input"
              value={pendingTerm}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPendingTerm(event.target.value)}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') addTerm();
              }}
              placeholder="Add another search term..."
              sx={(theme) => ({
                flex: 1,
                minWidth: 0,
                bgcolor: 'transparent',
                border: 0,
                outline: 0,
                color: getModeTokens(theme.palette.mode).text,
                fontFamily: '"Inter", sans-serif',
                fontSize: 14.5,
                '&::placeholder': { color: getModeTokens(theme.palette.mode).muted2 },
              })}
            />
            <Button
              startIcon={<AddIcon />}
              onClick={() => addTerm()}
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                color: etpTokens.ink,
                background: `linear-gradient(120deg, ${t.lime}, ${t.green})`,
                px: 1.875,
                py: 1.25,
                borderRadius: '11px',
                fontSize: 13,
                whiteSpace: 'nowrap',
                '&:hover': { transform: 'translateY(-1px)', background: `linear-gradient(120deg, ${t.lime}, ${t.green})` },
              };
              }}
            >
              Add term
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mt: 1.5 }}>
            {terms.map((term, index) => (
              <Chip
                key={`${term}-${index}`}
                icon={<SearchIcon />}
                label={term}
                onDelete={() => dropTerm(index)}
                deleteIcon={<CloseIcon />}
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    height: 32,
                    color: t.text,
                    bgcolor: t.panel,
                    border: `1px solid ${t.border}`,
                    borderRadius: '20px',
                    fontSize: 12.5,
                    fontWeight: 700,
                    '& .MuiChip-icon': { color: t.lime, fontSize: 14 },
                    '& .MuiChip-deleteIcon': { color: t.muted, fontSize: 16, '&:hover': { color: t.spectrum[0] } },
                  };
                }}
              />
            ))}
            {terms.length > 1 && (
              <Box sx={(theme) => ({ display: 'flex', gap: 0.25, p: 0.375, borderRadius: '11px', bgcolor: getModeTokens(theme.palette.mode).panel, border: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}` })}>
                {(['any', 'all'] as const).map((modeValue) => (
                  <Button
                    key={modeValue}
                    onClick={() => setTermMode(modeValue)}
                    sx={(theme) => {
                      const t = getModeTokens(theme.palette.mode);
                      return {
                        minWidth: 0,
                        px: 1.375,
                        py: 0.625,
                        borderRadius: '8px',
                        color: termMode === modeValue ? etpTokens.ink : 'text.secondary',
                        background: termMode === modeValue ? `linear-gradient(120deg, ${t.lime}, ${t.green})` : 'transparent',
                        fontSize: 11.5,
                        fontWeight: 800,
                      };
                    }}
                  >
                    {modeValue === 'any' ? 'Any' : 'All'}
                  </Button>
                ))}
              </Box>
            )}
            {terms.length > 0 && (
              <Button onClick={clearSearch} sx={(theme) => ({ color: getModeTokens(theme.palette.mode).lime, textDecoration: 'underline', textUnderlineOffset: '3px', fontSize: 12 })}>
                Clear search
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Button
        startIcon={<FilterListIcon />}
        onClick={() => setFiltersOpen((open) => !open)}
        sx={(theme) => {
          const t = getModeTokens(theme.palette.mode);
          return {
            display: { xs: 'inline-flex', lg: 'none' },
            mb: 2,
            color: t.text,
            bgcolor: t.panel,
            border: `1px solid ${t.borderSoft}`,
            borderRadius: '12px',
            '&:hover': { bgcolor: t.panel, borderColor: t.border },
          };
        }}
      >
        Filters {activeFilterCount ? `(${activeFilterCount})` : ''}
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={3}>
          <Collapse in={filtersOpen} sx={{ display: { lg: 'none' } }}>
            <Box sx={{ mb: 3 }}>
              <FilterSidebar
                filters={filters}
                quickOptions={quickOptions}
                portfolioOptions={filterOptions.portfolios}
                assetTypeOptions={filterOptions.assetTypes}
                availabilityOptions={filterOptions.availability}
                geographyOptions={filterOptions.geography}
                themeOptions={filterOptions.themes}
                ratingOptions={ratingOptions}
                onChange={patchFilters}
                onClear={clearFilters}
              />
            </Box>
          </Collapse>
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <FilterSidebar
              filters={filters}
              quickOptions={quickOptions}
              portfolioOptions={filterOptions.portfolios}
              assetTypeOptions={filterOptions.assetTypes}
              availabilityOptions={filterOptions.availability}
              geographyOptions={filterOptions.geography}
              themeOptions={filterOptions.themes}
              ratingOptions={ratingOptions}
              onChange={patchFilters}
              onClear={clearFilters}
            />
          </Box>
        </Grid>

        <Grid item xs={12} lg={9}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, flexWrap: 'wrap', mb: 1.75 }}>
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
                fontSize: 20,
                fontWeight: 800,
                flex: 1,
                minWidth: 220,
              }}
            >
              {loading ? 'Loading catalogue...' : (
                <>
                  <Box component="span" sx={(theme) => ({ color: getModeTokens(theme.palette.mode).lime })}>{filteredAssets.length}</Box>
                  {' '}asset{filteredAssets.length === 1 ? '' : 's'} {terms.length ? 'match your search' : activeFilterCount ? 'found' : 'in the catalogue'}
                </>
              )}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: 13 }}>
              Sort By:
              <Select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                size="small"
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    color: t.lime,
                    bgcolor: t.panel,
                    borderRadius: '10px',
                    fontSize: 13,
                    fontWeight: 700,
                    '& fieldset': { borderColor: t.borderSoft },
                    '&:hover fieldset': { borderColor: t.border },
                    '& .MuiSvgIcon-root': { color: t.muted },
                  };
                }}
              >
                {(terms.length ? Object.keys(sortLabels) : Object.keys(sortLabels).filter((key) => key !== 'rel')).map((key) => (
                  <MenuItem key={key} value={key}>{sortLabels[key as SortKey]}</MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          {activeFilterCount > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2.25 }}>
              {filters.refineText && <ActiveChip label={`Refine: ${filters.refineText}`} onDelete={() => patchFilters({ ...filters, refineText: '' })} />}
              {filters.quick.map((item) => <ActiveChip key={item} label={`Filter: ${quickOptions.find((q) => q.value === item)?.label || item}`} onDelete={() => patchFilters({ ...filters, quick: filters.quick.filter((value) => value !== item) })} />)}
              {filters.portfolio !== 'all' && <ActiveChip label={`Portfolio: ${filters.portfolio}`} onDelete={() => patchFilters({ ...filters, portfolio: 'all' })} />}
              {filters.geography.map((geo) => <ActiveChip key={geo} label={`Country: ${geo}`} onDelete={() => patchFilters({ ...filters, geography: filters.geography.filter((value) => value !== geo) })} />)}
              {filters.themes.map((theme) => <ActiveChip key={theme} label={`Theme: ${theme}`} onDelete={() => patchFilters({ ...filters, themes: filters.themes.filter((value) => value !== theme) })} />)}
              {filters.assetTypes.map((type) => <ActiveChip key={type} label={`Type: ${type}`} onDelete={() => patchFilters({ ...filters, assetTypes: filters.assetTypes.filter((value) => value !== type) })} />)}
              {filters.availability.map((availability) => <ActiveChip key={availability} label={`Availability: ${availability}`} onDelete={() => patchFilters({ ...filters, availability: filters.availability.filter((value) => value !== availability) })} />)}
              {filters.residency !== 'all' && <ActiveChip label={filters.residency === 'required' ? 'Data: Residency required' : 'Data: No restriction'} onDelete={() => patchFilters({ ...filters, residency: 'all' })} />}
              {filters.minRating !== 'all' && <ActiveChip label={`Rating: ${filters.minRating} & up`} onDelete={() => patchFilters({ ...filters, minRating: 'all' })} />}
              <Button onClick={clearFilters} sx={(theme) => ({ color: getModeTokens(theme.palette.mode).lime, textDecoration: 'underline', textUnderlineOffset: '3px', fontSize: 12 })}>
                Clear all
              </Button>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 360 }}>
              <CircularProgress sx={(theme) => ({ color: getModeTokens(theme.palette.mode).lime })} />
            </Box>
          ) : visibleAssets.length ? (
            <>
              <Grid container spacing={2.5}>
                {visibleAssets.map((asset, index) => (
                  <Grid item xs={12} sm={6} xl={4} key={asset.id}>
                    <AssetCard asset={asset} index={index} onSelect={onAssetSelect} />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ textAlign: 'center', mt: 3.75 }}>
                {filteredAssets.length > visibleAssets.length && (
                  <Button
                    onClick={() => setVisibleCount((current) => Math.min(current + 25, filteredAssets.length))}
                    sx={(theme) => {
                      const t = getModeTokens(theme.palette.mode);
                      return {
                        color: t.lime,
                        bgcolor: t.panel,
                        border: `1px solid ${t.border}`,
                        px: 3.75,
                        py: 1.5,
                        borderRadius: '24px',
                        '&:hover': {
                          color: etpTokens.ink,
                          background: `linear-gradient(120deg, ${t.lime}, ${t.green})`,
                          borderColor: 'transparent',
                        },
                      };
                    }}
                  >
                    View More
                  </Button>
                )}
                <Typography sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted2, fontSize: 12.5, mt: 1.375, letterSpacing: '.4px' })}>
                  [ {visibleAssets.length} / {filteredAssets.length} ]
                </Typography>
              </Box>
            </>
          ) : (
            <Box
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                  textAlign: 'center',
                  color: t.muted2,
                  p: 7.5,
                  borderRadius: '20px',
                  bgcolor: t.surface,
                  border: `1px solid ${t.borderSoft}`,
                };
              }}
            >
              <AutoAwesomeIcon sx={(theme) => ({ fontSize: 42, color: getModeTokens(theme.palette.mode).lime, mb: 1.5 })} />
              <Typography sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontSize: 20, fontWeight: 800, mb: 1 }}>
                No assets match this search.
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 2 }}>
                Try removing a filter or adding a broader term.
              </Typography>
              <Button onClick={() => { clearFilters(); clearSearch(); }} sx={(theme) => ({ color: getModeTokens(theme.palette.mode).lime, textDecoration: 'underline', textUnderlineOffset: '3px' })}>
                Reset all filters
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </PortalShell>
  );
};

interface IActiveChipProps {
  label: string;
  onDelete: () => void;
}

const ActiveChip: React.FC<IActiveChipProps> = ({ label, onDelete }) => (
  <Chip
    label={label}
    onDelete={onDelete}
    deleteIcon={<CloseIcon />}
    sx={(theme) => {
      const t = getModeTokens(theme.palette.mode);
      return {
        height: 31,
        borderRadius: '20px',
        color: t.text,
        bgcolor: t.panel,
        border: `1px solid ${t.border}`,
        fontSize: 12,
        fontWeight: 700,
        '& .MuiChip-deleteIcon': { color: t.muted, fontSize: 16, '&:hover': { color: t.spectrum[0] } },
      };
    }}
  />
);

export default Dashboard;
