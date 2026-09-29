import * as React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AssetCard from '../../components/Assets/AssetCard';
import { PortalNavKey } from '../../components/Layout/NavigationBar';
import { IAsset } from '../../models/IAsset';
import { etpTokens, getModeTokens } from '../../theme/etpTheme';

export interface IHomeComponentProps {
  assets: IAsset[];
  loading: boolean;
  onAssetSelect: (asset: IAsset) => void;
  onNavigate: (nav: PortalNavKey) => void;
}

const HomeComponent: React.FC<IHomeComponentProps> = ({ assets, loading, onAssetSelect, onNavigate }) => {
  const [heroIndex, setHeroIndex] = React.useState<number>(0);

  const trendingAssets = React.useMemo(() => (
    [...assets].sort((a, b) => b.downloads - a.downloads || b.rating - a.rating).slice(0, 8)
  ), [assets]);

  const agenticAssets = React.useMemo(() => (
    assets
      .filter((asset) => asset.badge === 'agentic')
      .sort((a, b) => b.rating - a.rating || b.downloads - a.downloads)
      .slice(0, 8)
  ), [assets]);

  const freshAssets = React.useMemo(() => (
    [...assets]
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 8)
  ), [assets]);

  const portfolioCount = React.useMemo(() => {
    return new Set(assets.map((asset) => asset.portfolioName)).size;
  }, [assets]);

  React.useEffect(() => {
    setHeroIndex(0);
  }, [trendingAssets.length]);

  const heroAssets = trendingAssets.slice(0, 3);
  const heroAsset = heroAssets[heroIndex] || trendingAssets[0] || assets[0];

  React.useEffect(() => {
    if (heroAssets.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroAssets.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [heroAssets.length]);

  const renderAssetRow = (rowAssets: IAsset[]) => {
    return (
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: { xs: 'minmax(256px, 84vw)', sm: '260px', lg: '284px' },
          gap: 2,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x proximity',
          pb: 1,
          mx: { xs: -2.25, md: -0.5 },
          px: { xs: 2.25, md: 0.5 },
          '& > *': { scrollSnapAlign: 'start' },
          '&::-webkit-scrollbar': { height: 0 },
          scrollbarWidth: 'none',
        }}
      >
        {rowAssets.map((asset, index) => (
          <Box key={asset.id} sx={{ minHeight: 346 }}>
            <AssetCard asset={asset} index={index} onSelect={onAssetSelect} />
          </Box>
        ))}
      </Box>
    );
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    rowAssets: IAsset[],
    nav: PortalNavKey,
  ) => (
    <Box component="section" sx={{ mt: { xs: 4, md: 5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
        <Box
          sx={(theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
              width: 28,
              height: 28,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              borderRadius: '8px',
              color: t.lime,
              bgcolor: t.panel,
              border: `1px solid ${t.border}`,
              '& svg': { fontSize: 16 },
            };
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            flex: 1,
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
            fontSize: { xs: 20, md: 22 },
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          {title}
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          onClick={() => onNavigate(nav)}
          sx={(theme) => ({
            minWidth: 0,
            color: getModeTokens(theme.palette.mode).lime,
            fontSize: 12,
            fontWeight: 900,
            whiteSpace: 'nowrap',
            '& .MuiButton-endIcon': { ml: 0.75 },
          })}
        >
          See all
        </Button>
      </Box>
      {renderAssetRow(rowAssets)}
    </Box>
  );

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
          Deloitte ET&amp;P &middot; Asset Hub
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
            fontSize: { xs: 34, md: 40 },
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 1.08,
            maxWidth: 780,
          }}
        >
          Welcome back, Ashish
        </Typography>
        <Typography
          sx={(theme) => ({
            color: getModeTokens(theme.palette.mode).muted,
            fontSize: { xs: 17, md: 19 },
            fontWeight: 500,
            lineHeight: 1.4,
            mt: 1,
            maxWidth: 820,
          })}
        >
          {loading ? '-' : assets.length} curated assets across {loading ? '-' : portfolioCount} portfolios &mdash; discover, preview and deploy in minutes.
        </Typography>
      </Box>

      {heroAsset && (
        <Box
          component="section"
          sx={(theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
              position: 'relative',
              minHeight: { xs: 430, md: 396 },
              display: 'flex',
              alignItems: 'flex-end',
              overflow: 'hidden',
              borderRadius: '22px',
              border: `1px solid ${t.borderSoft}`,
              bgcolor: t.surface2,
              boxShadow: `0 26px 70px ${t.shadow}`,
              '@keyframes heroImageDrift': {
                '0%': { opacity: 0, transform: 'scale(1)' },
                '14%': { opacity: 1 },
                '100%': { opacity: 1, transform: 'scale(1.065)' },
              },
              '@keyframes heroContentFade': {
                from: { opacity: 0, transform: 'translateY(8px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            };
          }}
        >
          <Box
            key={`hero-image-${heroAsset.id}`}
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              backgroundImage: `url("${heroAsset.heroImageUrl || heroAsset.thumbnailUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animation: 'heroImageDrift 5s ease-out both',
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
                opacity: 1,
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background: 'linear-gradient(90deg, rgba(7,11,8,.98) 0%, rgba(7,11,8,.84) 31%, rgba(7,11,8,.32) 66%, rgba(7,11,8,.12) 100%)',
            }}
          />
          <Box
            key={`hero-content-${heroAsset.id}`}
            sx={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              p: { xs: 2.25, sm: 3.25, md: 4.5 },
              pb: { xs: 3, md: 4 },
              // animation: 'heroContentFade .42s ease-out both',
              // '@media (prefers-reduced-motion: reduce)': {
              //   animation: 'none',
              // },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1.75 }}>
              <Chip
                icon={<LocalFireDepartmentOutlinedIcon />}
                label={`#${heroIndex + 1} Trending`}
                size="small"
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    height: 26,
                    borderRadius: '18px',
                    color: etpTokens.ink,
                    bgcolor: t.lime,
                    fontSize: 11,
                    fontWeight: 900,
                    '& .MuiChip-icon': { color: etpTokens.ink, fontSize: 14 },
                  };
                }}
              />
              <Chip
                icon={<StarRoundedIcon />}
                label={heroAsset.rating.toFixed(1)}
                size="small"
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    height: 26,
                    borderRadius: '18px',
                    color: '#fff',
                    bgcolor: 'rgba(6,10,7,.64)',
                    border: '1px solid rgba(255,255,255,.18)',
                    backdropFilter: 'blur(8px)',
                    fontSize: 11,
                    fontWeight: 900,
                    '& .MuiChip-icon': { color: t.lime, fontSize: 14 },
                  };
                }}
              />
              <Chip
                label={heroAsset.portfolioName}
                size="small"
                sx={{
                  height: 26,
                  borderRadius: '18px',
                  color: '#fff',
                  bgcolor: 'rgba(6,10,7,.64)',
                  border: '1px solid rgba(255,255,255,.18)',
                  backdropFilter: 'blur(8px)',
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '.4px',
                }}
              />
            </Box>

            <Typography
              sx={{
                maxWidth: 560,
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
                fontSize: { xs: 36, md: 40 },
                fontWeight: 900,
                lineHeight: 1.02,
                color: '#fff',
              }}
            >
              {heroAsset.title}
            </Typography>
            <Typography
              sx={{
                maxWidth: 530,
                color: 'rgba(244,247,244,.86)',
                fontSize: { xs: 14, md: 15 },
                lineHeight: 1.5,
                mt: 2,
              }}
            >
              {heroAsset.description}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.25, mt: 3 }}>
              <Button
                startIcon={<VisibilityOutlinedIcon />}
                onClick={() => onAssetSelect(heroAsset)}
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    px: 2.2,
                    py: 1.1,
                    borderRadius: '10px',
                    color: etpTokens.ink,
                    background: `linear-gradient(120deg, ${t.lime}, ${t.green})`,
                    fontSize: 13,
                    fontWeight: 900,
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      background: `linear-gradient(120deg, ${t.lime}, ${t.green})`,
                    },
                  };
                }}
              >
                View details
              </Button>
              <Button
                startIcon={<DownloadOutlinedIcon />}
                onClick={() => onAssetSelect(heroAsset)}
                sx={{
                  px: 2.1,
                  py: 1.05,
                  borderRadius: '10px',
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.16)',
                  backdropFilter: 'blur(10px)',
                  fontSize: 13,
                  fontWeight: 900,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,.1)',
                    borderColor: 'rgba(255,255,255,.28)',
                  },
                }}
              >
                Get asset
              </Button>
            </Box>

            <Box sx={{ position: 'absolute', right: { xs: 18, md: 30 }, bottom: { xs: 18, md: 30 }, zIndex: 5, display: 'flex', gap: 0.75 }}>
              {heroAssets.map((asset, index) => (
                <Box
                  key={asset.id}
                  component="button"
                  type="button"
                  aria-label={`Show ${asset.title}`}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    setHeroIndex(index);
                  }}
                  sx={(theme) => {
                    const active = index === heroIndex;
                    return {
                      width: active ? 22 : 8,
                      height: 8,
                      p: 0,
                      border: 0,
                      borderRadius: 10,
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                      bgcolor: active ? getModeTokens(theme.palette.mode).lime : 'rgba(255,255,255,.35)',
                      transition: '.2s',
                      '&:hover': {
                        bgcolor: active ? getModeTokens(theme.palette.mode).lime : 'rgba(255,255,255,.62)',
                      },
                      '&:focus-visible': {
                        outline: `2px solid ${getModeTokens(theme.palette.mode).lime}`,
                        outlineOffset: 3,
                      },
                    };
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {renderSection('Trending this week', <LocalFireDepartmentOutlinedIcon />, trendingAssets, 'popular')}
      {renderSection('Powerful Agentic AI', <AutoAwesomeIcon />, agenticAssets, 'agentic')}
      {renderSection('Fresh picks', <RocketLaunchOutlinedIcon />, freshAssets, 'explore')}
    </>
  );
};

export default HomeComponent;
