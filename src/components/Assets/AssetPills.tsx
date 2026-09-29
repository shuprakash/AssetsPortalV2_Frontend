import * as React from 'react';
import { Box, Chip } from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { getModeTokens } from '../../theme/etpTheme';

export interface IAssetPillsProps {
  geography: string[];
  theme?: string;
  residencyRequired?: boolean;
  maxGeographies?: number;
}

const AssetPills: React.FC<IAssetPillsProps> = ({
  geography,
  theme,
  residencyRequired = false,
  maxGeographies = 2,
}) => {
  const visibleGeography = geography.slice(0, maxGeographies);
  const hiddenCount = geography.length - visibleGeography.length;

  return (
    <Box sx={{ display: 'flex', gap: 0.625, flexWrap: 'wrap', alignItems: 'center' }}>
      {visibleGeography.map((geo) => (
        <Chip
          key={geo}
          label={geo}
          size="small"
          sx={(themeObj) => {
            const t = getModeTokens(themeObj.palette.mode);
            return {
              height: 24,
              borderRadius: '14px',
              color: t.muted,
              bgcolor: t.panel,
              border: `1px solid ${t.borderSoft}`,
              fontSize: 11,
              fontWeight: 700,
              '& .MuiChip-label': { px: 1 },
            };
          }}
        />
      ))}
      {hiddenCount > 0 && (
        <Chip
          label={`+${hiddenCount}`}
          size="small"
          sx={(themeObj) => {
            const t = getModeTokens(themeObj.palette.mode);
            return {
              height: 24,
              borderRadius: '14px',
              color: t.muted2,
              bgcolor: t.panel,
              border: `1px solid ${t.borderSoft}`,
              fontSize: 11,
              fontWeight: 700,
            };
          }}
        />
      )}
      {theme && (
        <Chip
          label={theme}
          size="small"
          sx={(themeObj) => {
            const t = getModeTokens(themeObj.palette.mode);
            return {
              height: 24,
              borderRadius: '5px',
              color: t.muted,
              bgcolor: t.panel2,
              border: `1px solid ${t.borderSoft}`,
              textTransform: 'uppercase',
              letterSpacing: '.3px',
              fontSize: 9.5,
              fontWeight: 800,
              '& .MuiChip-label': { px: 0.875 },
            };
          }}
        />
      )}
      {residencyRequired && (
        <Chip
          icon={<ShieldOutlinedIcon />}
          label="Residency"
          size="small"
          sx={(themeObj) => {
            const t = getModeTokens(themeObj.palette.mode);
            return {
              height: 24,
              borderRadius: '5px',
              color: t.spectrum[5],
              bgcolor: themeObj.palette.mode === 'light' ? 'rgba(34,98,178,.1)' : 'rgba(59,130,214,.12)',
              border: `1px solid ${t.spectrum[5]}4d`,
              textTransform: 'uppercase',
              letterSpacing: '.3px',
              fontSize: 9.5,
              fontWeight: 800,
              '& .MuiChip-icon': { color: t.spectrum[5], fontSize: 13, ml: 0.625 },
              '& .MuiChip-label': { px: 0.75 },
            };
          }}
        />
      )}
    </Box>
  );
};

export default AssetPills;

