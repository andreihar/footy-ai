'use client';
import { Grid, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import * as stats from '@/utils/stats';
import PageContainer from '@/components/container/PageContainer';
// components
import GeneralStats from '@/components/dashboard/GeneralStats';
import PredictionsOverview from '@/components/dashboard/PredictionsOverview';
import OverallStatistics from '@/components/dashboard/OverallStatistics';
import RecentPredictions from '@/components/dashboard/RecentPredictions';
import DailyPredictions from '@/components/dashboard/DailyPredictions';
import { IconPlayFootball, IconListNumbers, IconTrophyFilled } from '@tabler/icons-react';

const Dashboard = () => {
  const t = useTranslations();
  const { perfectScores, correctGroups, matchesPlayedGroups, correctKnockouts, matchesPlayedKnockouts } = stats;

  return (
    <PageContainer title={t('header.overview')} description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <GeneralStats title={t('generalStats.perfect')} Icon={IconPlayFootball} primaryText={perfectScores} secondaryText={matchesPlayedGroups + matchesPlayedKnockouts} />
              </Grid>
              <Grid item xs={12} md={4}>
                <GeneralStats title={t('generalStats.group')} Icon={IconListNumbers} primaryText={correctGroups} secondaryText={matchesPlayedGroups} />
              </Grid>
              <Grid item xs={12} md={4}>
                <GeneralStats title={t('generalStats.knockout')} Icon={IconTrophyFilled} primaryText={correctKnockouts} secondaryText={matchesPlayedKnockouts} />
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
