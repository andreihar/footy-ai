import DashboardCard from '@/components/shared/DashboardCard';
import { Timeline, TimelineItem, TimelineOppositeContent, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, timelineOppositeContentClasses, } from '@mui/lab';
import { Typography } from '@mui/material';
import useCountryFlags from '@/utils/countryUtils';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/i18n/routing';
import Match from '@/types/match';

interface RecentPredictionsProps {
  data: Match[];
  year: number;
}

const RecentPredictions: React.FC<RecentPredictionsProps> = ({ data, year }) => {
  const { getHistoricalName } = useCountryFlags(year);
  const t = useTranslations('recentPredictions');
  const locale = useLocale() as Locale;

  const matches = data.filter(match => !isNaN(match.home_score_total) && !isNaN(match.away_score_total))
    .slice(-6).reverse().map(match => {
      const predictedOutcomeIndex = match.predictions.indexOf(Math.max(...match.predictions));
      const outcomes = ["home", "away", "draw"];
      const predictedOutcome = outcomes[predictedOutcomeIndex];
      const actualOutcome = match.home_score_total > match.away_score_total ? "home" :
        match.home_score_total < match.away_score_total ? "away" : "draw";
      const isPerfect = predictedOutcome === actualOutcome && match.scorePrediction[0] === match.home_score_total && match.scorePrediction[1] === match.away_score_total;
      const isCorrect = predictedOutcome === actualOutcome;
      return { ...match, status: isPerfect ? "perfect" : isCorrect ? "correct" : "incorrect" };
    });

  return (
    <DashboardCard title={t('title')}>
      <Timeline className="theme-timeline" nonce={undefined} onResize={undefined} onResizeCapture={undefined}
        sx={{
          p: 0, mb: '-10px',
          '& .MuiTimelineConnector-root': { width: '1px', backgroundColor: '#efefef' },
          [`& .${timelineOppositeContentClasses.root}`]: { flex: 0.5, paddingLeft: 0, },
          '& .MuiTimelineItem-root::before': { display: 'none' },
        }}
      >
        {matches.map((match, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent>{new Date(match.date).toLocaleString(locale, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={match.status === 'perfect' ? 'primary' : match.status === 'correct' ? 'success' : 'error'} variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">{`${getHistoricalName(match.home_team)} vs ${getHistoricalName(match.away_team)}`}</Typography>
              {t.rich('prediction', { outcome: t(`${match.status}` as any) })}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </DashboardCard>
  );
};

export default RecentPredictions;
