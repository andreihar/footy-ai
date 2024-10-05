import { Box, Grid } from '@mui/material';
import { generateMetadata as generateSEO } from '@/components/SEO';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { getStats } from '@/utils/stats';
import GeneralStats from '@/components/dashboard/GeneralStats';
import PredictionsOverview from '@/components/dashboard/PredictionsOverview';
import OverallStatistics from '@/components/dashboard/OverallStatistics';
import RecentPredictions from '@/components/dashboard/RecentPredictions';
import DailyPredictions from '@/components/dashboard/DailyPredictions';

type Props = {
  params: { locale: string; year: string; };
};

export async function generateMetadata({ params: { locale, year } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('overview');

  return generateSEO({
    title: t('title'),
    description: t('description', { year: year })
  });
}

export default async function DashboardPage({ params: { locale, year } }: Props) {
  unstable_setRequestLocale(locale);
  const stats = await getStats(Number(year));
  const t = await getTranslations('generalStats');
  const { data, perfectScores, correctGroups, matchesPlayedGroups, correctKnockouts, matchesPlayedKnockouts, categories, correctPredictionsPerDay, incorrectPredictionsPerDay } = stats;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <GeneralStats title={t('perfect')} iconIndex={0} primaryText={perfectScores} secondaryText={matchesPlayedGroups + matchesPlayedKnockouts} />
            </Grid>
            <Grid item xs={12} md={4}>
              <GeneralStats title={t('group')} iconIndex={1} primaryText={correctGroups} secondaryText={matchesPlayedGroups} />
            </Grid>
            <Grid item xs={12} md={4}>
              <GeneralStats title={t('knockout')} iconIndex={2} primaryText={correctKnockouts} secondaryText={matchesPlayedKnockouts} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <PredictionsOverview categories={categories} correctPredictionsPerDay={correctPredictionsPerDay} incorrectPredictionsPerDay={incorrectPredictionsPerDay} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RecentPredictions data={data} year={Number(year)} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <OverallStatistics
                correctPrev={Number((100 * correctPredictionsPerDay.slice(0, -1).reduce((a, c) => a + c, 0) / (correctPredictionsPerDay.slice(0, -1).concat(incorrectPredictionsPerDay.slice(0, -1)).reduce((a, c) => a + c, 0))).toFixed(2))}
                correct={Number((100 * correctPredictionsPerDay.reduce((a, c) => a + c, 0) / (correctPredictionsPerDay.concat(incorrectPredictionsPerDay).reduce((a, c) => a + c, 0))).toFixed(2))}
              />
            </Grid>
            <Grid item xs={12}>
              <DailyPredictions categories={categories} dailyPercentages={correctPredictionsPerDay.map((correct, index) => Number((100 * correct / (correct + incorrectPredictionsPerDay[index])).toFixed(2)))} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
