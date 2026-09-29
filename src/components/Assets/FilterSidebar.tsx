import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
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
  py: 2,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

const labelSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.875,
  fontSize: 11,
  letterSpacing: '1.3px',
  textTransform: 'uppercase',
  fontWeight: 800,
  mb: 1.375,
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

  const renderMultiOptions = (
    key: 'assetTypes' | 'availability' | 'geography' | 'themes',
    options: IFilterOption[],
    maxHeight: number = 230
  ): React.ReactNode => (
    <Box sx={{ maxHeight, overflowY: 'auto', mx: -0.75, px: 0.5 }}>
      {options.map((option) => {
        const checked = filters[key].includes(option.value);
        return (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={checked}
                onChange={() => patchFilters({ [key]: toggleValue(filters[key], option.value) } as Partial<IFilterState>)}
                size="small"
                sx={(theme) => ({
                  color: 'divider',
                  p: 0.5,
                  '&.Mui-checked': { color: getModeTokens(theme.palette.mode).lime },
                })}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Typography sx={{ flex: 1, minWidth: 0, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {option.label}
                </Typography>
                {typeof option.count === 'number' && (
                  <Chip
                    label={option.count}
                    size="small"
                    sx={(theme) => {
                      const t = getModeTokens(theme.palette.mode);
                      return {
                        height: 20,
                        borderRadius: '20px',
                        bgcolor: t.panel2,
                        color: checked ? t.lime : t.muted2,
                        fontSize: 11,
                        fontWeight: 700,
                      };
                    }}
                  />
                )}
              </Box>
            }
            sx={(theme) => {
              const t = getModeTokens(theme.palette.mode);
              return {
                display: 'flex',
                alignItems: 'center',
                m: 0,
                px: 0.5,
                py: 0.5,
                borderRadius: '9px',
                color: checked ? t.text : t.muted,
                '&:hover': { bgcolor: t.panel, color: t.text },
                '& .MuiFormControlLabel-label': { flex: 1, minWidth: 0 },
              };
            }}
          />
        );
      })}
    </Box>
  );

  return (
    <Box
      sx={(theme) => {
        const t = getModeTokens(theme.palette.mode);
        return {
          position: { xs: 'static', lg: 'sticky' },
          top: 16,
          maxHeight: { xs: 'none', lg: 'calc(100vh - 106px)' },
          overflowY: 'auto',
          bgcolor: t.surface,
          border: `1px solid ${t.borderSoft}`,
          borderRadius: '20px',
          boxShadow: `0 18px 40px ${theme.palette.mode === 'light' ? 'rgba(40,60,20,.08)' : 'rgba(0,0,0,.22)'}`,
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
        <Box sx={{ display: 'flex', gap: 0.875, flexWrap: 'wrap' }}>
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
                    height: 30,
                    borderRadius: '18px',
                    color: active ? etpTokens.ink : t.muted,
                    bgcolor: active ? 'transparent' : 'transparent',
                    background: active ? `linear-gradient(120deg, ${t.lime}, ${t.green})` : 'transparent',
                    border: active ? '1px solid transparent' : `1px solid ${t.borderSoft}`,
                    fontSize: 12.5,
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
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          Country / Geography
        </Typography>
        {renderMultiOptions('geography', geographyOptions, 180)}
      </Box>

      <Box sx={sectionSx}>
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          Theme / Solution
        </Typography>
        {renderMultiOptions('themes', themeOptions)}
      </Box>

      <Box sx={sectionSx}>
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          Data Residency
        </Typography>
        <RadioGroup
          value={filters.residency}
          onChange={(event) => patchFilters({ residency: event.target.value as IFilterState['residency'] })}
        >
          {[
            { value: 'all', label: 'All assets' },
            { value: 'required', label: 'Data residency required' },
            { value: 'none', label: 'No data restriction' },
          ].map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio size="small" sx={(theme) => ({ color: 'divider', '&.Mui-checked': { color: getModeTokens(theme.palette.mode).lime } })} />}
              label={<Typography sx={{ fontSize: 13 }}>{option.label}</Typography>}
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                  m: 0,
                  borderRadius: '9px',
                  color: filters.residency === option.value ? t.text : t.muted,
                  '&:hover': { bgcolor: t.panel },
                };
              }}
            />
          ))}
        </RadioGroup>
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
                    gap: 1.125,
                    px: 1.25,
                    py: 1,
                    borderRadius: '9px',
                    cursor: 'pointer',
                    color: active ? t.text : t.muted,
                    fontSize: 13.5,
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
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          Asset Type
        </Typography>
        {renderMultiOptions('assetTypes', assetTypeOptions)}
      </Box>

      <Box sx={sectionSx}>
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          Availability
        </Typography>
        {renderMultiOptions('availability', availabilityOptions)}
      </Box>

      <Box sx={sectionSx}>
        <Typography sx={(theme) => ({ ...labelSx, color: getModeTokens(theme.palette.mode).muted })}>
          Minimum Rating
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.875, flexWrap: 'wrap' }}>
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
                    height: 30,
                    borderRadius: '18px',
                    color: active ? etpTokens.ink : t.muted,
                    background: active ? `linear-gradient(120deg, ${t.lime}, ${t.green})` : 'transparent',
                    border: active ? '1px solid transparent' : `1px solid ${t.borderSoft}`,
                    fontSize: 12.5,
                    fontWeight: 700,
                  };
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        <Button
          fullWidth
          startIcon={<CloseIcon />}
          onClick={onClear}
          sx={(theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
              py: 1.125,
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

