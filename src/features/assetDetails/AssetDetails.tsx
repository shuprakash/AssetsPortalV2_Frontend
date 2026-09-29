import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckIcon from '@mui/icons-material/Check';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { PaletteMode, SxProps, Theme } from '@mui/material';
import AssetCard from '../../components/Assets/AssetCard';
import AssetPills from '../../components/Assets/AssetPills';
import NavigationBar, { PortalNavKey } from '../../components/Layout/NavigationBar';
import { IAsset, IAssetFile } from '../../models/IAsset';
import { SharePointService } from '../../services/SharePointService';
import { etpTokens, getModeTokens } from '../../theme/etpTheme';
import { getInitials } from '../../utils/assetHelpers';

export interface IAssetDetailsProps {
  asset?: IAsset | null;
  mode: PaletteMode;
  onBackToDashboard: () => void;
  onBackToSearch: () => void;
  onSearch: (query: string) => void;
  onAssetSelect: (asset: IAsset) => void;
  onToggleTheme: () => void;
}

const fileIcons: Record<IAssetFile['iconType'], React.ReactNode> = {
  zip: <FolderZipOutlinedIcon />,
  file: <DescriptionOutlinedIcon />,
  video: <MovieOutlinedIcon />,
  deck: <SlideshowOutlinedIcon />,
  sheet: <TableChartOutlinedIcon />,
};

const AssetDetails: React.FC<IAssetDetailsProps> = ({
  asset,
  mode,
  onBackToDashboard,
  onBackToSearch,
  onSearch,
  onAssetSelect,
  onToggleTheme,
}) => {
  const [catalogue, setCatalogue] = useState<IAsset[]>([]);
  const [fallbackAsset, setFallbackAsset] = useState<IAsset | null>(null);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const currentAsset = asset || fallbackAsset;

  useEffect(() => {
    let mounted = true;
    const service = new SharePointService();
    service.getListItems('Assets')
      .then((items) => {
        if (!mounted) return;
        const loadedAssets = items as IAsset[];
        setCatalogue(loadedAssets);
        if (!asset && loadedAssets.length) {
          setFallbackAsset(loadedAssets[0]);
        }
      })
      .catch(() => {
        if (mounted) {
          setCatalogue([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, [asset]);

  useEffect(() => {
    setVideoPlaying(false);
  }, [currentAsset?.id]);

  const relatedAssets = useMemo(() => {
    if (!currentAsset) return [];
    return currentAsset.relatedAssetIds
      .map((id) => catalogue.find((item) => item.id === id))
      .filter((item): item is IAsset => Boolean(item))
      .slice(0, 6);
  }, [catalogue, currentAsset]);
  const modeTokens = getModeTokens(mode);
  const accentGradient = `linear-gradient(120deg, ${modeTokens.lime}, ${modeTokens.green})`;

  const handleNav = (nav: PortalNavKey): void => {
    if (nav === 'results') {
      onBackToSearch();
      return;
    }
    onBackToDashboard();
  };

  if (!currentAsset) {
    return (
      <NavigationBar
        activeNav="results"
        mode={mode}
        onSearch={onSearch}
        onNavigate={handleNav}
        onToggleTheme={onToggleTheme}
      >
        <Paper
          elevation={0}
          sx={(theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
              p: 6,
              borderRadius: '20px',
              textAlign: 'center',
              bgcolor: t.surface,
              border: `1px solid ${t.borderSoft}`,
            };
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            Select an asset to view details
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Return to the catalogue and choose an asset card.
          </Typography>
          <Button onClick={onBackToDashboard} startIcon={<ArrowBackIcon />} sx={{ color: modeTokens.lime }}>
            Back to catalogue
          </Button>
        </Paper>
      </NavigationBar>
    );
  }

  const video = currentAsset.videos[0];

  return (
    <NavigationBar
      activeNav="results"
      mode={mode}
      onSearch={onSearch}
      onNavigate={handleNav}
      onToggleTheme={onToggleTheme}
    >
      <Box
        sx={(theme) => {
          const t = getModeTokens(theme.palette.mode);
          return {
            borderRadius: '24px',
            overflow: 'hidden',
            bgcolor: t.surface,
            border: `1px solid ${t.border}`,
            boxShadow: `0 30px 70px ${t.shadow}`,
          };
        }}
      >
        <Box sx={{ position: 'relative', height: { xs: 280, md: 320 }, overflow: 'hidden' }}>
          <Box
            component="img"
            src={currentAsset.heroImageUrl}
            alt=""
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(20%) brightness(.72) saturate(1.25)',
            }}
          />
          <Box
            sx={(theme) => ({
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, rgba(6,10,7,.25) 0%, rgba(10,15,10,.5) 45%, ${getModeTokens(theme.palette.mode).surface} 99%)`,
            })}
          />
          <Box sx={{ position: 'absolute', inset: '0 0 auto 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5, zIndex: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBackToDashboard}
              sx={{
                color: '#fff',
                bgcolor: 'rgba(6,10,7,.5)',
                border: '1px solid rgba(255,255,255,.18)',
                backdropFilter: 'blur(8px)',
                borderRadius: '11px',
                px: 1.75,
                '&:hover': { bgcolor: 'rgba(6,10,7,.75)' },
              }}
            >
              Back
            </Button>
            <Stack direction="row" spacing={1}>
              <IconButton
                title="Save"
                sx={{ color: '#fff', bgcolor: 'rgba(6,10,7,.5)', border: '1px solid rgba(255,255,255,.18)', backdropFilter: 'blur(8px)', borderRadius: '11px', '&:hover': { color: modeTokens.lime, bgcolor: 'rgba(6,10,7,.66)' } }}
              >
                <BookmarkBorderIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                title="Share"
                sx={{ color: '#fff', bgcolor: 'rgba(6,10,7,.5)', border: '1px solid rgba(255,255,255,.18)', backdropFilter: 'blur(8px)', borderRadius: '11px', '&:hover': { color: modeTokens.lime, bgcolor: 'rgba(6,10,7,.66)' } }}
              >
                <MailOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 24, zIndex: 2, px: { xs: 2.5, md: 3.25 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              <Box
                sx={{
                  width: 66,
                  height: 66,
                  borderRadius: '17px',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: '"Space Grotesk", "Inter", sans-serif',
                  fontWeight: 800,
                  fontSize: 23,
                  color: modeTokens.lime,
                  bgcolor: '#10170d',
                  border: '2px solid rgba(134,188,37,.55)',
                  boxShadow: '0 10px 26px rgba(0,0,0,.55)',
                  flexShrink: 0,
                }}
              >
                {getInitials(currentAsset.title)}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={(theme) => ({
                    fontFamily: '"Space Grotesk", "Inter", sans-serif',
                    fontSize: { xs: 23, md: 31 },
                    fontWeight: 800,
                    letterSpacing: '-.5px',
                    color: theme.palette.mode === 'light' ? '#16220d' : '#fff',
                    lineHeight: 1.1,
                  })}
                >
                  {currentAsset.title}
                </Typography>
                <Box sx={(theme) => ({ display: 'flex', gap: 1.75, alignItems: 'center', color: theme.palette.mode === 'light' ? getModeTokens(theme.palette.mode).muted : '#d6ddd4', fontSize: 12.5, mt: 0.875, flexWrap: 'wrap' })}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.625 }}>
                    <StarRoundedIcon sx={{ fontSize: 15, color: modeTokens.lime }} />
                    {currentAsset.rating.toFixed(1)} rating
                  </Box>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.625 }}>
                    <LayersOutlinedIcon sx={{ fontSize: 15, color: modeTokens.lime }} />
                    {currentAsset.portfolioName}
                  </Box>
                  {currentAsset.badge && (
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.625 }}>
                      <AutoBadge />
                      {currentAsset.badge === 'agentic' ? 'Agentic AI' : 'GenAI'}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={(theme) => ({ px: { xs: 2, md: 3.25 }, py: 1.5, borderBottom: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, display: 'flex', gap: 0.5, overflowX: 'auto' })}>
          {['Preview', 'Overview', 'Capabilities', 'Impact', 'Downloads', 'Details', 'Related'].map((item, index) => (
            <Button
              key={item}
              href={`#asset-${item.toLowerCase()}`}
              sx={{
                whiteSpace: 'nowrap',
                color: index === 0 ? etpTokens.ink : 'text.secondary',
                background: index === 0 ? accentGradient : 'transparent',
                px: 1.875,
                py: 1.125,
                borderRadius: '10px',
                fontSize: 13.5,
                fontWeight: 700,
                '&:hover': { color: index === 0 ? etpTokens.ink : modeTokens.lime, bgcolor: index === 0 ? undefined : 'transparent' },
              }}
            >
              {item}
            </Button>
          ))}
        </Box>

        <Box sx={{ p: { xs: 2, md: 3.25 } }}>
          <Grid container spacing={3.75}>
            <Grid item xs={12}>
              <Grid container spacing={1.5}>
                <StatBlock accent={modeTokens.spectrum[2]} value={currentAsset.rating.toFixed(1)} label="Rating" icon={<StarRoundedIcon />} />
                <StatBlock accent={modeTokens.spectrum[3]} value={String(currentAsset.downloads)} label="Downloads" icon={<DownloadOutlinedIcon />} />
                <StatBlock accent={modeTokens.spectrum[5]} value={String(currentAsset.views)} label="Views" icon={<VisibilityOutlinedIcon />} />
                <StatBlock accent={modeTokens.spectrum[6]} value={currentAsset.version} label="Version" />
              </Grid>
            </Grid>

            <Grid item xs={12} lg={8}>
              <Stack spacing={3.75}>
                <Section id="asset-preview" label="Asset preview" accent={modeTokens.spectrum[6]}>
                  <Box
                    sx={(theme) => {
                      const t = getModeTokens(theme.palette.mode);
                      return {
                        borderRadius: '18px',
                        overflow: 'hidden',
                        bgcolor: t.surface2,
                        border: `1px solid ${t.borderSoft}`,
                        boxShadow: `0 20px 46px ${theme.palette.mode === 'light' ? 'rgba(40,60,20,.12)' : 'rgba(0,0,0,.28)'}`,
                      };
                    }}
                  >
                    <Box sx={{ position: 'relative', height: { xs: 240, md: 410 }, bgcolor: '#050805', overflow: 'hidden' }}>
                      {videoPlaying ? (
                        <Box
                          component="video"
                          src={video?.url}
                          poster={video?.posterUrl || currentAsset.heroImageUrl}
                          controls
                          autoPlay
                          playsInline
                          sx={{ width: '100%', height: '100%', objectFit: 'contain', bgcolor: '#000', display: 'block' }}
                        />
                      ) : (
                        <>
                          <Box
                            component="img"
                            src={video?.posterUrl || currentAsset.heroImageUrl}
                            alt=""
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              filter: 'grayscale(18%) brightness(.6) saturate(1.1)',
                              transition: '.6s',
                            }}
                          />
                          <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 46%, transparent 24%, rgba(4,8,5,.5) 100%)' }} />
                          <Box sx={{ position: 'absolute', left: 15, top: 15, display: 'flex', gap: 0.875, flexWrap: 'wrap' }}>
                            <Chip icon={<MovieOutlinedIcon />} label="Product walkthrough" sx={{ color: etpTokens.ink, background: accentGradient, borderRadius: '20px', fontSize: 11.5, fontWeight: 700 }} />
                            {currentAsset.badge && <Chip label={currentAsset.badge === 'agentic' ? 'Agentic AI demo' : 'GenAI demo'} sx={{ color: '#fff', bgcolor: 'rgba(6,10,7,.5)', border: '1px solid rgba(255,255,255,.16)', borderRadius: '20px', fontSize: 11.5, fontWeight: 700 }} />}
                          </Box>
                          <IconButton
                            title="Play preview"
                            onClick={() => setVideoPlaying(true)}
                            sx={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: { xs: 60, sm: 76 },
                              height: { xs: 60, sm: 76 },
                              color: etpTokens.ink,
                              background: accentGradient,
                              boxShadow: '0 14px 40px rgba(134,188,37,.45)',
                              '&:hover': { transform: 'translate(-50%, -50%) scale(1.08)', background: accentGradient },
                            }}
                          >
                            <PlayArrowIcon sx={{ fontSize: { xs: 30, sm: 38 }, ml: 0.5 }} />
                          </IconButton>
                          <Chip
                            icon={<MovieOutlinedIcon />}
                            label={video?.duration || '4:12'}
                            sx={{ position: 'absolute', right: 14, bottom: 14, color: '#fff', bgcolor: 'rgba(6,10,7,.62)', border: '1px solid rgba(255,255,255,.16)', borderRadius: '16px', fontSize: 11.5, fontWeight: 700, '& .MuiChip-icon': { color: modeTokens.lime, fontSize: 13 } }}
                          />
                        </>
                      )}
                    </Box>
                    <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderTop: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, flexWrap: 'wrap' })}>
                      <Box sx={{ flex: 1, minWidth: 220 }}>
                        <Typography sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontSize: 13.5, fontWeight: 700 }}>
                          {video?.title || `${currentAsset.title} - end-to-end walkthrough`}
                        </Typography>
                        <Typography sx={(theme) => ({ fontSize: 11.5, color: getModeTokens(theme.palette.mode).muted, mt: 0.25 })}>
                          See the {currentAsset.portfolioName} asset running on live data.
                        </Typography>
                      </Box>
                      <Button startIcon={<ReplayIcon />} onClick={() => setVideoPlaying(true)} sx={ghostButtonSx}>
                        Replay
                      </Button>
                      <Button startIcon={<FullscreenIcon />} sx={ghostButtonSx}>
                        Full screen
                      </Button>
                    </Box>
                  </Box>
                </Section>

                <Section id="asset-overview" label="Overview" accent={modeTokens.spectrum[5]}>
                  <Typography sx={{ fontSize: 14.5, lineHeight: 1.75, opacity: 0.92 }}>
                    {currentAsset.description} Built by the Deloitte ET&amp;P {currentAsset.portfolioName} portfolio, {currentAsset.title} helps teams move from problem to deployed solution faster with governance, security and enterprise integration built in.
                  </Typography>
                </Section>

                <Section id="asset-capabilities" label="Key capabilities" accent={modeTokens.spectrum[3]}>
                  <Grid container spacing={1.25}>
                    {currentAsset.capabilities.map((capability, index) => (
                      <Grid item xs={12} sm={6} key={capability}>
                        <Box sx={(theme) => ({ display: 'flex', alignItems: 'flex-start', gap: 1.25, p: 1.625, borderRadius: '13px', bgcolor: getModeTokens(theme.palette.mode).panel, border: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, fontSize: 13.5, lineHeight: 1.4 })}>
                          <Box sx={(theme) => ({ width: 22, height: 22, borderRadius: '7px', flexShrink: 0, display: 'grid', placeItems: 'center', color: getModeTokens(theme.palette.mode).lime, bgcolor: getModeTokens(theme.palette.mode).surface2, border: `1px solid ${getModeTokens(theme.palette.mode).border}`, mt: 0.125 })}>
                            <CheckIcon sx={{ fontSize: 14 }} />
                          </Box>
                          <Box>{capability}</Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Section>

                <Section id="asset-impact" label="Business impact" accent={modeTokens.spectrum[2]}>
                  <Grid container spacing={1.5}>
                    {currentAsset.impact.map((impact, index) => (
                      <Grid item xs={12} sm={4} key={impact.label}>
                        <ImpactCard value={impact.value} label={impact.label} accent={modeTokens.spectrum[(index + 1) % modeTokens.spectrum.length]} />
                      </Grid>
                    ))}
                  </Grid>
                </Section>

                <Section id="asset-related" label={`Related in ${currentAsset.portfolioName}`} accent={modeTokens.spectrum[4]}>
                  {relatedAssets.length ? (
                    <Grid container spacing={1.5}>
                      {relatedAssets.map((related, index) => (
                        <Grid item xs={12} sm={6} md={4} key={related.id}>
                          <AssetCard asset={related} index={index} onSelect={onAssetSelect} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography color="text.secondary">No related assets mapped yet.</Typography>
                  )}
                </Section>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Stack spacing={2} sx={{ position: { lg: 'sticky' }, top: 12 }}>
                <SideCard id="asset-downloads" title="Downloads & formats" accent={modeTokens.spectrum[1]}>
                  <Stack spacing={1.25}>
                    {currentAsset.files.map((file) => (
                      <FileRow key={file.id} file={file} />
                    ))}
                  </Stack>
                </SideCard>

                <SideCard id="asset-details" title="Asset details" accent={modeTokens.spectrum[4]}>
                  <Box sx={(theme) => ({ border: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, borderRadius: '15px', overflow: 'hidden' })}>
                    <SpecRow label="Portfolio" value={currentAsset.portfolioName} />
                    <SpecRow label="Theme / Solution" value={currentAsset.theme} />
                    <SpecRow label="Geography" value={<AssetPills geography={currentAsset.geography} maxGeographies={8} />} />
                    <SpecRow label="Data residency" value={currentAsset.dataResidency.required ? `Required - data must stay in ${currentAsset.dataResidency.location}` : 'No geographic restriction'} />
                    <SpecRow label="Asset type" value={currentAsset.assetType} />
                    <SpecRow label="Availability" value={currentAsset.availability} />
                    <SpecRow label="Target users" value={currentAsset.targetUsers} />
                    <SpecRow label="Tech stack" value={currentAsset.techStack} />
                    <SpecRow label="Modified" value={currentAsset.modifiedDate} />
                  </Box>
                </SideCard>

                {currentAsset.dataResidency.required && (
                  <Box sx={{ display: 'flex', gap: 1.375, alignItems: 'flex-start', p: 1.75, borderRadius: '14px', color: 'text.primary', bgcolor: 'rgba(59,130,214,.09)', border: '1px solid rgba(59,130,214,.28)' }}>
                    <ShieldOutlinedIcon sx={{ color: modeTokens.lime, fontSize: 19, mt: 0.125 }} />
                    <Box>
                      <Typography sx={{ fontSize: 12, letterSpacing: '.4px', textTransform: 'uppercase', fontWeight: 800, color: modeTokens.spectrum[5], mb: 0.375 }}>
                        Data residency required
                      </Typography>
                      <Typography sx={{ fontSize: 12.5, lineHeight: 1.5 }}>
                        This asset processes regulated data. All data must remain within {currentAsset.dataResidency.location}. Confirm hosting region before deployment.
                      </Typography>
                    </Box>
                  </Box>
                )}

                <SideCard title="Asset champion" accent={modeTokens.spectrum[6]}>
                  <LeadMini
                    name={currentAsset.owner}
                    meta={`${currentAsset.portfolioName} champion`}
                    actionIcon={<MailOutlineIcon />}
                  />
                  <LeadMini
                    name={currentAsset.createdBy}
                    meta={`Created ${currentAsset.createdDate}`}
                    actionIcon={<MailOutlineIcon />}
                  />
                </SideCard>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', gap: 1.75, px: { xs: 2, md: 3.25 }, py: 2, borderTop: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, flexWrap: 'wrap' })}>
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 800, fontSize: 16 }}>
              Free - Internal
            </Typography>
            <Typography sx={(theme) => ({ fontSize: 12, color: getModeTokens(theme.palette.mode).muted })}>
              Licensed for Deloitte ET&amp;P teams - {currentAsset.portfolioName}
            </Typography>
          </Box>
          <Button startIcon={<BookmarkBorderIcon />} sx={ghostButtonSx}>
            Save
          </Button>
          <Button
            startIcon={<DownloadOutlinedIcon />}
            sx={{ color: etpTokens.ink, background: accentGradient, borderRadius: '12px', px: 3.25, py: 1.75, '&:hover': { background: accentGradient, transform: 'translateY(-1px)' } }}
          >
            Get Asset
          </Button>
        </Box>
      </Box>
    </NavigationBar>
  );
};

const AutoBadge: React.FC = () => (
  <Box sx={(theme) => ({ width: 15, height: 15, display: 'grid', placeItems: 'center', color: getModeTokens(theme.palette.mode).lime })}>
    <StarRoundedIcon sx={{ fontSize: 15 }} />
  </Box>
);

interface ISectionProps {
  id: string;
  label: string;
  accent: string;
  children: React.ReactNode;
}

const Section: React.FC<ISectionProps> = ({ id, label, accent, children }) => (
  <Box id={id} sx={{ scrollMarginTop: 16 }}>
    <Typography
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.125,
        color: accent,
        fontSize: 12,
        letterSpacing: '1.4px',
        textTransform: 'uppercase',
        fontWeight: 800,
        mb: 1.5,
        '&:before': {
          content: '""',
          width: 7,
          height: 7,
          borderRadius: '50%',
          bgcolor: accent,
          boxShadow: `0 0 0 3px ${accent}22`,
        },
        '&:after': {
          content: '""',
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, ${accent}44, transparent)`,
        },
      }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

interface IStatBlockProps {
  accent: string;
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const StatBlock: React.FC<IStatBlockProps> = ({ accent, value, label, icon }) => (
  <Grid item xs={6} md={3}>
    <Box sx={(theme) => ({ p: 1.875, borderRadius: '15px', textAlign: 'center', bgcolor: theme.palette.mode === 'light' ? `${accent}12` : `${accent}14`, border: `1px solid ${accent}44` })}>
      <Typography sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontSize: 21, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.625 }}>
        {icon && <Box sx={(theme) => ({ display: 'inline-flex', color: getModeTokens(theme.palette.mode).lime, '& svg': { fontSize: 17 } })}>{icon}</Box>}
        {value}
      </Typography>
      <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.375, textTransform: 'uppercase', letterSpacing: '.5px' }}>
        {label}
      </Typography>
    </Box>
  </Grid>
);

interface IImpactCardProps {
  value: string;
  label: string;
  accent: string;
}

const ImpactCard: React.FC<IImpactCardProps> = ({ value, label, accent }) => (
  <Box sx={{ p: 2, borderRadius: '15px', background: `linear-gradient(160deg, ${accent}18, transparent)`, border: `1px solid ${accent}44` }}>
    <Typography sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontSize: 26, fontWeight: 800, color: accent }}>
      {value}
    </Typography>
    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mt: 0.5, lineHeight: 1.4 }}>
      {label}
    </Typography>
  </Box>
);

interface ISideCardProps {
  id?: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}

const SideCard: React.FC<ISideCardProps> = ({ id, title, accent, children }) => (
  <Box id={id} sx={(theme) => ({ borderRadius: '18px', bgcolor: getModeTokens(theme.palette.mode).panel, border: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, overflow: 'hidden' })}>
    <Typography
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 1.125,
        px: 2,
        py: 1.75,
        borderBottom: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`,
        fontSize: 11.5,
        letterSpacing: '1.2px',
        textTransform: 'uppercase',
        fontWeight: 800,
        color: accent,
        '&:before': {
          content: '""',
          width: 7,
          height: 7,
          borderRadius: '50%',
          bgcolor: accent,
          boxShadow: `0 0 0 3px ${accent}22`,
        },
      })}
    >
      {title}
    </Typography>
    <Box sx={{ p: 2 }}>
      {children}
    </Box>
  </Box>
);

interface IFileRowProps {
  file: IAssetFile;
}

const FileRow: React.FC<IFileRowProps> = ({ file }) => (
  <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', gap: 1.625, p: 1.625, borderRadius: '13px', bgcolor: getModeTokens(theme.palette.mode).panel, border: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, transition: '.2s', '&:hover': { borderColor: getModeTokens(theme.palette.mode).border } })}>
    <Box sx={(theme) => ({ width: 40, height: 40, borderRadius: '11px', flexShrink: 0, display: 'grid', placeItems: 'center', color: getModeTokens(theme.palette.mode).lime, bgcolor: getModeTokens(theme.palette.mode).surface2, border: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, '& svg': { fontSize: 20 } })}>
      {fileIcons[file.iconType]}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {file.name}
      </Typography>
      <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.25 }}>
        {file.size} - {file.type}
      </Typography>
    </Box>
    <IconButton sx={(theme) => {
      const t = getModeTokens(theme.palette.mode);
      return { width: 38, height: 38, borderRadius: '11px', color: etpTokens.ink, background: `linear-gradient(120deg, ${t.lime}, ${t.green})`, '&:hover': { transform: 'scale(1.06)', background: `linear-gradient(120deg, ${t.lime}, ${t.green})` } };
    }}>
      <DownloadOutlinedIcon sx={{ fontSize: 17 }} />
    </IconButton>
  </Box>
);

interface ISpecRowProps {
  label: string;
  value: React.ReactNode;
}

const SpecRow: React.FC<ISpecRowProps> = ({ label, value }) => (
  <Box sx={(theme) => ({ display: 'flex', gap: 1.5, px: 0, py: 1.375, borderBottom: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, '&:last-child': { borderBottom: 0 } })}>
    <Typography sx={{ width: 112, flexShrink: 0, color: 'text.secondary', fontSize: 13, fontWeight: 700 }}>
      {label}
    </Typography>
    <Box sx={{ flex: 1, minWidth: 0, fontSize: 13, color: 'text.primary' }}>
      {value}
    </Box>
  </Box>
);

interface ILeadMiniProps {
  name: string;
  meta: string;
  actionIcon: React.ReactNode;
}

const LeadMini: React.FC<ILeadMiniProps> = ({ name, meta, actionIcon }) => (
  <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', gap: 1.375, py: 1.25, borderBottom: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, '&:last-child': { borderBottom: 0, pb: 0 }, '&:first-of-type': { pt: 0 } })}>
    <Box sx={(theme) => ({ width: 34, height: 34, borderRadius: '10px', flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 12.5, fontWeight: 800, color: getModeTokens(theme.palette.mode).lime, bgcolor: getModeTokens(theme.palette.mode).surface2, border: `1px solid ${getModeTokens(theme.palette.mode).border}` })}>
      {getInitials(name)}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </Typography>
      <Typography sx={{ fontSize: 11, color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {meta}
      </Typography>
    </Box>
    <IconButton sx={(theme) => ({ width: 30, height: 30, borderRadius: '9px', color: getModeTokens(theme.palette.mode).muted, bgcolor: getModeTokens(theme.palette.mode).panel2, border: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, '&:hover': { color: getModeTokens(theme.palette.mode).lime, borderColor: getModeTokens(theme.palette.mode).border } })}>
      <Box sx={{ display: 'inline-flex', '& svg': { fontSize: 15 } }}>{actionIcon}</Box>
    </IconButton>
  </Box>
);

const ghostButtonSx: SxProps<Theme> = (theme) => {
  const t = getModeTokens(theme.palette.mode);
  return {
    color: 'text.secondary',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '11px',
    px: 1.625,
    py: 1,
    '&:hover': {
      color: t.lime,
      borderColor: t.green,
      bgcolor: 'transparent',
    },
  };
};

export default AssetDetails;
