'use client';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Avatar } from '@mui/material';
import DashboardCard from '@/components/shared/DashboardCard';
import { IconPlayFootball, IconListNumbers, IconTrophyFilled } from '@tabler/icons-react';

const icons = [IconPlayFootball, IconListNumbers, IconTrophyFilled];

const GeneralStats: React.FC<{ title: string; iconIndex: number; primaryText: number; secondaryText: number; }> = ({ title, iconIndex, primaryText, secondaryText }) => {
  const theme = useTheme();
  const Icon = icons[iconIndex];

  return (
    <DashboardCard title={title}>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1} p={3}>
          <Avatar sx={{ height: 64, width: 64, bgcolor: theme.palette.secondary.main, boxShadow: 6 }} >
            <Icon size={32} />
          </Avatar>
        </Box>
        <Box flexGrow={1} display="flex" alignItems="center">
          <Typography variant="h1" fontWeight={600}>{primaryText}</Typography>
          <Typography component="span" variant="subtitle1" ml={1} mt={2} color="textSecondary">/ {secondaryText}</Typography>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default GeneralStats;
