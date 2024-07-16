
import DashboardCard from '@/app/components/shared/DashboardCard';
import { Timeline, TimelineItem, TimelineOppositeContent, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, timelineOppositeContentClasses, } from '@mui/lab';
import { Typography } from '@mui/material';
import Match from '../../types/match';
import { useEffect, useState } from "react";
import useCountryFlags from '@/utils/countryUtils';
import { useStats } from '@/utils/StatsContext';
import { useIntl } from 'react-intl';
import { useLanguage } from '@/utils/LanguageProvider';

const RecentPredictions = () => {
  const { data, fetchMatch } = useStats();
  const { getHistoricalName } = useCountryFlags();
  const { formatMessage } = useIntl();
  const { language } = useLanguage();
  const [matches, setMatches] = useState<(Match & { status: string; })[]>([]);

  useEffect(() => {
    const allMatches = data.filter(match => !isNaN(match.home_score_total) && !isNaN(match.away_score_total))
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

    setMatches(allMatches);
  }, [data]);

  return (
    <DashboardCard title={formatMessage({ id: 'recentPredictions.title' })}>
      <>
        <Timeline className="theme-timeline" nonce={undefined} onResize={undefined} onResizeCapture={undefined}
          sx={{
            p: 0, mb: '-40px',
            '& .MuiTimelineConnector-root': { width: '1px', backgroundColor: '#efefef' },
            [`& .${timelineOppositeContentClasses.root}`]: { flex: 0.5, paddingLeft: 0, },
          }}
        >
          {matches.map((match, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>{new Date(match.date).toLocaleString(language, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={match.status === 'perfect' ? 'primary' : match.status === 'correct' ? 'success' : 'error'} variant="outlined" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography fontWeight="600">{`${getHistoricalName(match.home_team)} vs ${getHistoricalName(match.away_team)}`}</Typography>
                {formatMessage({ id: `recentPredictions.${match.status}` })}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default RecentPredictions;
