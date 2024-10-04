import { Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Avatar, Accordion, AccordionSummary, Button, AccordionDetails, List, ListItem } from '@mui/material';
import { IconCheck, IconX, IconMinus, IconListNumbers, IconMathXDivideY2, IconBallFootball } from '@tabler/icons-react';
import grey from '@mui/material/colors/grey';
import DashboardCard from '@/components/shared/DashboardCard';
import * as stats from '@/utils/stats';
import { useTranslations } from 'next-intl';
import useCountryFlags from '@/utils/countryUtils';
import Match from '@/types/match';

interface TeamStat {
  team: string;
  rank: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  matches: string[];
}

function processMatches(allMatches: Match[], scoreExtractor: ((match: Match) => [number, number])) {
  const teamStats: { [key: string]: TeamStat; } = {};

  function updateTeamStats(team: string, goalsFor: number, goalsAgainst: number, result: string) {
    teamStats[team].goalsFor += goalsFor;
    teamStats[team].goalsAgainst += goalsAgainst;
    switch (result) {
      case 'win': teamStats[team].wins++; teamStats[team].points += 3; break;
      case 'loss': teamStats[team].losses++; break;
      case 'draw': teamStats[team].draws++; teamStats[team].points += 1; break;
    }
    teamStats[team].matches.push(result);
  }

  allMatches.forEach(match => {
    const { home_team: home, away_team: away } = match;
    const [homeGoals, awayGoals] = scoreExtractor(match);

    if (!teamStats[home]) teamStats[home] = { team: home, rank: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, matches: [] };
    if (!teamStats[away]) teamStats[away] = { team: away, rank: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, matches: [] };

    if (homeGoals > awayGoals) {
      updateTeamStats(home, homeGoals, awayGoals, 'win');
      updateTeamStats(away, awayGoals, homeGoals, 'loss');
    } else if (homeGoals < awayGoals) {
      updateTeamStats(home, homeGoals, awayGoals, 'loss');
      updateTeamStats(away, awayGoals, homeGoals, 'win');
    } else {
      updateTeamStats(home, homeGoals, awayGoals, 'draw');
      updateTeamStats(away, awayGoals, homeGoals, 'draw');
    }
  });

  const teamsWithRank = Object.values(teamStats)
    .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst))
    .map((teamStat, index) => ({ ...teamStat, rank: index + 1 }));

  return teamsWithRank;
}

const GroupPerformance = ({ group }: { group: string; }) => {
  const { getFlag, getHistoricalName } = useCountryFlags();
  const { data } = stats;
  const t = useTranslations();

  const allMatches = data.filter(match => match.stage === group);

  const teamsStandings = processMatches(allMatches, match => {
    const homeScore = !isNaN(match.home_score_total) ? match.home_score_total : 0;
    const awayScore = !isNaN(match.away_score_total) ? match.away_score_total : 0;
    return [homeScore, awayScore];
  });

  const teamsPredicted = processMatches(allMatches, match => {
    const [homePrediction, awayPrediction] = match.scorePrediction;
    return [homePrediction, awayPrediction];
  });

  const correctRankingsCount = teamsPredicted.filter((team, index) => team.team === teamsStandings[index].team).length;

  let outcomesCount = 0;
  let scoresCount = 0;
  allMatches.forEach(match => {
    const actualMatch = allMatches.find(m => m.home_team === match.home_team && m.away_team === match.away_team);
    if (actualMatch) {
      const predictedOutcome = match.scorePrediction[0] > match.scorePrediction[1] ? 'win' :
        match.scorePrediction[0] < match.scorePrediction[1] ? 'loss' : 'draw';
      const actualOutcome = actualMatch.home_score_total > actualMatch.away_score_total ? 'win' :
        actualMatch.home_score_total < actualMatch.away_score_total ? 'loss' : 'draw';

      if (predictedOutcome === actualOutcome) {
        outcomesCount++;
        if (match.scorePrediction[0] === actualMatch.home_score_total && match.scorePrediction[1] === actualMatch.away_score_total) {
          scoresCount++;
        }
      }
    }
  });

  return (
    <DashboardCard title={`${t('matches.Group')} ${group.split(' ')[1]}`}>
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2" fontWeight={600}></Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('groupPerformance.team')}</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>W</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>D</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>L</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>GF</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>GA</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>GD</Typography></TableCell>
              <TableCell><Typography variant="h6">Pts</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}></Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamsPredicted.map((team) => (
              <TableRow key={team.team}>
                <TableCell>
                  <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>{team.rank}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar alt="?" src={getFlag(team.team, true)} sx={{ width: 30, height: 30, mr: 1, border: '0.5px solid lightgray' }} />
                    <Typography variant="subtitle1" fontWeight={600}>{getHistoricalName(team.team)}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{team.wins}</Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{team.draws}</Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{team.losses}</Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{team.goalsFor}</Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{team.goalsAgainst}</Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{team.goalsFor - team.goalsAgainst}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{team.points}</Typography>
                </TableCell>
                <TableCell>
                  {team.matches.map((match, index) => {
                    switch (match) {
                      case "win":
                        return <IconButton key={index} size="small" sx={{ color: '#fff', backgroundColor: 'success.dark', mr: '4px', '&:hover': { backgroundColor: 'success.dark', opacity: 0.7 } }}><IconCheck /></IconButton>;
                      case "loss":
                        return <IconButton key={index} size="small" sx={{ color: '#fff', backgroundColor: 'error.main', mr: '4px', '&:hover': { backgroundColor: 'error.main', opacity: 0.7 } }}><IconX /></IconButton>;
                      default:
                        return <IconButton key={index} size="small" sx={{ color: '#fff', backgroundColor: grey[600], mr: '4px', '&:hover': { backgroundColor: grey[600], opacity: 0.7 } }}><IconMinus /></IconButton>;
                    }
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box mt={3} display="flex" justifyContent="center" width="100%">
          <Accordion disableGutters elevation={0} sx={{ width: '100%' }}>
            <AccordionSummary aria-controls="panel1a-content" id="panel1a-header" sx={{ justifyContent: 'center', display: 'flex', width: '100%' }}>
              <Button variant="contained" color="primary" component="div" sx={{ mx: 'auto' }}>
                {t('groupPerformance.results')}
              </Button>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconListNumbers style={{ marginRight: 5 }} />
                  <Typography variant="h6">{t('groupPerformance.ranking')}: {correctRankingsCount}/4</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconMathXDivideY2 style={{ marginRight: 5 }} />
                  <Typography variant="h6">{t('groupPerformance.outcomes')}: {outcomesCount}/6</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconBallFootball style={{ marginRight: 5 }} />
                  <Typography variant="h6">{t('groupPerformance.scores')}: {scoresCount}/6</Typography>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default GroupPerformance;
