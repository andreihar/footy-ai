
import DashboardCard from '@/app/components/shared/DashboardCard';
import { Timeline, TimelineItem, TimelineOppositeContent, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, timelineOppositeContentClasses, } from '@mui/lab';
import { Typography } from '@mui/material';
import Match from '../../types/match';
import Preds from '../../types/preds';
import euro2024 from '../../../../public/data/euro2024.json';
import euro2024predsJson from '../../../../public/data/euro2024preds.json';
import { useEffect, useState } from "react";
const euro2024preds: Preds = euro2024predsJson;

const RecentPredictions = () => {

  const [matches, setMatches] = useState<(Match & { status: string; })[]>([]);

  useEffect(() => {
    const allMatches = [...euro2024.groupStage, ...euro2024.knockoutStage]
      .flatMap(stage => stage.matches
        .filter(match => match.score.home !== null && match.score.away !== null)
        .map(match => {
          const predictionKey = `${match.teams.home}_${match.teams.away}_${stage.round.startsWith("Group") ? "1" : "0"}`;
          const predictions = euro2024preds[predictionKey] ? euro2024preds[predictionKey].predictions : [0, 0, 0];
          const scorePrediction = euro2024preds[predictionKey] ? euro2024preds[predictionKey].scorePrediction : [0, 0];
          return { ...match, stage: stage.round, predictions, scorePrediction };
        }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-6)
      .map(match => {
        if (match.score.home !== null && match.score.away !== null) {
          const predictedOutcomeIndex = match.predictions.indexOf(Math.max(...match.predictions));
          const outcomes = ["home", "away", "draw"];
          const predictedOutcome = outcomes[predictedOutcomeIndex];
          const actualOutcome = match.score.home > match.score.away ? "home" :
            match.score.home < match.score.away ? "away" : "draw";
          const isPerfect = predictedOutcome === actualOutcome && match.scorePrediction[0] === match.score.home && match.scorePrediction[1] === match.score.away;
          const isCorrect = predictedOutcome === actualOutcome;
          return { ...match, status: isPerfect ? "perfect" : isCorrect ? "correct" : "incorrect" };
        } else {
          return { ...match, status: "unknown" };
        }
      });

    setMatches(allMatches);
  }, []);

  return (
    <DashboardCard title="Recent Predictions">
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
              <TimelineOppositeContent>{match.date.split(',')[0]}</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={match.status === 'perfect' ? 'primary' : match.status === 'correct' ? 'success' : 'error'} variant="outlined" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography fontWeight="600">{`${match.teams.home} vs ${match.teams.away}`}</Typography>
                predicted {match.status}ly
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default RecentPredictions;
