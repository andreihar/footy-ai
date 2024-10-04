'use client';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import useCountryFlags from '@/utils/countryUtils';
import Match from '@/types/match';

interface MatchBracketProps {
  match: Match;
}

const MatchBracket: React.FC<MatchBracketProps> = ({ match }) => {
  const { getFlag, getHistoricalName } = useCountryFlags();
  const theme = useTheme();
  const result = match.home_score_total > match.away_score_total ? 'home' :
    match.home_score_total < match.away_score_total ? 'away' : 'unknown';

  return (
    <Box className="match" minWidth={240} mt={1.5} mr={6} mb={1.5} ml={0} display="flex" position="relative" flexDirection="column">
      <Box mb={0.2} display="flex" alignItems="center" width="100%" height="100%" border="2px solid transparent" position="relative" overflow="hidden"
        sx={{ background: result === 'home' ? theme.palette.primary.main : '#fff', color: result === 'home' ? '#fff' : '#000' }}>
        <Box pr={0.5} position="relative" display="inline-block" height="100%">
          <Image alt={`Flag of ${match.home_team}`} className="angled-image" src={getFlag(match.home_team, false)} height={26} width={35} style={{ objectFit: 'cover', objectPosition: 'center' }} unoptimized />
        </Box>
        <Typography textTransform="uppercase" letterSpacing={0.5}>{getHistoricalName(match.home_team)}</Typography>
        <Typography className="score" ml="auto" pr={1.5} fontWeight={900}>{match.scorePrediction[0]}</Typography>
      </Box>
      <Box mt={0.2} display="flex" alignItems="center" width="100%" height="100%" border="2px solid transparent" position="relative" overflow="hidden"
        sx={{ background: result === 'away' ? theme.palette.primary.main : '#fff', color: result === 'away' ? '#fff' : '#000' }}>
        <Box pr={0.5} position="relative" display="inline-block" height="100%">
          <Image alt={`Flag of ${match.away_team}`} className="angled-image" src={getFlag(match.away_team, false)} height={26} width={35} style={{ objectFit: 'cover', objectPosition: 'center' }} unoptimized />
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

export default MatchBracket;
