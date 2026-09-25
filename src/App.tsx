import * as React from 'react';
import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Tabs, Tab } from '@mui/material';
import SearchPage from './features/search/SearchPage';
import DashboardFeature from './features/dashboard/Dashboard';
import AssetDetailsPlaceholder from './features/assetDetails/AssetDetails';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

/**
 * Page switcher that simulates the 3 SPFx webparts.
 * In the real SPFx project each page is a separate webpart.
 * Here we use tabs + state to switch between them.
 */
const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'search' | 'dashboard' | 'assetDetails'>('search');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    setActivePage('dashboard');
  };

  const handleBackToSearch = (): void => {
    setActivePage('search');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Dev-only tab bar to switch between webpart pages */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs
          value={activePage}
          onChange={(_, val) => setActivePage(val)}
          sx={{ px: 2 }}
        >
          <Tab label="Assets Portal (Search)" value="search" />
          <Tab label="Dashboard" value="dashboard" />
          <Tab label="Asset Details" value="assetDetails" />
        </Tabs>
      </Box>

      {/* Page content */}
      {activePage === 'search' && (
        <SearchPage onSearch={handleSearch} />
      )}
      {activePage === 'dashboard' && (
        <DashboardFeature
          searchQuery={searchQuery}
          onBackToSearch={handleBackToSearch}
          onSearch={handleSearch}
        />
      )}
      {activePage === 'assetDetails' && (
        <AssetDetailsPlaceholder />
      )}
    </ThemeProvider>
  );
};

export default App;
