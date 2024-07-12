'use client';
import { Avatar, Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';

import { useStats } from '../../utils/StatsContext';
import useCountryFlags from '../../utils/countryUtils';
import Match from '../types/match';
import './style.scss';

const MatchBracket = ({ match }: { match: Match; }) => {
  const { getFlag, getHistoricalName } = useCountryFlags();

  return (
    <Box className="match" display="flex" position="relative" flexDirection="column">
      <Box className={`match-top team ${match.home_score_total > match.away_score_total ? 'winner' : ''}`}>
        <Box pr={0.5} position="relative" display="inline-block" height="100%">
          <Avatar variant="square" alt="?" className="angled-image" src={getFlag(match.home_team)} />
        </Box>
        <Typography className="name" textTransform="uppercase" letterSpacing={0.5}>{getHistoricalName(match.home_team)}</Typography>
        <Typography className="score">{match.scorePrediction[0]}</Typography>
      </Box>
      <Box className={`match-bottom team ${match.home_score_total < match.away_score_total ? 'winner' : ''}`}>
        <Box pr={0.5} position="relative" display="inline-block" height="100%">
          <Avatar variant="square" alt="?" className="angled-image" src={getFlag(match.away_team)} />
        </Box>
        <Typography className="name" textTransform="uppercase" letterSpacing={0.5}>{getHistoricalName(match.away_team)}</Typography>
        <Typography className="score">{match.scorePrediction[1]}</Typography>
      </Box>
      {match.stage !== 'Third-place play-off' && <>
        {match.stage !== 'Final' && (
          <Box className="match-lines">
            <Box className="line one" />
            <Box className="line two" />
          </Box>
        )}
        <Box className="match-lines alt">
          <Box className="line one" />
        </Box>
      </>}
    </Box>
  );
};

const KnockoutPage = () => {
  const { data } = useStats();

  const sortTournamentMatches = (data: Match[]): { [stage: string]: Match[]; } => {
    const stages = ['Round of 16', 'Quarter-finals', 'Semi-finals', 'Final', 'Third-place play-off'];
    let teamWeights: { [team: string]: number; } = {};
    const sortedMatchesByStage = stages.reduce<{ [stage: string]: Match[]; }>((acc, stage) => {
      acc[stage] = [];
      return acc;
    }, {});

    for (let i = stages.length - 1; i >= 0; i--) {
      const stageMatches = data.filter(match => match.stage === stages[i]);
      const sortedMatches = stageMatches.sort((a, b) => {
        const aWeight = (teamWeights[a.home_team] || 0) + (teamWeights[a.away_team] || 0);
        const bWeight = (teamWeights[b.home_team] || 0) + (teamWeights[b.away_team] || 0);
        return aWeight - bWeight;
      });
      sortedMatches.forEach((match, index) => {
        if (match.home_team !== '?') teamWeights[match.home_team] = (index * 2) + 1;
        if (match.away_team !== '?') teamWeights[match.away_team] = (index * 2) + 2;
      });
      sortedMatchesByStage[stages[i]] = sortedMatches;
    }
    return sortedMatchesByStage;
  };

  return (
    <PageContainer title="Knockout Stage" description="List of matches and predictions for the Knockout Stage">
      <Box display="flex" className="theme">
        {Object.entries(sortTournamentMatches(data)).map(([stageName, matches]) => {
          return (
            matches.length > 0 && (
              <Box className="column" key={stageName} display="flex" flexDirection="column" minHeight="100%" justifyContent="space-around" alignItems="center">
                {matches.map((match, index) => (
                  <MatchBracket key={`${stageName}-${index}`} match={match} />
                ))}
              </Box>
            )
          );
        })}
      </Box>
    </PageContainer>
  );
};

export default KnockoutPage;
