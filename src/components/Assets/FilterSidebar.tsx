import * as React from 'react';
import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CompactMultiSelect from '../Inputs/CompactMultiSelect';
import { etpTokens, getModeTokens } from '../../theme/etpTheme';

export interface IFilterState {
  refineText: string;
  quick: string[];
  portfolio: string;
  assetTypes: string[];
  availability: string[];
  geography: string[];
  themes: string[];
  residency: 'all' | 'required' | 'none';
  minRating: string;
}

export interface IFilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface IFilterSidebarProps {
  filters: IFilterState;
  quickOptions: IFilterOption[];
  portfolioOptions: IFilterOption[];
  assetTypeOptions: IFilterOption[];
  availabilityOptions: IFilterOption[];
  geographyOptions: IFilterOption[];
  themeOptions: IFilterOption[];
  ratingOptions: IFilterOption[];
  onChange: (nextFilters: IFilterState) => void;
  onClear: () => void;
}

const toggleValue = (values: string[], value: string): string[] => (
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
);

const sectionSx = {
  px: 2,
  py: 1.625,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

const labelSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  fontSize: 11,
  letterSpacing: '1.3px',
  textTransform: 'uppercase',
  fontWeight: 800,
  mb: 1,
};

const geographyFlags: Record<string, string> = {
  India: String.fromCodePoint(0x1f1ee, 0x1f1f3),
  Australia: String.fromCodePoint(0x1f1e6, 0x1f1fa),
  'Middle East': String.fromCodePoint(0x1f1e6, 0x1f1ea),
  Japan: String.fromCodePoint(0x1f1ef, 0x1f1f5),
  China: String.fromCodePoint(0x1f1e8, 0x1f1f3),
  'United Kingdom': String.fromCodePoint(0x1f1ec, 0x1f1e7),
  'United States': String.fromCodePoint(0x1f1fa, 0x1f1f8),
};

const FilterSidebar: React.FC<IFilterSidebarProps> = ({
  filters,
  quickOptions,
  portfolioOptions,
  assetTypeOptions,
  availabilityOptions,
  geographyOptions,
  themeOptions,
  ratingOptions,
  onChange,
  onClear,
}) => {
  const patchFilters = React.useCallback(
    (patch: Partial<IFilterState>) => onChange({ ...filters, ...patch }),
    [filters, onChange]
  );

  const renderSectionLabel = (label: string): React.ReactNode => (
    <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
      {label}
          <InfoOutlinedIcon sx={(theme) => ({ fontSize: 14, color: getModeTokens(theme.palette.mode).muted2 })} />
    </Typography>
  );

  return (
    <Box
      sx={(theme) => {
        const t = getModeTokens(theme.palette.mode);
        return {
          position: { xs: 'static', lg: 'sticky' },
          top: 16,
          maxHeight: { xs: 'none', lg: 'calc(120vh)' }, // -106px
          overflowY: 'auto',
          bgcolor: t.surface,
          border: `1px solid ${t.borderSoft}`,
          borderRadius: '20px',
          boxShadow: `0 18px 40px ${theme.palette.mode === 'light' ? 'rgba(40,60,20,.08)' : 'rgba(0,0,0,.22)'}`,
          '&::-webkit-scrollbar': {
            width: '12px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.mode === 'dark' ? '#0a0e0a' : '#f4f7ef',
            borderLeft: `1px solid ${t.borderSoft}`,
            borderTopRightRadius: '19px',
            borderBottomRightRadius: '19px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.mode === 'dark' ? '#dcdcdc' : '#8a9880',
            borderRadius: '10px',
            border: `3px solid ${theme.palette.mode === 'dark' ? '#0a0e0a' : '#f4f7ef'}`,
          },
          '&::-webkit-scrollbar-button:single-button': {
            display: 'block',
            height: '14px',
          },
          '&::-webkit-scrollbar-button:single-button:vertical:decrement': {
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='9' height='9' viewBox='0 0 24 24'><path fill='${theme.palette.mode === 'dark' ? '%23dcdcdc' : '%238a9880'}' d='M5 16l7-7 7 7z'/></svg>")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 5px',
          },
          '&::-webkit-scrollbar-button:single-button:vertical:increment': {
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='9' height='9' viewBox='0 0 24 24'><path fill='${theme.palette.mode === 'dark' ? '%23dcdcdc' : '%238a9880'}' d='M5 8l7 7 7-7z'/></svg>")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 4px',
          },
        };
      }}
    >
      <Box sx={sectionSx}>
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          Refine within results
        </Typography>
        <TextField
          value={filters.refineText}
          onChange={(event) => patchFilters({ refineText: event.target.value })}
          placeholder="Filter these results"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 17, mr: 1 })} />,
            endAdornment: filters.refineText ? (
              <Box
                component="button"
                type="button"
                onClick={() => patchFilters({ refineText: '' })}
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    width: 20,
                    height: 20,
                    border: 0,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    color: t.muted2,
                    bgcolor: t.panel2,
                  };
                }}
              >
                <CloseIcon sx={{ fontSize: 12 }} />
              </Box>
            ) : undefined,
          }}
          sx={(theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: t.panel,
                color: t.text,
                fontSize: 13.5,
                '& fieldset': { borderColor: t.borderSoft },
                '&:hover fieldset': { borderColor: t.border },
                '&.Mui-focused fieldset': { borderColor: t.green, boxShadow: '0 0 0 3px rgba(134,188,37,.12)' },
              },
              '& input::placeholder': { color: t.muted2, fontStyle: 'italic', opacity: 1 },
            };
          }}
        />
      </Box>

      <Box sx={sectionSx}>
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          Quick Filters
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {quickOptions.map((option) => {
            const active = filters.quick.includes(option.value);
            return (
              <Chip
                key={option.value}
                label={option.label}
                clickable
                onClick={() => patchFilters({ quick: toggleValue(filters.quick, option.value) })}
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    height: 28,
                    borderRadius: '16px',
                    color: active ? etpTokens.ink : t.muted,
                    bgcolor: active ? 'transparent' : 'transparent',
                    background: active ? `linear-gradient(120deg, ${t.lime}, ${t.green})` : 'transparent',
                    border: active ? '1px solid transparent' : `1px solid ${t.borderSoft}`,
                    fontSize: 12,
                    fontWeight: 700,
                    '&:hover': {
                      color: active ? etpTokens.ink : t.text,
                      borderColor: active ? 'transparent' : t.border,
                    },
                  };
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Box sx={sectionSx}>
        {renderSectionLabel('Country / Geography')}
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1 }}>
          {geographyOptions.slice(0, 5).map((option) => {
            const active = filters.geography.includes(option.value);
            const flag = geographyFlags[option.label] || geographyFlags[option.value] || '';
            return (
              <Chip
                key={option.value}
                label={`${flag ? `${flag} ` : ''}${option.label}`}
                clickable
                onClick={() => patchFilters({ geography: toggleValue(filters.geography, option.value) })}
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    height: 27,
                    borderRadius: '15px',
                    color: active ? t.text : t.muted,
                    bgcolor: active ? t.panel2 : 'transparent',
                    border: `1px solid ${active ? t.border : t.borderSoft}`,
                    fontSize: 12.25,
                    fontWeight: 800,
                    '& .MuiChip-label': { px: 1 },
                    '&:hover': {
                      color: t.text,
                      bgcolor: t.panel,
                      borderColor: t.border,
                    },
                  };
                }}
              />
            );
          })}
        </Box>
        <CompactMultiSelect
          value={filters.geography}
          options={geographyOptions}
          onChange={(nextValue) => patchFilters({ geography: nextValue })}
        />
      </Box>

      <Box sx={sectionSx}>
        {renderSectionLabel('Theme / Solution')}
        <CompactMultiSelect
          value={filters.themes}
          options={themeOptions}
          onChange={(nextValue) => patchFilters({ themes: nextValue })}
        />
      </Box>

      <Box sx={sectionSx}>
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          Data Residency
        </Typography>
        <Box sx={{ mx: -0.75, px: 0.5 }}>
          {[
            { value: 'all', label: 'All assets' },
            { value: 'required', label: 'Data residency required' },
            { value: 'none', label: 'No data restriction' },
          ].map((option) => {
            const active = filters.residency === option.value;
            return (
              <Box
                key={option.value}
                onClick={() => patchFilters({ residency: option.value as IFilterState['residency'] })}
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.125,
                    py: 0.75,
                    borderRadius: '9px',
                    cursor: 'pointer',
                    color: active ? t.text : t.muted,
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    bgcolor: active ? t.panel : 'transparent',
                    '&:hover': { bgcolor: t.panel, color: t.text },
                    '&:before': active ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 8,
                      bottom: 8,
                      width: 3,
                      borderRadius: 3,
                      background: `linear-gradient(180deg, ${t.lime}, ${t.green})`,
                    } : undefined,
                  };
                }}
              >
                <Box
                  sx={(theme) => ({
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: active ? getModeTokens(theme.palette.mode).lime : 'text.disabled',
                    flexShrink: 0,
                  })}
                />
                <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {option.label}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={sectionSx}>
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          L3 Portfolios
        </Typography>
        <Box sx={{ mx: -0.75, px: 0.5 }}>
          {portfolioOptions.map((option) => {
            const active = filters.portfolio === option.value;
            return (
              <Box
                key={option.value}
                onClick={() => patchFilters({ portfolio: option.value })}
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.125,
                    py: 0.75,
                    borderRadius: '9px',
                    cursor: 'pointer',
                    color: active ? t.text : t.muted,
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    bgcolor: active ? t.panel : 'transparent',
                    '&:hover': { bgcolor: t.panel, color: t.text },
                    '&:before': active ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 8,
                      bottom: 8,
                      width: 3,
                      borderRadius: 3,
                      background: `linear-gradient(180deg, ${t.lime}, ${t.green})`,
                    } : undefined,
                  };
                }}
              >
                <Box
                  sx={(theme) => ({
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: active ? getModeTokens(theme.palette.mode).lime : 'text.disabled',
                    flexShrink: 0,
                  })}
                />
                <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {option.label}
                </Box>
                <Chip
                  label={option.count || 0}
                  size="small"
                  sx={(theme) => {
                    const t = getModeTokens(theme.palette.mode);
                    return {
                      height: 20,
                      borderRadius: '20px',
                      bgcolor: t.panel2,
                      color: active ? t.lime : t.muted2,
                      fontSize: 11,
                      fontWeight: 700,
                    };
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={sectionSx}>
        {renderSectionLabel('Asset Type')}
        <CompactMultiSelect
          value={filters.assetTypes}
          options={assetTypeOptions}
          onChange={(nextValue) => patchFilters({ assetTypes: nextValue })}
        />
      </Box>

      <Box sx={sectionSx}>
        {renderSectionLabel('Availability')}
        <CompactMultiSelect
          value={filters.availability}
          options={availabilityOptions}
          onChange={(nextValue) => patchFilters({ availability: nextValue })}
        />
      </Box>

      <Box sx={sectionSx}>
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          Minimum Rating
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {ratingOptions.map((option) => {
            const active = filters.minRating === option.value;
            return (
              <Chip
                key={option.value}
                label={option.label}
                clickable
                onClick={() => patchFilters({ minRating: option.value })}
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    height: 28,
                    borderRadius: '16px',
                    color: active ? etpTokens.ink : t.muted,
                    background: active ? `linear-gradient(120deg, ${t.lime}, ${t.green})` : 'transparent',
                    border: active ? '1px solid transparent' : `1px solid ${t.borderSoft}`,
                    fontSize: 12,
                    fontWeight: 700,
                  };
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Box sx={{ px: 2, py: 1.625 }}>
        <Button
          fullWidth
          startIcon={<CloseIcon />}
          onClick={onClear}
          sx={(theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
              py: 0.875,
              borderRadius: '11px',
              color: t.muted,
              bgcolor: t.panel,
              border: `1px solid ${t.borderSoft}`,
              '&:hover': {
                color: t.spectrum[0],
                borderColor: `${t.spectrum[0]}66`,
                bgcolor: t.panel,
              },
            };
          }}
        >
          Clear all filters
        </Button>
      </Box>
    </Box>
  );
};

export default FilterSidebar;


