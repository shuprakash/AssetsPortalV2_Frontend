import * as React from 'react';
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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssetCard from '../../components/Assets/AssetCard';
import FilterSidebar, { IFilterOption, IFilterState } from '../../components/Assets/FilterSidebar';
import { IAsset } from '../../models/IAsset';
import { etpTokens, getModeTokens } from '../../theme/etpTheme';

export type ExploreSortKey = 'rel' | 'az' | 'za' | 'dl' | 'rt' | 'pf';

interface IExploreFilterOptions {
  portfolios: IFilterOption[];
  assetTypes: IFilterOption[];
  availability: IFilterOption[];
  geography: IFilterOption[];
  themes: IFilterOption[];
}

export interface IAssetFilterComponentProps {
  activeFilterCount: number;
  clearFilters: () => void;
  clearSearch: () => void;
  error: string | null;
  filteredAssets: IAsset[];
  filterOptions: IExploreFilterOptions;
  filters: IFilterState;
  filtersOpen: boolean;
  loading: boolean;
  onAssetSelect: (asset: IAsset) => void;
  pageTitle: React.ReactNode;
  patchFilters: (nextFilters: IFilterState) => void;
  quickOptions: IFilterOption[];
  ratingOptions: IFilterOption[];
  setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSort: React.Dispatch<React.SetStateAction<ExploreSortKey>>;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  sort: ExploreSortKey;
  sortLabels: Record<ExploreSortKey, string>;
  subtitle: string;
  terms: string[];
  visibleAssets: IAsset[];
  visibleCount: number;
}

const AssetFilterComponent: React.FC<IAssetFilterComponentProps> = ({
  activeFilterCount,
  clearFilters,
  clearSearch,
  error,
  filteredAssets,
  filterOptions,
  filters,
  filtersOpen,
  loading,
  onAssetSelect,
  pageTitle,
  patchFilters,
  quickOptions,
  ratingOptions,
  setFiltersOpen,
  setSort,
  setVisibleCount,
  sort,
  sortLabels,
  subtitle,
  terms,
  visibleAssets,
  visibleCount,
}) => (
  <>
    <Box sx={{ mb: 2.25 }}>
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
              height: 2,
              background: `linear-gradient(90deg, ${t.green}, transparent)`,
            },
          };
        }}
      >
        Browse
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
      <Typography sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 14.5, mb: 2.5 })}>
        {subtitle}
      </Typography>
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

    <Grid container spacing={2.5}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
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
              onChange={(event) => setSort(event.target.value as ExploreSortKey)}
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
                <MenuItem key={key} value={key}>{sortLabels[key as ExploreSortKey]}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {activeFilterCount > 0 && (
          <Box sx={{ display: 'flex', gap: 0.875, flexWrap: 'wrap', alignItems: 'center', mb: 1.75 }}>
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
  </>
);

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

export default AssetFilterComponent;
