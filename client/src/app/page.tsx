'use client';
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
// components
import PredictionsOverview from '@/app/components/dashboard/PredictionsOverview';
import OverallStatistics from '@/app/components/dashboard/OverallStatistics';
import RecentPredictions from '@/app/components/dashboard/RecentPredictions';
import GroupPerformance from '@/app/components/dashboard/GroupPerformance';
import DailyPredictions from '@/app/components/dashboard/DailyPredictions';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <PredictionsOverview />
          </Grid>
          <Grid item xs={12} lg={6}>
            <RecentPredictions />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <OverallStatistics />
              </Grid>
              <Grid item xs={12}>
                <DailyPredictions />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
