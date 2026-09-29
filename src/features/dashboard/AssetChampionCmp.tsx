import * as React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { IAsset } from '../../models/IAsset';
import { assetChampions, ChampionRegion, IAssetChampion } from '../../data/assetChampions';
import { etpTokens, getModeTokens } from '../../theme/etpTheme';

export interface IAssetChampionCmpProps {
  assets: IAsset[];
  onAssetSelect: (asset: IAsset) => void;
}

type RegionFilter = 'all' | ChampionRegion;

const regionFilters: Array<{ key: RegionFilter; label: string }> = [
  { key: 'all', label: 'All regions' },
  { key: 'india', label: '🇮🇳 India' },
  { key: 'australia', label: '🇦🇺 Australia' },
  { key: 'middle-east', label: '🇦🇪 Middle East' },
  { key: 'japan', label: '🇯🇵 Japan' },
  { key: 'china', label: '🇨🇳 China' },
  { key: 'united-kingdom', label: '🇬🇧 United Kingdom' },
  { key: 'global', label: '🌐 Global' },
];

const getRegionCount = (region: RegionFilter): number => (
  region === 'all'
    ? assetChampions.length
    : assetChampions.filter((champion) => champion.region === region).length
);

const regionNames: Record<ChampionRegion, string> = {
  india: 'India',
  australia: 'Australia',
  'middle-east': 'Middle East',
  japan: 'Japan',
  china: 'China',
  'united-kingdom': 'United Kingdom',
  global: 'Global',
};

const flagStyles: Record<ChampionRegion, { background: string; label?: string }> = {
  india: { background: 'linear-gradient(180deg, #ff9933 0 33%, #fff 33% 66%, #138808 66%)' },
  australia: { background: '#153b8a', label: '*' },
  'middle-east': { background: 'linear-gradient(180deg, #00843d 0 33%, #fff 33% 66%, #000 66%)' },
  japan: { background: 'radial-gradient(circle, #bc002d 0 31%, #fff 33%)' },
  china: { background: '#de2910', label: '*' },
  'united-kingdom': { background: '#012169', label: '+' },
  global: { background: '#0b8fab', label: '@' },
};

const RegionChip: React.FC<{ champion: IAssetChampion }> = ({ champion }) => (
  <Chip
    label={(
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.625 }}>
        <Box
          component="span"
          sx={{
            width: 14,
            height: 10,
            display: 'inline-grid',
            placeItems: 'center',
            flexShrink: 0,
            borderRadius: '2px',
            background: flagStyles[champion.region].background,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.35)',
            color: '#fff',
            fontSize: 8,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {flagStyles[champion.region].label || ''}
        </Box>
        {regionNames[champion.region]}
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
  const [selectedRegion, setSelectedRegion] = React.useState<RegionFilter>('all');

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
        {regionFilters.map((filter) => {
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
              {filter.label}
              <Box component="span" sx={{ ml: 0.75, opacity: active ? 0.7 : 0.55 }}>
                {getRegionCount(filter.key)}
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
