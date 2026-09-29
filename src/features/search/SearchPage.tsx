import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Fade,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import { etpTokens, getModeTokens } from '../../theme/etpTheme';
import SearchPageBackground from '../../components/Backgrounds/SearchPageBackground';

export interface ISearchPageProps {
  onSearch: (query: string) => void;
}

const quickSearches = ['Costing', 'Migration', 'Agentic AI', 'India', 'SAP', 'Data residency', 'Forecasting'];

const suggestionGroups = [
  {
    label: 'Assets',
    items: ['Agent X', 'Forecast Doctor', 'Close Copilot', 'Vision Frontier'],
  },
  {
    label: 'Themes / Solutions',
    items: ['Process Automation', 'Reporting & Analytics', 'Compliance & Risk', 'Data Management'],
  },
  {
    label: 'Countries',
    items: ['India', 'Australia', 'United Kingdom', 'United States'],
  },
];

const SearchPage: React.FC<ISearchPageProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');
  const trimmedQuery = query.trim();

  const suggestions = useMemo(() => {
    if (!trimmedQuery) return [];
    const lowerQuery = trimmedQuery.toLowerCase();
    return suggestionGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.toLowerCase().includes(lowerQuery)).slice(0, 3),
      }))
      .filter((group) => group.items.length > 0);
  }, [trimmedQuery]);

  const runSearch = useCallback(
    (value: string = query) => {
      onSearch(value.trim());
    },
    [onSearch, query]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        runSearch();
      }
    },
    [runSearch]
  );

  return (
    <Fade in timeout={500}>
      <SearchPageBackground>
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3.25, width: '100%', maxWidth: 700 }}>
          <Box
            sx={{
              display: 'inline-flex',
              flexDirection: 'column',
              gap: 1.75,
              lineHeight: 1,
              userSelect: 'none',
              filter: 'drop-shadow(0 0 36px rgba(134,188,37,.28))',
              animation: 'fadeUp .8s .06s both',
              '@keyframes fadeUp': {
                from: { opacity: 0, transform: 'translateY(16px)' },
                to: { opacity: 1, transform: 'none' },
              },
            }}
          >
            <Typography
              sx={(theme) => ({
                fontFamily: '"Archivo Black", "Space Grotesk", sans-serif',
                fontWeight: 900,
                fontSize: { xs: 46, sm: 64, md: 76 },
                letterSpacing: '2px',
                color: theme.palette.mode === 'light' ? '#16220d' : '#fff',
                lineHeight: 1,
              })}
            >
              ET<Box component="span" sx={(theme) => ({ color: getModeTokens(theme.palette.mode).green })}>&amp;</Box>P
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 2 }, width: '100%', pl: 0.75 }}>
              <Box sx={(theme) => ({ flex: 1, height: 3, borderRadius: 2, background: `linear-gradient(90deg, transparent, ${getModeTokens(theme.palette.mode).green})` })} />
              <Typography
                sx={(theme) => ({
                  fontWeight: 800,
                  fontSize: { xs: 10, sm: 14 },
                  letterSpacing: { xs: '6px', sm: '11px' },
                  color: theme.palette.mode === 'light' ? '#16220d' : '#fff',
                  whiteSpace: 'nowrap',
                })}
              >
                ASSET HUB
              </Typography>
              <Box sx={(theme) => ({ flex: 1, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${getModeTokens(theme.palette.mode).green}, transparent)` })} />
            </Box>
          </Box>

          <Typography sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 14.5, letterSpacing: '.3px' })}>
            Your single gateway to ET&amp;P assets
          </Typography>

          <Box sx={{ position: 'relative', width: '100%' }}>
            <Paper
              elevation={0}
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                  position: 'relative',
                  borderRadius: '18px',
                  bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,.86)' : 'rgba(8,14,9,.74)',
                  border: `1px solid ${t.border}`,
                  backdropFilter: 'blur(14px)',
                  boxShadow: theme.palette.mode === 'light' ? '0 20px 60px rgba(20,45,10,.13)' : '0 20px 60px rgba(0,0,0,.5)',
                  transition: '.25s',
                  '&:focus-within': {
                    borderColor: t.green,
                    boxShadow: theme.palette.mode === 'light'
                      ? '0 20px 60px rgba(20,45,10,.13), 0 0 0 4px rgba(134,188,37,.16)'
                      : '0 20px 60px rgba(0,0,0,.5), 0 0 0 4px rgba(134,188,37,.16)',
                  },
                };
              }}
            >
              <TextField
                fullWidth
                placeholder="Search assets, themes, countries or champions..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '18px',
                      color: t.text,
                      fontSize: 16.5,
                      fontFamily: '"Inter", sans-serif',
                      py: 0.625,
                      '& fieldset': { border: 'none' },
                    },
                    '& .MuiInputBase-input': { px: 0 },
                    '& .MuiInputBase-input::placeholder': {
                      color: t.muted2,
                      opacity: 1,
                    },
                  };
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted, fontSize: 22 })} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        title="Search"
                        onClick={() => runSearch()}
                        sx={(theme) => {
                          const t = getModeTokens(theme.palette.mode);
                          return {
                            width: 44,
                            height: 44,
                            borderRadius: '13px',
                            color: etpTokens.ink,
                            background: `linear-gradient(120deg, ${t.lime}, ${t.green})`,
                            boxShadow: '0 6px 18px rgba(134,188,37,.4)',
                            transition: '.2s',
                            '&:hover': {
                              transform: 'scale(1.06)',
                              background: `linear-gradient(120deg, ${t.lime}, ${t.green})`,
                            },
                          };
                        }}
                      >
                        <ArrowForwardIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>

            {trimmedQuery && (
              <Paper
                elevation={0}
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    mt: 1.25,
                    textAlign: 'left',
                    bgcolor: t.surface,
                    border: `1px solid ${t.border}`,
                    borderRadius: '16px',
                    boxShadow: `0 30px 70px ${t.shadow}`,
                    overflow: 'hidden',
                    maxHeight: 326,
                    overflowY: 'auto',
                    animation: 'fadeUp .2s both',
                  };
                }}
              >
                {suggestions.length ? suggestions.map((group) => (
                  <Box key={group.label}>
                    <Typography sx={(theme) => ({ px: 1.875, pt: 1.375, pb: 0.625, color: getModeTokens(theme.palette.mode).muted2, fontSize: 10.5, fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase' })}>
                      {group.label}
                    </Typography>
                    {group.items.map((item) => (
                      <Box
                        key={item}
                        onClick={() => runSearch(item)}
                        sx={(theme) => {
                          const t = getModeTokens(theme.palette.mode);
                          return {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            px: 1.75,
                            py: 1.25,
                            cursor: 'pointer',
                            transition: '.14s',
                            '&:hover': { bgcolor: t.panel },
                          };
                        }}
                      >
                        <Box sx={(theme) => ({ width: 36, height: 36, borderRadius: '11px', display: 'grid', placeItems: 'center', color: getModeTokens(theme.palette.mode).lime, bgcolor: getModeTokens(theme.palette.mode).surface2, border: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}` })}>
                          <SearchIcon sx={{ fontSize: 17 }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>{item}</Typography>
                          <Typography sx={(theme) => ({ fontSize: 11.5, color: getModeTokens(theme.palette.mode).muted })}>
                            Search the ET&amp;P catalogue
                          </Typography>
                        </Box>
                        <ArrowForwardIcon sx={(theme) => ({ color: getModeTokens(theme.palette.mode).muted2, fontSize: 15 })} />
                      </Box>
                    ))}
                  </Box>
                )) : (
                  <Typography sx={(theme) => ({ p: 3, color: getModeTokens(theme.palette.mode).muted2, fontSize: 13.5, textAlign: 'center' })}>
                    No matches. Press Enter to search anyway.
                  </Typography>
                )}
              </Paper>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {quickSearches.map((link) => (
              <Chip
                key={link}
                label={link}
                onClick={() => runSearch(link)}
                clickable
                sx={(theme) => {
                  const t = getModeTokens(theme.palette.mode);
                  return {
                    height: 34,
                    borderRadius: '20px',
                    color: t.muted,
                    bgcolor: theme.palette.mode === 'light' ? 'rgba(20,45,10,.05)' : 'rgba(255,255,255,.05)',
                    border: `1px solid ${t.borderSoft}`,
                    fontSize: 12.5,
                    fontWeight: 700,
                    '&:hover': {
                      color: t.lime,
                      borderColor: t.border,
                      bgcolor: t.panel,
                    },
                  };
                }}
              />
            ))}
          </Box>

          <Button
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            onClick={() => onSearch('')}
            sx={(theme) => ({
              color: getModeTokens(theme.palette.mode).muted,
              fontSize: 13.5,
              '&:hover': { color: getModeTokens(theme.palette.mode).lime, bgcolor: 'transparent' },
            })}
          >
            Skip to home
          </Button>
        </Box>
      </SearchPageBackground>
    </Fade>
  );
};

export default SearchPage;
