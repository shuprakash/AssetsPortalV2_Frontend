import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { IAsset } from '../../models/IAsset';
import { etpTokens, getModeTokens } from '../../theme/etpTheme';
import { getInitials } from '../../utils/assetHelpers';
import AssetPills from './AssetPills';

export interface IAssetCardProps {
  asset: IAsset;
  index?: number;
  onSelect: (asset: IAsset) => void;
}

const AssetCard: React.FC<IAssetCardProps> = ({ asset, index = 0, onSelect }) => {
  const badgeLabel = asset.badge === 'agentic' ? 'Agentic' : asset.badge === 'genai' ? 'GenAI' : '';

  return (
    <Card
      elevation={0}
      sx={(theme) => {
        const t = getModeTokens(theme.palette.mode);
        return {
          height: '100%',
          borderRadius: '20px',
          overflow: 'hidden',
          bgcolor: t.surface,
          border: `1px solid ${t.borderSoft}`,
          color: t.text,
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeUp .5s both',
          animationDelay: `${Math.min(index, 10) * 0.04}s`,
          transition: '.28s cubic-bezier(.3,.8,.3,1)',
          '@keyframes fadeUp': {
            from: { opacity: 0, transform: 'translateY(16px)' },
            to: { opacity: 1, transform: 'none' },
          },
          '&:hover': {
            transform: 'translateY(-6px)',
            borderColor: t.border,
            boxShadow: `0 26px 50px ${t.shadow}`,
          },
          '&:hover .asset-card-img': {
            filter: 'none',
            transform: 'scale(1.07)',
          },
        };
      }}
    >
      <Box
        role="button"
        tabIndex={0}
        onClick={() => onSelect(asset)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(asset);
          }
        }}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', flex: 1 }}
      >
        <Box sx={{ position: 'relative', height: 150, overflow: 'hidden' }}>
          <CardMedia
            className="asset-card-img"
            component="img"
            src={asset.thumbnailUrl}
            alt=""
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: (theme) => getModeTokens(theme.palette.mode).imgFilter,
              transition: '.5s',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(6,10,7,.55))',
            }}
          />
          <Chip
            label={asset.portfolioName}
            size="small"
            sx={{
              position: 'absolute',
              left: 11,
              top: 11,
              height: 23,
              color: '#e9efe2',
              bgcolor: 'rgba(6,10,7,.5)',
              border: '1px solid rgba(255,255,255,.14)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '.6px',
              textTransform: 'uppercase',
            }}
          />
          <Chip
            icon={<StarRoundedIcon />}
            label={asset.rating.toFixed(1)}
            size="small"
            sx={(theme) => {
              const t = getModeTokens(theme.palette.mode);
              return {
              position: 'absolute',
              right: 11,
              top: 11,
              height: 24,
              color: '#fff',
              bgcolor: 'rgba(6,10,7,.55)',
              border: '1px solid rgba(255,255,255,.16)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              fontSize: 11.5,
              fontWeight: 800,
              '& .MuiChip-icon': { color: t.lime, fontSize: 14, ml: 0.625 },
            };
            }}
          />
          {asset.dataResidency.required && (
            <Box
              title={`Data must stay in ${asset.dataResidency.location || 'approved geography'}`}
              sx={{
                position: 'absolute',
                right: 11,
                bottom: 11,
                zIndex: 2,
                display: 'grid',
                placeItems: 'center',
                width: 26,
                height: 26,
                borderRadius: '9px',
                color: '#e9efe2',
                bgcolor: 'rgba(6,10,7,.55)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,.16)',
              }}
            >
              <ShieldOutlinedIcon sx={{ fontSize: 15 }} />
            </Box>
          )}
        </Box>

        <CardContent sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', px: 2.125, pt: 2, pb: 0.75 }}>
            <Box
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                  width: 44,
                  height: 44,
                  borderRadius: '13px',
                  mt: '-34px',
                  position: 'relative',
                  zIndex: 3,
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: '"Space Grotesk", "Inter", sans-serif',
                  fontWeight: 800,
                  fontSize: 16,
                  color: theme.palette.mode === 'light' ? t.green : t.lime,
                  bgcolor: theme.palette.mode === 'light' ? '#e7f4d3' : '#10170d',
                  border: `2px solid ${t.surface}`,
                  boxShadow: `0 8px 16px ${t.shadow}`,
                  flexShrink: 0,
                };
              }}
            >
              {getInitials(asset.title)}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
              <Typography
                sx={{
                  fontFamily: '"Space Grotesk", "Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: 15.5,
                  lineHeight: 1.25,
                  display: 'flex',
                  gap: 0.875,
                  alignItems: 'center',
                }}
              >
                <Box component="span" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {asset.title}
                </Box>
                {badgeLabel && (
                  <Chip
                    label={badgeLabel}
                    size="small"
                    sx={(theme) => {
                        const t = getModeTokens(theme.palette.mode);
                        return {
                          height: 20,
                          borderRadius: '5px',
                          color: asset.badge === 'agentic' ? t.lime : t.spectrum[5],
                      bgcolor: asset.badge === 'agentic' ? 'rgba(134,188,37,.14)' : 'rgba(56,189,248,.12)',
                          border: asset.badge === 'agentic' ? `1px solid ${t.green}` : `1px solid ${t.spectrum[5]}4d`,
                      textTransform: 'uppercase',
                      letterSpacing: '.4px',
                      fontSize: 9,
                      fontWeight: 800,
                      '& .MuiChip-label': { px: 0.875 },
                        };
                      }}
                  />
                )}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={(theme) => {
              const t = getModeTokens(theme.palette.mode);
              return {
                px: 2.125,
                pt: 0.75,
                color: t.muted,
                fontSize: 12.5,
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              };
            }}
          >
            {asset.description}
          </Typography>

          <Box sx={{ px: 2.125, pt: 1.125 }}>
            <AssetPills
              geography={asset.geography}
              theme={asset.theme}
              residencyRequired={false}
              maxGeographies={2}
            />
          </Box>

          <Box sx={{ mt: 'auto', px: 2.125, pt: 1.625, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
            <Typography
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                  color: t.muted2,
                  fontSize: 11.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.625,
                  minWidth: 0,
                };
              }}
            >
              <DownloadOutlinedIcon sx={{ fontSize: 14 }} />
              {asset.downloads} downloads
              <RemoveRedEyeOutlinedIcon sx={{ fontSize: 14, ml: 0.25 }} />
              {asset.views}
            </Typography>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onSelect(asset);
              }}
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                minWidth: 0,
                px: 2.25,
                py: 1,
                borderRadius: '20px',
                color: etpTokens.ink,
                bgcolor: 'transparent',
                background: `linear-gradient(120deg, ${t.lime}, ${t.green})`,
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
                fontSize: 12.5,
                fontWeight: 800,
                lineHeight: 1,
                '&:hover': {
                  transform: 'scale(1.05)',
                  background: `linear-gradient(120deg, ${t.lime}, ${t.green})`,
                },
              };
              }}
            >
              GET
            </Button>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default AssetCard;
