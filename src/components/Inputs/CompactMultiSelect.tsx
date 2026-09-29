import * as React from 'react';
import {
  Box,
  Checkbox,
  Chip,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getModeTokens } from '../../theme/etpTheme';

export interface ICompactMultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

export interface ICompactMultiSelectProps {
  value: string[];
  options: ICompactMultiSelectOption[];
  onChange: (value: string[]) => void;
  allLabel?: string;
  includeAllOption?: boolean;
  maxVisibleChips?: number;
}

const CompactMultiSelect: React.FC<ICompactMultiSelectProps> = ({
  value,
  options,
  onChange,
  allLabel = 'All',
  includeAllOption = false,
  maxVisibleChips = 2,
}) => {
  const renderSelectedValue = (selectedValues: string[]): React.ReactNode => {
    const selectedLabels = selectedValues
      .map((selectedValue) => options.find((option) => option.value === selectedValue)?.label || selectedValue)
      .slice(0, maxVisibleChips);
    const displayLabels = selectedLabels.length ? selectedLabels : [allLabel];
    const hiddenCount = selectedValues.length - selectedLabels.length;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625, flexWrap: 'wrap', minHeight: 26 }}>
        {displayLabels.map((label) => (
          <Chip
            key={label}
            label={label}
            size="small"
            deleteIcon={<CloseIcon />}
            onDelete={(event) => {
              event.stopPropagation();
              if (selectedValues.length) {
                onChange(selectedValues.filter((selectedValue) => (
                  (options.find((option) => option.value === selectedValue)?.label || selectedValue) !== label
                )));
              }
            }}
            onMouseDown={(event) => event.stopPropagation()}
            sx={(theme) => {
              const t = getModeTokens(theme.palette.mode);
              return {
                height: 25,
                borderRadius: '8px',
                color: t.text,
                bgcolor: t.panel2,
                border: `1px solid ${t.borderSoft}`,
                fontSize: 12.5,
                fontWeight: 800,
                '& .MuiChip-label': { px: 0.875 },
                '& .MuiChip-deleteIcon': {
                  color: t.muted,
                  fontSize: 14,
                  mr: 0.625,
                  '&:hover': { color: t.spectrum[0] },
                },
              };
            }}
          />
        ))}
        {hiddenCount > 0 && (
          <Typography sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 12, fontWeight: 800 })}>
            +{hiddenCount}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Select
      multiple
      fullWidth
      displayEmpty
      value={value}
      IconComponent={KeyboardArrowDownIcon}
      onChange={(event) => {
        const nextValue = event.target.value;
        const nextValues = typeof nextValue === 'string' ? nextValue.split(',') : nextValue;
        onChange(nextValues.includes('') ? [] : nextValues);
      }}
      renderValue={(selected) => renderSelectedValue(selected as string[])}
      MenuProps={{
        PaperProps: {
          sx: (theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
              mt: 0.75,
              bgcolor: t.surface,
              color: t.text,
              border: `1px solid ${t.borderSoft}`,
              borderRadius: '12px',
              boxShadow: `0 18px 40px ${t.shadow}`,
              '& .MuiMenuItem-root': {
                fontSize: 12.75,
                minHeight: 33,
                py: 0.375,
                '&.Mui-selected': { bgcolor: t.panel },
                '&.Mui-selected:hover, &:hover': { bgcolor: t.panel2 },
              },
            };
          },
        },
      }}
      sx={(theme) => {
        const t = getModeTokens(theme.palette.mode);
        return {
          minHeight: 44,
          borderRadius: '13px',
          bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,.78)' : 'rgba(255,255,255,.035)',
          color: t.text,
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            minHeight: '26px !important',
            py: 0.875,
            pl: 1.125,
            pr: 4.5,
          },
          '& fieldset': { borderColor: t.borderSoft },
          '&:hover fieldset': { borderColor: t.border },
          '&.Mui-focused fieldset': { borderColor: t.green },
          '& .MuiSelect-icon': { color: t.muted, right: 10 },
        };
      }}
    >
      {includeAllOption && (
        <MenuItem value="">
          <Checkbox
            checked={value.length === 0}
            size="small"
            sx={(theme) => ({ p: 0.375, mr: 0.75, '&.Mui-checked': { color: getModeTokens(theme.palette.mode).lime } })}
          />
          <ListItemText primary={allLabel} />
        </MenuItem>
      )}
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Checkbox
            checked={value.includes(option.value)}
            size="small"
            sx={(theme) => ({ p: 0.375, mr: 0.75, '&.Mui-checked': { color: getModeTokens(theme.palette.mode).lime } })}
          />
          <ListItemText primary={option.label} sx={{ minWidth: 0 }} />
          {typeof option.count === 'number' && (
            <Typography sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 13, ml: 2 })}>
              {option.count}
            </Typography>
          )}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CompactMultiSelect;
