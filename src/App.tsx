import * as React from 'react';
import { useMemo, useState } from 'react';
import { CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import SearchPage from './features/search/SearchPage';
import DashboardFeature from './features/dashboard/Dashboard';
import AssetDetails from './features/assetDetails/AssetDetails';
import { IAsset } from './models/IAsset';
import { createEtpTheme } from './theme/etpTheme';

type ActivePage = 'search' | 'dashboard' | 'assetDetails';

/**
 * State-based page switcher for standalone development.
 * The SPFx project renders these as separate webparts.
 */
const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('search');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(null);
  const [mode, setMode] = useState<PaletteMode>('dark');

  const theme = useMemo(() => createEtpTheme(mode), [mode]);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    setActivePage('dashboard');
  };

  const handleBackToSearch = (): void => {
    setActivePage('search');
  };

  const handleAssetSelect = (asset: IAsset): void => {
    setSelectedAsset(asset);
    setActivePage('assetDetails');
  };

  const handleBackToDashboard = (): void => {
    setActivePage('dashboard');
  };

  const handleToggleTheme = (): void => {
    setMode((currentMode) => currentMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {activePage === 'search' && (
        <SearchPage onSearch={handleSearch} />
      )}
      {activePage === 'dashboard' && (
        <DashboardFeature
          searchQuery={searchQuery}
          onBackToSearch={handleBackToSearch}
          onSearch={handleSearch}
          onAssetSelect={handleAssetSelect}
          mode={mode}
          onToggleTheme={handleToggleTheme}
        />
      )}
      {activePage === 'assetDetails' && (
        <AssetDetails
          asset={selectedAsset}
          mode={mode}
          onBackToDashboard={handleBackToDashboard}
          onBackToSearch={handleBackToSearch}
          onSearch={handleSearch}
          onAssetSelect={handleAssetSelect}
          onToggleTheme={handleToggleTheme}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
