import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Asset Details placeholder page.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ MIGRATION NOTE:                                                  │
 * │ When copying back to SPFx, this maps to:                         │
 * │   src/webparts/assetDetails/components/AssetDetails.tsx          │
 * │ Add SPFx props (sp, context) back to the component.              │
 * └──────────────────────────────────────────────────────────────────┘
 */
const AssetDetails: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Paper
        elevation={2}
        sx={{
          p: 6,
          borderRadius: 3,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <InfoIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.5 }} />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Asset Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This page will display detailed information about a selected asset.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
          Placeholder — build out when ready.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AssetDetails;
