import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Fade,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import LanguageIcon from '@mui/icons-material/Language';
import InsightsIcon from '@mui/icons-material/Insights';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ISearchResult } from '../../models/ISearchResult';
import { IDashboardMetrics } from '../../models/IDashboardMetrics';
import { SearchService } from '../../services/SearchService';
import StatCard from '../../components/Cards/StatCard';

/**
 * Dashboard feature component.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ MIGRATION NOTE:                                                  │
 * │ When copying back to SPFx, restore the SPFI import and pass     │
 * │ `sp` via props to SearchService constructor instead of using     │
 * │ the mock base URL.                                               │
 * └──────────────────────────────────────────────────────────────────┘
 */
export interface IDashboardProps {
  searchQuery: string;
  onBackToSearch: () => void;
  onSearch: (query: string) => void;
}

const Dashboard: React.FC<IDashboardProps> = ({ searchQuery, onBackToSearch, onSearch }) => {
  const [query, setQuery] = useState<string>(searchQuery);
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [metrics, setMetrics] = useState<IDashboardMetrics>({
    totalResults: 0,
    documents: 0,
    lists: 0,
    sites: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const searchService = React.useMemo(() => new SearchService(), []);

  const performSearch = useCallback(
    async (searchText: string) => {
      setLoading(true);
      try {
        const searchResults = await searchService.search(searchText);
        setResults(searchResults);

        // Calculate metrics
        const docs = searchResults.filter((r) => r.fileType !== '').length;
        const sites = searchResults.filter((r) => r.contentClass === 'STS_Site' || r.contentClass === 'STS_Web').length;
        const lists = searchResults.filter((r) => r.contentClass === 'STS_List' || r.contentClass === 'STS_ListItem').length;

        setMetrics({
          totalResults: searchResults.length,
          documents: docs,
          lists: lists,
          sites: sites,
        });
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [searchService]
  );

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && query.trim()) {
        performSearch(query.trim());
      }
    },
    [query, performSearch]
  );

  const getFileIcon = (fileType: string): React.ReactNode => {
    switch (fileType.toLowerCase()) {
      case 'docx':
      case 'doc':
      case 'pdf':
      case 'xlsx':
      case 'pptx':
        return <DescriptionIcon color="primary" />;
      case '':
        return <FolderIcon color="warning" />;
      default:
        return <LanguageIcon color="info" />;
    }
  };

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
        {/* Top Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Tooltip title="Back to Search">
            <IconButton onClick={onBackToSearch} sx={{ bgcolor: 'action.hover' }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Typography variant="h5" sx={{ fontWeight: 600, flexShrink: 0 }}>
            Dashboard
          </Typography>

          <Paper
            elevation={1}
            sx={{ flexGrow: 1, maxWidth: 500, borderRadius: 50, ml: 2 }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 50,
                  '& fieldset': { border: 'none' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Box>

        {/* Searching indicator */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {loading
            ? 'Searching...'
            : `Showing ${results.length} results for "${searchQuery}"`}
        </Typography>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Results"
              value={metrics.totalResults}
              icon={<InsightsIcon />}
              color="#1976d2"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Documents"
              value={metrics.documents}
              icon={<DescriptionIcon />}
              color="#2e7d32"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Lists"
              value={metrics.lists}
              icon={<FolderIcon />}
              color="#ed6c02"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Sites"
              value={metrics.sites}
              icon={<LanguageIcon />}
              color="#9c27b0"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Results Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={48} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ borderRadius: 3, overflow: 'hidden' }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Modified</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>File Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No results found. Try a different search term.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((result, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': { bgcolor: 'action.hover' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>{getFileIcon(result.fileType)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {result.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 300, display: 'block' }}>
                          {result.path}
                        </Typography>
                      </TableCell>
                      <TableCell>{result.author}</TableCell>
                      <TableCell>{result.lastModified}</TableCell>
                      <TableCell>
                        {result.fileType ? (
                          <Chip
                            label={result.fileType.toUpperCase()}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ) : (
                          <Chip label="Folder/Site" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Open">
                          <IconButton
                            size="small"
                            href={result.path}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Fade>
  );
};

export default Dashboard;
