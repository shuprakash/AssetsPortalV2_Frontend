import { createTheme, PaletteMode } from '@mui/material';

export const etpTokens = {
  green: '#86BC25',
  lime: '#A3E635',
  ink: '#0A1508',
  spectrum: ['#E2445C', '#EF7130', '#E5B421', '#57A845', '#12A3A0', '#3B82D6', '#7C56D9', '#C0459B'],
  dark: {
    bg: '#070B08',
    surface: '#0c110c',
    surface2: '#0a0e0a',
    rail: '#080c08',
    panel: 'rgba(255,255,255,.04)',
    panel2: 'rgba(255,255,255,.06)',
    border: 'rgba(134,188,37,.18)',
    borderSoft: 'rgba(255,255,255,.09)',
    text: '#F4F7F4',
    muted: '#8A968C',
    muted2: '#5f6b60',
    shadow: 'rgba(0,0,0,.5)',
    green: '#86BC25',
    lime: '#A3E635',
    greenGlow: 'rgba(134,188,37,.55)',
    spectrum: ['#E2445C', '#EF7130', '#E5B421', '#57A845', '#12A3A0', '#3B82D6', '#7C56D9', '#C0459B'],
    imgFilter: 'grayscale(30%) brightness(.72) sepia(30%) hue-rotate(40deg) saturate(180%)',
  },
  light: {
    bg: '#EEF2E8',
    surface: '#ffffff',
    surface2: '#f4f7ef',
    rail: '#f2f6ec',
    panel: 'rgba(20,45,10,.045)',
    panel2: 'rgba(20,45,10,.07)',
    border: 'rgba(134,188,37,.34)',
    borderSoft: 'rgba(15,30,8,.12)',
    text: '#17230e',
    muted: '#5c6b52',
    muted2: '#8a9880',
    shadow: 'rgba(40,60,20,.16)',
    green: '#5f8a12',
    lime: '#4d7a10',
    greenGlow: 'rgba(134,188,37,.4)',
    spectrum: ['#C42B43', '#CF5C15', '#A8800A', '#3D8A2D', '#0A827F', '#2262B2', '#6337BE', '#A22C7F'],
    imgFilter: 'grayscale(10%) brightness(.98) saturate(1.05)',
  },
} as const;

export const getModeTokens = (mode: PaletteMode) => (
  mode === 'light' ? etpTokens.light : etpTokens.dark
);

export const createEtpTheme = (mode: PaletteMode) => {
  const tokens = getModeTokens(mode);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.green,
        contrastText: etpTokens.ink,
      },
      secondary: {
        main: tokens.lime,
        contrastText: etpTokens.ink,
      },
      background: {
        default: tokens.bg,
        paper: tokens.surface,
      },
      text: {
        primary: tokens.text,
        secondary: tokens.muted,
      },
      divider: tokens.borderSoft,
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
      },
      h4: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
      },
      h5: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
      },
      h6: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
      },
      button: {
        textTransform: 'none',
        fontWeight: 700,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: tokens.bg,
            color: tokens.text,
            overflow: 'hidden',
            WebkitFontSmoothing: 'antialiased',
          },
          '*': {
            boxSizing: 'border-box',
          },
          '::-webkit-scrollbar': {
            width: 9,
            height: 9,
          },
          '::-webkit-scrollbar-thumb': {
            background: 'rgba(134,188,37,.25)',
            borderRadius: 20,
          },
          '::-webkit-scrollbar-track': {
            background: 'transparent',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};
