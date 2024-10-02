'use client';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import PageContainer from '@/components/container/PageContainer';
import { useTheme } from '@mui/material/styles';
import * as stats from '@/utils/stats';
import useCountryFlags from '@/utils/countryUtils';
import { useTranslations } from 'next-intl';
import Match from '@/types/match';
import './style.scss';

const MatchBracket = ({ match }: { match: Match; }) => {
  const { getFlag, getHistoricalName } = useCountryFlags();
  const theme = useTheme();
  const result = match.home_score_total > match.away_score_total ? 'home' :
    match.home_score_total < match.away_score_total ? 'away' : 'unknown';

  return (
    <Box className="match" minWidth={240} mt={1.5} mr={6} mb={1.5} ml={0} display="flex" position="relative" flexDirection="column">
      <Box mb={0.2} display="flex" alignItems="center" width="100%" height="100%" border="2px solid transparent" position="relative" overflow="hidden"
        sx={{ background: result === 'home' ? theme.palette.primary.main : '#fff', color: result === 'home' ? '#fff' : '#000' }}>
        <Box pr={0.5} position="relative" display="inline-block" height="100%">
          <Image alt={`Flag of ${match.home_team}`} className="angled-image" src={getFlag(match.home_team, false)} height={26} width={35} objectFit="cover" objectPosition="center" unoptimized />
        </Box>
        <Typography textTransform="uppercase" letterSpacing={0.5}>{getHistoricalName(match.home_team)}</Typography>
        <Typography className="score" ml="auto" pr={1.5} fontWeight={900}>{match.scorePrediction[0]}</Typography>
      </Box>
      <Box mt={0.2} display="flex" alignItems="center" width="100%" height="100%" border="2px solid transparent" position="relative" overflow="hidden"
        sx={{ background: result === 'away' ? theme.palette.primary.main : '#fff', color: result === 'away' ? '#fff' : '#000' }}>
        <Box pr={0.5} position="relative" display="inline-block" height="100%">
          <Image alt={`Flag of ${match.away_team}`} className="angled-image" src={getFlag(match.away_team, false)} height={26} width={35} objectFit="cover" objectPosition="center" unoptimized />
        </Box>
        <Typography textTransform="uppercase" letterSpacing={0.5}>{getHistoricalName(match.away_team)}</Typography>
        <Typography className="score" ml="auto" pr={1.5} fontWeight={900}>{match.scorePrediction[1]}</Typography>
      </Box>
      {match.stage !== 'Third-place play-off' && <>
        {match.stage !== 'Final' && (
          <Box display="block" position="absolute" top="50%" bottom={0} className="match-lines">
            <Box position="absolute" sx={{ background: theme.palette.primary.main }} className="line one" />
            <Box position="absolute" sx={{ background: theme.palette.primary.main }} className="line two" />
          </Box>
        )}
        <Box display="block" position="absolute" top="50%" bottom={0} className="match-lines alt">
          <Box position="absolute" sx={{ background: theme.palette.primary.main }} className="line one" />
        </Box>
      </>}
    </Box>
  );
};

const KnockoutPage = () => {
  const { data } = stats;
  const t = useTranslations();

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
    <PageContainer title={t('header.knockout')} description="List of matches and predictions for the Knockout Stage">
      <Box display="flex" sx={{ overflow: 'auto', maxWidth: '90vw' }}>
        {Object.entries(sortTournamentMatches(data)).map(([stageName, matches]) => {
          return (
            matches.length > 0 && (
              <Box className="stage-column" key={stageName} display="flex" flexDirection="column" minHeight="100%" justifyContent="space-around" alignItems="center" position="relative" pt={5}>
                <Typography variant="h5" position="absolute" zIndex={1} top={0} left="50%" sx={{ transform: 'translateX(-50%)' }}>
                  {t(`matches.${stageName}`)}
                </Typography>
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
