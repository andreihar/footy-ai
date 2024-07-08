'use client';
import { Avatar, Box, Button, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import DashboardCard from '@/app/components/shared/DashboardCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

import { useStats } from '../../utils/StatsContext';
import useCountryFlags from '../../utils/countryUtils';
import Match from '../types/match';

const MatchCard = ({ match }: { match: Match; }) => {
  const { getFlag } = useCountryFlags();

  const predictedOutcomeIndex = match.predictions.indexOf(Math.max(...match.predictions));
  let predictedOutcome = "";
  if (predictedOutcomeIndex === 0) predictedOutcome = "home";
  else if (predictedOutcomeIndex === 1) predictedOutcome = "away";
  else if (predictedOutcomeIndex === 2) predictedOutcome = "draw";

  let correctOutcome = "unknown";
  let correctScore = "unknown";

  if (!isNaN(match.home_score_total) && !isNaN(match.away_score_total)) {
    let actualOutcome = "";
    if (match.home_score_total > match.away_score_total) actualOutcome = "home";
    else if (match.home_score_total < match.away_score_total) actualOutcome = "away";
    else if (match.home_score_total === match.away_score_total) actualOutcome = "draw";
    correctOutcome = predictedOutcome === actualOutcome ? "correct" : "incorrect";
    correctScore = (match.scorePrediction[0] === match.home_score_total && match.scorePrediction[1] === match.away_score_total) ? "correct" : "incorrect";
  }

  return (
    <DashboardCard>
      <CardContent>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mb={2}>
          <Typography variant="h6">
            {new Date(match.date).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            &nbsp; • &nbsp;
            {new Date(match.date).toLocaleString(undefined, { hour: 'numeric', minute: 'numeric' })}
          </Typography>
          <Typography variant="h5" mt={2} >{match.stage}</Typography>
          <Typography sx={{ textTransform: "uppercase" }} mt={2}>{match.stadium}, {match.city}</Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          {/* Home */}
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" marginRight={2}>
            <Avatar alt="?" src={getFlag(match.home_team)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
            <Typography variant="h3">{match.home_team}</Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginX: 4 }}>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mr: 2 }}>
              <Typography variant="h1" component="span">{match.scorePrediction[0]}</Typography>
              <Typography variant="body1" component="span">({match.home_score_total})</Typography>
            </Box>
            <Typography variant="h4" component="span" sx={{ mx: 2 }}>-</Typography>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ ml: 2 }}>
              <Typography variant="h1" component="span">{match.scorePrediction[1]}</Typography>
              <Typography variant="body1" component="span">({match.away_score_total})</Typography>
            </Box>
          </Box>
          {/* Away */}
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" marginLeft={2}>
            <Avatar alt="?" src={getFlag(match.away_team)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
            <Typography variant="h3">{match.away_team}</Typography>
          </Box>
        </Box>
        <Box mt={5} sx={{ width: '100%', bgcolor: 'grey.300', borderRadius: '10px', height: '24px', display: 'flex' }}>
          <Box sx={{ bgcolor: 'primary.main', borderRadius: '6px 0 0 6px', width: `${match.predictions[0]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="white">{match.predictions[0]}%</Typography>
          </Box>
          {match.predictions[2] > 0 && (
            <Box sx={{ bgcolor: 'grey.300', width: `${match.predictions[2]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6">{match.predictions[2]}%</Typography>
            </Box>
          )}
          <Box sx={{ bgcolor: 'secondary.main', borderRadius: '0 6px 6px 0', width: `${match.predictions[1]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6">{match.predictions[1]}%</Typography>
          </Box>
        </Box>
        <Box mt={3} display="flex" justifyContent="center" width="100%">
          <Accordion disableGutters elevation={0} sx={{ width: '100%' }}>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ justifyContent: 'center', display: 'flex', width: '100%' }}
            >
              <Button variant="contained" color="primary" component="div" sx={{ mx: 'auto' }}>
                Prediction Results
              </Button>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                <Box display="flex" mb={2}>
                  {correctOutcome === "correct" && <CheckCircleIcon color="success" />}
                  {correctOutcome === "incorrect" && <CancelIcon color="error" />}
                  {correctOutcome === "unknown" && <HelpIcon sx={{ color: 'gray' }} />}
                  <Typography ml={1}>Correct Outcome Prediction</Typography>
                </Box>
                <Box display="flex">
                  {correctScore === "correct" && <CheckCircleIcon color="success" />}
                  {correctScore === "incorrect" && <CancelIcon color="error" />}
                  {correctScore === "unknown" && <HelpIcon sx={{ color: 'gray' }} />}
                  <Typography ml={1}>Correct Score Prediction</Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
    </DashboardCard >
  );
};

const KnockoutPage = () => {
  const { data } = useStats();

  return (
    <PageContainer title="Knockout Stage" description="List of matches and predictions for the Knockout Stage">
      <>
        {data.filter(match => match.home_team !== "?" && match.away_team !== "?")
          .reverse().map((match, index) => <MatchCard key={index} match={match} />)}
      </>
    </PageContainer>
  );
};

export default KnockoutPage;
