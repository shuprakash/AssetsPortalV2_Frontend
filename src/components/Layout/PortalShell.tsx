import * as React from 'react';
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { PaletteMode } from '@mui/material';
import { etpTokens, getModeTokens } from '../../theme/etpTheme';

export type PortalNavKey = 'results' | 'home' | 'explore' | 'champions' | 'agentic' | 'popular';

export interface IPortalShellProps {
  activeNav: PortalNavKey;
  mode: PaletteMode;
  children: React.ReactNode;
  onSearch: (query: string) => void;
  onNavigate: (nav: PortalNavKey) => void;
  onToggleTheme: () => void;
}

const navItems: Array<{ key: PortalNavKey; label: string; icon: React.ReactNode }> = [
  { key: 'results', label: 'Search', icon: <SearchIcon /> },
  { key: 'home', label: 'Home', icon: <HomeOutlinedIcon /> },
  { key: 'explore', label: 'Explore', icon: <ExploreOutlinedIcon /> },
  { key: 'champions', label: 'Asset Champions', icon: <PeopleAltOutlinedIcon /> },
  { key: 'agentic', label: 'Agentic AI', icon: <AutoAwesomeIcon /> },
  { key: 'popular', label: 'Popular', icon: <LocalFireDepartmentOutlinedIcon /> },
];

const PortalShell: React.FC<IPortalShellProps> = ({
  activeNav,
  mode,
  children,
  onSearch,
  onNavigate,
  onToggleTheme,
}) => {
  const [query, setQuery] = React.useState<string>('');

  const runSearch = React.useCallback(() => {
    onSearch(query.trim());
  }, [onSearch, query]);

  return (
    <Box
      sx={(theme) => {
        const t = getModeTokens(theme.palette.mode);
        return {
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '80px 1fr' },
          height: '100vh',
          overflow: 'hidden',
          bgcolor: t.bg,
          color: t.text,
          '&:before': {
            content: '""',
            position: 'fixed',
            top: -180,
            left: '16%',
            width: 540,
            height: 500,
            pointerEvents: 'none',
            opacity: 0.32,
            filter: 'blur(100px)',
            background: `radial-gradient(circle, ${theme.palette.mode === 'light' ? 'rgba(134,188,37,.18)' : 'rgba(134,188,37,.22)'}, transparent 65%)`,
          },
          '&:after': {
            content: '""',
            position: 'fixed',
            top: 420,
            right: -140,
            width: 480,
            height: 480,
            pointerEvents: 'none',
            opacity: 0.26,
            filter: 'blur(100px)',
            background: `radial-gradient(circle, ${theme.palette.mode === 'light' ? 'rgba(77,122,16,.08)' : 'rgba(163,230,53,.1)'}, transparent 65%)`,
          },
        };
      }}
    >
      <Box
        component="aside"
        sx={(theme) => {
          const t = getModeTokens(theme.palette.mode);
          return {
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            p: '20px 0',
            bgcolor: t.rail,
            borderRight: `1px solid ${t.borderSoft}`,
            zIndex: 30,
          };
        }}
      >
        <Box
          title="ET&P"
          sx={(theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
            width: 46,
            height: 46,
            borderRadius: '14px',
            display: 'grid',
            placeItems: 'center',
            fontFamily: '"Archivo Black", "Space Grotesk", sans-serif',
            fontSize: 15,
            fontWeight: 900,
            color: etpTokens.ink,
            background: `linear-gradient(135deg, ${t.lime}, ${t.green})`,
            boxShadow: '0 6px 18px rgba(134,188,37,.4)',
            mb: 1.75,
            letterSpacing: '-.5px',
          };
          }}
        >
          E&amp;P
        </Box>

        <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1 }}>
          {navItems.map((item) => {
            const active = activeNav === item.key;
            return (
              <Tooltip key={item.key} title={item.label} placement="right">
                <IconButton
                  onClick={() => onNavigate(item.key)}
                  sx={(theme) => {
                    const t = getModeTokens(theme.palette.mode);
                    return {
                      position: 'relative',
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      color: active ? t.lime : t.muted,
                      bgcolor: active ? t.panel : 'transparent',
                      border: `1px solid ${active ? t.border : 'transparent'}`,
                      transition: '.22s',
                      '&:hover': { color: t.text, bgcolor: t.panel },
                      '&:before': active ? {
                        content: '""',
                        position: 'absolute',
                        left: -20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 4,
                        height: 24,
                        borderRadius: 4,
                        background: `linear-gradient(180deg, ${t.lime}, ${t.green})`,
                        boxShadow: `0 0 12px ${t.greenGlow}`,
                      } : undefined,
                      '& svg': { fontSize: 22 },
                    };
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.25 }}>
          <Tooltip title="Toggle theme" placement="right">
            <IconButton
              onClick={onToggleTheme}
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  bgcolor: t.panel,
                  border: `1px solid ${t.borderSoft}`,
                  color: t.text,
                  '&:hover': { borderColor: t.green, color: t.lime, transform: 'translateY(-1px)' },
                };
              }}
            >
              {mode === 'light' ? <WbSunnyOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
          <Box
            title="Ashish Kumar"
            sx={(theme) => {
              const t = getModeTokens(theme.palette.mode);
              return {
              width: 44,
              height: 44,
              borderRadius: '13px',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
              fontSize: 13,
              color: t.lime,
              bgcolor: theme.palette.mode === 'light' ? '#eef6df' : '#141a12',
              border: `1px solid ${t.green}`,
            };
            }}
          >
            AK
          </Box>
        </Box>
      </Box>

      <Box sx={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Box
          component="header"
          sx={(theme) => {
            const t = getModeTokens(theme.palette.mode);
            return {
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: { xs: 2.25, md: 4.25 },
              py: 2,
              bgcolor: theme.palette.mode === 'light' ? 'rgba(238,242,232,.82)' : 'rgba(7,11,8,.82)',
              backdropFilter: 'blur(18px)',
              borderBottom: `1px solid ${t.borderSoft}`,
              zIndex: 25,
            };
          }}
        >
          <Box
            sx={(theme) => {
              const t = getModeTokens(theme.palette.mode);
              return {
              display: { xs: 'grid', md: 'none' },
              placeItems: 'center',
              width: 40,
              height: 40,
              borderRadius: '12px',
              fontFamily: '"Archivo Black", "Space Grotesk", sans-serif',
              fontSize: 13,
              fontWeight: 900,
              color: etpTokens.ink,
              background: `linear-gradient(135deg, ${t.lime}, ${t.green})`,
            };
            }}
          >
            E&amp;P
          </Box>

          <Box
            sx={(theme) => {
              const t = getModeTokens(theme.palette.mode);
              return {
                flex: 1,
                maxWidth: 520,
                display: 'flex',
                alignItems: 'center',
                gap: 1.375,
                px: 2,
                py: 1.25,
                borderRadius: '14px',
                bgcolor: t.panel,
                border: `1px solid ${t.borderSoft}`,
                color: t.muted,
                transition: '.22s',
                '&:hover': { borderColor: t.border, color: t.text },
                '&:focus-within': { borderColor: t.green, boxShadow: '0 0 0 3px rgba(134,188,37,.12)' },
              };
            }}
          >
            <SearchIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            <InputBase
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') runSearch();
              }}
              placeholder="Search assets, themes, countries..."
              sx={(theme) => ({
                flex: 1,
                minWidth: 0,
                color: getModeTokens(theme.palette.mode).text,
                fontSize: 14,
                '& input::placeholder': {
                  color: getModeTokens(theme.palette.mode).muted,
                  opacity: 1,
                },
              })}
            />
            <Box sx={{ display: { xs: 'none', sm: 'inline-flex' }, gap: 0.375 }}>
              <Box component="kbd" sx={(theme) => ({ px: 0.875, py: 0.375, borderRadius: '6px', bgcolor: getModeTokens(theme.palette.mode).panel2, border: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, color: getModeTokens(theme.palette.mode).muted, fontSize: 11, fontWeight: 700 })}>
                Ctrl
              </Box>
              <Box component="kbd" sx={(theme) => ({ px: 0.875, py: 0.375, borderRadius: '6px', bgcolor: getModeTokens(theme.palette.mode).panel2, border: `1px solid ${getModeTokens(theme.palette.mode).borderSoft}`, color: getModeTokens(theme.palette.mode).muted, fontSize: 11, fontWeight: 700 })}>
                K
              </Box>
            </Box>
            <IconButton size="small" onClick={runSearch} sx={(theme) => ({ color: getModeTokens(theme.palette.mode).lime })}>
              <ManageSearchOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, ml: 'auto' }}>
            <Button
              startIcon={<PeopleAltOutlinedIcon />}
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                  display: { xs: 'none', sm: 'inline-flex' },
                  px: 2.25,
                  py: 1.25,
                  borderRadius: '12px',
                  color: t.text,
                  bgcolor: t.panel,
                  border: `1px solid ${t.borderSoft}`,
                  '&:hover': { color: t.lime, borderColor: t.green, bgcolor: t.panel },
                };
              }}
            >
              Leaders
            </Button>
            <Button
              startIcon={<AddIcon />}
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                px: { xs: 1.625, sm: 2.25 },
                py: 1.25,
                borderRadius: '12px',
                color: etpTokens.ink,
                background: `linear-gradient(120deg, ${t.lime}, ${t.green})`,
                boxShadow: '0 6px 20px rgba(134,188,37,.3)',
                whiteSpace: 'nowrap',
                '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 30px rgba(134,188,37,.42)' },
              };
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Drop Idea
              </Box>
            </Button>
            <IconButton
              onClick={onToggleTheme}
              sx={(theme) => {
                const t = getModeTokens(theme.palette.mode);
                return {
                  display: { xs: 'inline-flex', md: 'none' },
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  bgcolor: t.panel,
                  border: `1px solid ${t.borderSoft}`,
                  color: t.text,
                };
              }}
            >
              {mode === 'light' ? <WbSunnyOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain' }}>
          <Box sx={{ maxWidth: 1320, mx: 'auto', px: { xs: 2.25, md: 4.25 }, pt: { xs: 2.75, md: 3.75 }, pb: 11.25 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PortalShell;

