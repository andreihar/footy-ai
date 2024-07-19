import { useTheme } from '@mui/material/styles';
import { Typography, Box, Avatar } from '@mui/material';
import DashboardCard from '@/app/components/shared/DashboardCard';

const GeneralStats: React.FC<{ title: string; Icon: React.ElementType; primaryText: number; secondaryText: number; }> = ({ title, Icon, primaryText, secondaryText }) => {
  const theme = useTheme();

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
          <Typography variant="subtitle1" ml={1} mt={2} color="textSecondary">/ {secondaryText}</Typography>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default GeneralStats;
