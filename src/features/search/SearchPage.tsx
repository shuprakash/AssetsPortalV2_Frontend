import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Fade,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * Search landing page rebuilt with MUI.
 * Replaces the SCSS-based SearchPage from the original SPFx project.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ MIGRATION NOTE:                                                  │
 * │ When copying back to SPFx, you can either:                       │
 * │   (a) Use this MUI version as-is (recommended), OR               │
 * │   (b) Restore the original SCSS-based SearchPage.tsx +           │
 * │       SearchPage.module.scss files from the SPFx project.        │
 * └──────────────────────────────────────────────────────────────────┘
 */
export interface ISearchPageProps {
  onSearch: (query: string) => void;
}

const SearchPage: React.FC<ISearchPageProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && query.trim()) {
        onSearch(query.trim());
      }
    },
    [query, onSearch]
  );

  const handleSearchClick = useCallback(() => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  const quickLinks = ['Agentic AI', 'GenAI', 'SAP', 'Supply Chain', 'Finance'];

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          px: 3,
          py: 6,
          textAlign: 'center',
          background:
            'radial-gradient(60% 45% at 50% 108%, rgba(134,188,37,.34), transparent 70%), ' +
            'linear-gradient(180deg, #04060a 0%, #060b06 42%, #0a1608 74%, #0f2510 100%)',
          color: '#F4F7F4',
          borderRadius: 3,
          overflow: 'hidden',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {/* Floating orbs (decorative) */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                borderRadius: '50%',
                filter: 'blur(70px)',
                opacity: 0.32,
                animation: 'floaty 9s ease-in-out infinite',
                ...(i === 1 && {
                  width: 420,
                  height: 420,
                  left: '8%',
                  top: '12%',
                  background: 'radial-gradient(circle, rgba(134,188,37,.5), transparent 65%)',
                }),
                ...(i === 2 && {
                  width: 340,
                  height: 340,
                  right: '10%',
                  top: '22%',
                  background: 'radial-gradient(circle, rgba(163,230,53,.3), transparent 65%)',
                  animationDelay: '-3s',
                }),
                ...(i === 3 && {
                  width: 300,
                  height: 300,
                  left: '44%',
                  bottom: '6%',
                  background: 'radial-gradient(circle, rgba(18,163,160,.22), transparent 65%)',
                  animationDelay: '-6s',
                }),
                '@keyframes floaty': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
              }}
            />
          ))}
        </Box>

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 700, width: '100%' }}>
          {/* Logo */}
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontFamily: '"Archivo Black", "Space Grotesk", sans-serif',
                fontWeight: 900,
                fontSize: { xs: 48, md: 76 },
                letterSpacing: 2,
                color: '#fff',
                lineHeight: 1,
              }}
            >
              ET<span style={{ color: '#86BC25' }}>&amp;</span>P
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'center',
                mt: 1.5,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, transparent, #86BC25)',
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 11,
                  color: '#fff',
                }}
              >
                ASSET HUB
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #86BC25, transparent)',
                }}
              />
            </Box>
          </Box>

          {/* Tagline */}
          <Typography
            variant="body2"
            sx={{ color: '#8A968C', fontSize: 14.5, letterSpacing: 0.3, mb: 3 }}
          >
            Your single gateway to ET&amp;P assets
          </Typography>

          {/* Search Field */}
          <Paper
            elevation={0}
            sx={{
              mx: 'auto',
              maxWidth: 600,
              borderRadius: '18px',
              bgcolor: 'rgba(8,14,9,.74)',
              border: '1px solid rgba(134,188,37,.18)',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 20px 60px rgba(0,0,0,.5)',
              transition: '.25s',
              '&:focus-within': {
                borderColor: '#86BC25',
                boxShadow: '0 20px 60px rgba(0,0,0,.5), 0 0 0 4px rgba(134,188,37,.16)',
              },
            }}
          >
            <TextField
              fullWidth
              placeholder="Search assets, themes, countries or champions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '18px',
                  color: '#fff',
                  fontSize: 16.5,
                  fontFamily: '"Inter", sans-serif',
                  py: 0.5,
                  '& fieldset': { border: 'none' },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#5f6b60',
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#8A968C' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSearchClick}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '13px',
                        color: '#0A1508',
                        background: 'linear-gradient(120deg, #A3E635, #86BC25)',
                        boxShadow: '0 6px 18px rgba(134,188,37,.4)',
                        '&:hover': { transform: 'scale(1.06)' },
                      }}
                    >
                      <ArrowForwardIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          {/* Quick Links */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 3 }}>
            {quickLinks.map((link) => (
              <Chip
                key={link}
                label={link}
                onClick={() => onSearch(link)}
                variant="outlined"
                sx={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#8A968C',
                  borderColor: 'rgba(255,255,255,.09)',
                  bgcolor: 'rgba(255,255,255,.05)',
                  fontFamily: '"Inter", sans-serif',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#A3E635',
                    borderColor: 'rgba(134,188,37,.18)',
                  },
                }}
              />
            ))}
          </Box>

          {/* Skip to home */}
          <Typography
            onClick={() => onSearch('')}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: '#8A968C',
              fontSize: 13.5,
              cursor: 'pointer',
              mt: 3,
              transition: '.2s',
              '&:hover': { color: '#A3E635' },
            }}
          >
            Skip to home
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default SearchPage;
