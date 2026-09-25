import * as React from 'react';
import {
  Box,
  Paper,
  Typography,
  Skeleton,
} from '@mui/material';

export interface IStatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<IStatCardProps> = ({ title, value, icon, color, loading = false }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        borderLeft: `4px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          '& svg': { fontSize: 28 },
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        {loading ? (
          <Skeleton width={60} height={36} />
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>
            {value}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default StatCard;
