import Grid from '@mui/material/Grid2';
import { generateMetadata as generateSEO } from '@/components/SEO';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getStats } from '@/utils/stats';
import useYear from '@/utils/yearUtils';
import GeneralStats from '@/components/dashboard/GeneralStats';
import PredictionsOverview from '@/components/dashboard/PredictionsOverview';
import OverallStatistics from '@/components/dashboard/OverallStatistics';
import RecentPredictions from '@/components/dashboard/RecentPredictions';
import DailyPredictions from '@/components/dashboard/DailyPredictions';

type Props = {
  params: { locale: string; year: string; };
};

export async function generateMetadata({ params: { locale, year } }: Props) {
  setRequestLocale(locale);
  const { getTourneyName } = useYear(Number(year));
  const t = await getTranslations('Overview');

  return generateSEO({
    title: t('title'),
    description: t('description', { tourney: getTourneyName(Number(year)) })
  });
}

export default async function DashboardPage({ params: { locale, year } }: Props) {
  setRequestLocale(locale);
  const stats = await getStats(Number(year));
  const t = await getTranslations('GeneralStats');
  const { data, perfectScores, correctGroups, matchesPlayedGroups, correctKnockouts, matchesPlayedKnockouts, categories, correctPredsPerDay, incorrectPredsPerDay } = stats;

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <GeneralStats title={t('perfect')} iconIndex={0} primaryText={perfectScores} secondaryText={matchesPlayedGroups + matchesPlayedKnockouts} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <GeneralStats title={t('group')} iconIndex={1} primaryText={correctGroups} secondaryText={matchesPlayedGroups} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <GeneralStats title={t('knockout')} iconIndex={2} primaryText={correctKnockouts} secondaryText={matchesPlayedKnockouts} />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <PredictionsOverview categories={categories} correctPredsPerDay={correctPredsPerDay} incorrectPredsPerDay={incorrectPredsPerDay} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <RecentPredictions data={data} year={Number(year)} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <OverallStatistics
              correctPrev={Number((100 * correctPredsPerDay.slice(0, -1).reduce((a, c) => a + c, 0) / (correctPredsPerDay.slice(0, -1).concat(incorrectPredsPerDay.slice(0, -1)).reduce((a, c) => a + c, 0))).toFixed(2))}
              correct={Number((100 * correctPredsPerDay.reduce((a, c) => a + c, 0) / (correctPredsPerDay.concat(incorrectPredsPerDay).reduce((a, c) => a + c, 0))).toFixed(2))}
            />
          </Grid>
          <Grid size={12}>
            <DailyPredictions categories={categories} dailyPers={correctPredsPerDay.map((correct, index) => Number((100 * correct / (correct + incorrectPredsPerDay[index])).toFixed(2)))} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
