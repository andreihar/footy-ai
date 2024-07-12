'use client';
import { Avatar, Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';

import { useStats } from '../../utils/StatsContext';
import useCountryFlags from '../../utils/countryUtils';
import Match from '../types/match';
import './style.scss';

const MatchBracket = ({ match }: { match: Match; }) => {
  const { getFlag } = useCountryFlags();

  return (
    <Box className="match" display="flex" position="relative" flexDirection="column">
      <Box className={`match-top team ${match.home_score_total > match.away_score_total ? 'winner' : ''}`}>
        <Box pr={0.5} position="relative" display="inline-block" height="100%">
          <Avatar variant="square" alt="?" className="angled-image" src={getFlag(match.home_team)} />
        </Box>
        <Typography className="name" textTransform="uppercase" letterSpacing={0.5}>{match.home_team}</Typography>
        <Typography className="score">{match.scorePrediction[0]}</Typography>
      </Box>
      <Box className={`match-bottom team ${match.home_score_total < match.away_score_total ? 'winner' : ''}`}>
        <Box pr={0.5} position="relative" display="inline-block" height="100%">
          <Avatar variant="square" alt="?" className="angled-image" src={getFlag(match.away_team)} />
        </Box>
        <Typography className="name" textTransform="uppercase" letterSpacing={0.5}>{match.away_team}</Typography>
        <Typography className="score">{match.scorePrediction[1]}</Typography>
      </Box>
      {match.stage !== 'Third-place play-off' && <>
        <Box className="match-lines">
          <Box className="line one" />
          <Box className="line two" />
        </Box>
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
    const stages = ['Round of 16', 'Quarter-finals', 'Semi-finals', 'Final'];
    const sortedMatchesByStage: { [stage: string]: Match[]; } = stages.reduce<{ [key: string]: Match[]; }>((acc, stage) => {
      acc[stage] = [];
      return acc;
    }, {});

    for (let i = stages.length - 1; i >= 0; i--) {
      const matches = data.filter(match => match.stage === stages[i]);
      if (stages[i] === 'Final') {
        sortedMatchesByStage[stages[i]] = matches;
        continue;
      }
      const winTeams = sortedMatchesByStage[stages[i + 1]]?.flatMap(match => [match.home_team, match.away_team].filter(team => team !== '?')) || [];
      const sortedMatches = matches.sort((a, b) => {
        const aIndexHome = winTeams.indexOf(a.home_team) !== -1 ? winTeams.indexOf(a.home_team) : Infinity;
        const aIndexAway = winTeams.indexOf(a.away_team) !== -1 ? winTeams.indexOf(a.away_team) : Infinity;
        const bIndexHome = winTeams.indexOf(b.home_team) !== -1 ? winTeams.indexOf(b.home_team) : Infinity;
        const bIndexAway = winTeams.indexOf(b.away_team) !== -1 ? winTeams.indexOf(b.away_team) : Infinity;
        return Math.min(aIndexHome, aIndexAway) - Math.min(bIndexHome, bIndexAway);
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
