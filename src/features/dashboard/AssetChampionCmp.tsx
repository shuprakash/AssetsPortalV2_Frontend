import * as React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import {
  assetChampions,
  championRegionByKey,
  championRegionFilters,
  ChampionRegionFilter,
  getChampionRegionCount,
  IAssetChampion,
  IChampionFlag,
} from '../../data/assetChampions';
import { IAsset } from '../../models/IAsset';
import { etpTokens, getModeTokens } from '../../theme/etpTheme';

export interface IAssetChampionCmpProps {
  assets: IAsset[];
  onAssetSelect: (asset: IAsset) => void;
}

const FlagMark: React.FC<{ flag: IChampionFlag }> = ({ flag }) => (
  <Box
    component="span"
    sx={{
      width: 14,
      height: 10,
      display: 'inline-grid',
      placeItems: 'center',
      flexShrink: 0,
      borderRadius: '2px',
      background: flag.background,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.35)',
      color: flag.color || '#fff',
      fontSize: 8,
      fontWeight: 900,
      lineHeight: 1,
    }}
  >
    {flag.label || ''}
  </Box>
);

const RegionChip: React.FC<{ champion: IAssetChampion }> = ({ champion }) => {
  const region = championRegionByKey[champion.region];

  return (
    <Chip
      label={(
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.625 }}>
          <FlagMark flag={region.flag} />
          {region.label}
        </Box>
      )}
      size="small"
      sx={(theme) => {
        const t = getModeTokens(theme.palette.mode);
        return {
          height: 23,
          borderRadius: '14px',
          color: t.text,
          bgcolor: t.panel,
          border: `1px solid ${t.borderSoft}`,
          fontSize: 11,
          fontWeight: 800,
          '& .MuiChip-label': { px: 1 },
        };
      }}
    />
  );
};

const ChampionCard: React.FC<{ champion: IAssetChampion; featured: boolean }> = ({ champion, featured }) => (
  <Box
    sx={(theme) => {
      const t = getModeTokens(theme.palette.mode);
      return {
        minHeight: 192,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        borderRadius: '16px',
        bgcolor: t.surface,
        border: `1px solid ${featured ? t.border : t.borderSoft}`,
        boxShadow: featured ? `0 16px 34px rgba(134,188,37,.06)` : 'none',
        transition: '.24s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: t.border,
          boxShadow: `0 22px 48px ${t.shadow}`,
        },
      };
    }}
  >
    <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
      <Box
        sx={(theme) => {
          const t = getModeTokens(theme.palette.mode);
          return {
            width: 46,
            height: 46,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            borderRadius: '14px',
            color: t.lime,
            bgcolor: theme.palette.mode === 'light' ? '#e7f4d3' : '#10170d',
            border: `1px solid ${t.border}`,
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
            fontSize: 16,
            fontWeight: 900,
          };
        }}
      >
        {champion.initials}
      </Box>

      <Box sx={{ minWidth: 0, pt: 0.5 }}>
        <Typography sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontSize: 15, fontWeight: 900, lineHeight: 1.15 }}>
          {champion.name}
        </Typography>
        <Typography sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 12, lineHeight: 1.35, mt: 0.25 })}>
          {champion.role}
        </Typography>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
      <RegionChip champion={champion} />
    </Box>

    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.625, mt: 1.375 }}>
      {champion.portfolios.map((portfolio) => (
        <Chip
          key={portfolio}
          label={portfolio}
          size="small"
          sx={(theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
              height: 21,
              borderRadius: '5px',
              color: t.lime,
              bgcolor: 'rgba(134,188,37,.14)',
              border: `1px solid ${t.border}`,
              textTransform: 'uppercase',
              letterSpacing: '.3px',
              fontSize: 10,
              fontWeight: 900,
              '& .MuiChip-label': { px: 0.875 },
            };
          }}
        />
      ))}
    </Box>

    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mt: 'auto',
        pt: 1.5,
        borderTop: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`,
      })}
    >
      <Typography sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 0.625 })}>
        <LayersOutlinedIcon sx={(theme) => ({ color: getModeTokens(theme.palette.mode).lime, fontSize: 15 })} />
        {champion.assetCount} assets
      </Typography>
      <Typography sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 0.625 })}>
        <AccessTimeIcon sx={(theme) => ({ color: getModeTokens(theme.palette.mode).lime, fontSize: 15 })} />
        since {champion.since}
      </Typography>
      <Button
        endIcon={<ArrowForwardIcon />}
        sx={(theme) => ({
          ml: 'auto',
          minWidth: 0,
          p: 0,
          color: getModeTokens(theme.palette.mode).lime,
          fontSize: 12.5,
          fontWeight: 900,
          whiteSpace: 'nowrap',
          '&:hover': { bgcolor: 'transparent', transform: 'translateX(2px)' },
          '& .MuiButton-endIcon': { ml: 0.75 },
        })}
      >
        View profile
      </Button>
    </Box>
  </Box>
);

const AssetChampionCmp: React.FC<IAssetChampionCmpProps> = () => {
  const [selectedRegion, setSelectedRegion] = React.useState<ChampionRegionFilter>('all');

  const visibleChampions = React.useMemo(() => (
    selectedRegion === 'all'
      ? assetChampions
      : assetChampions.filter((champion) => champion.region === selectedRegion)
  ), [selectedRegion]);

  return (
    <>
      <Box sx={{ mb: 3 }}>
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
          Network
        </Typography>
        <Typography sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontSize: { xs: 32, md: 40 }, fontWeight: 900, letterSpacing: 0, lineHeight: 1.05 }}>
          Asset Champions
        </Typography>
        <Typography sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 14.5, mt: 1, maxWidth: 880 })}>
          Every geography has a champion who owns the assets in that market - find yours and reach out directly.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 0.75,
          mb: 3,
          '&::-webkit-scrollbar': { height: 0 },
          scrollbarWidth: 'none',
        }}
      >
        {championRegionFilters.map((filter) => {
          const active = selectedRegion === filter.key;
          return (
            <Button
              key={filter.key}
              onClick={() => setSelectedRegion(filter.key)}
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                  flexShrink: 0,
                  px: 1.85,
                  py: 1,
                  borderRadius: '20px',
                  color: active ? etpTokens.ink : t.muted,
                  bgcolor: active ? t.lime : t.panel,
                  border: `1px solid ${active ? t.lime : t.borderSoft}`,
                  fontSize: 13,
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    color: active ? etpTokens.ink : t.text,
                    bgcolor: active ? t.lime : t.panel2,
                    borderColor: t.border,
                  },
                };
              }}
            >
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.625 }}>
                {filter.region && <FlagMark flag={filter.region.flag} />}
                {filter.label}
              </Box>
              <Box component="span" sx={{ ml: 0.75, opacity: active ? 0.7 : 0.55 }}>
                {getChampionRegionCount(filter.key)}
              </Box>
            </Button>
          );
        })}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        {visibleChampions.map((champion, index) => (
          <ChampionCard
            key={`${champion.region}-${champion.name}`}
            champion={champion}
            featured={selectedRegion === 'all' && index === 0}
          />
        ))}
      </Box>
    </>
  );
};

export default AssetChampionCmp;
