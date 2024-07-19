'use client';
import { Grid, Box } from '@mui/material';
import { useIntl } from 'react-intl';
import { useStats } from '@/utils/StatsContext';
import PageContainer from '@/app/components/container/PageContainer';
// components
import GeneralStats from './components/dashboard/GeneralStats';
import PredictionsOverview from '@/app/components/dashboard/PredictionsOverview';
import OverallStatistics from '@/app/components/dashboard/OverallStatistics';
import RecentPredictions from '@/app/components/dashboard/RecentPredictions';
import DailyPredictions from '@/app/components/dashboard/DailyPredictions';
import { IconPlayFootball, IconListNumbers, IconTrophyFilled } from '@tabler/icons-react';

const Dashboard = () => {
  const { formatMessage } = useIntl();
  const { perfectScores, correctGroups, matchesPlayedGroups, correctKnockouts, matchesPlayedKnockouts } = useStats();

  return (
    <PageContainer title={formatMessage({ id: 'header.overview' })} description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <GeneralStats title={formatMessage({ id: 'generalStats.perfect' })} Icon={IconPlayFootball} primaryText={perfectScores} secondaryText={matchesPlayedGroups + matchesPlayedKnockouts} />
              </Grid>
              <Grid item xs={12} md={4}>
                <GeneralStats title={formatMessage({ id: 'generalStats.group' })} Icon={IconListNumbers} primaryText={correctGroups} secondaryText={matchesPlayedGroups} />
              </Grid>
              <Grid item xs={12} md={4}>
                <GeneralStats title={formatMessage({ id: 'generalStats.knockout' })} Icon={IconTrophyFilled} primaryText={correctKnockouts} secondaryText={matchesPlayedKnockouts} />
              </Grid>
            </Grid>
          </Grid>
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
