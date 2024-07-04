'use client';
import { Avatar, Box, Button, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import DashboardCard from '@/app/components/shared/DashboardCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

import euro2024 from '../../../public/data/euro2024.json';
import euro2024predsJson from '../../../public/data/euro2024preds.json';
import { useEffect, useState } from 'react';
import useCountryFlags from '../../utils/countryUtils';
import Match from '../types/match';
import Preds from '../types/preds';

const euro2024preds: Preds = euro2024predsJson;

const MatchCard = ({ match }: { match: Match; }) => {
  const { getFlag } = useCountryFlags();

  const predictedOutcomeIndex = match.predictions.indexOf(Math.max(...match.predictions));
  let predictedOutcome = "";
  if (predictedOutcomeIndex === 0) predictedOutcome = "home";
  else if (predictedOutcomeIndex === 1) predictedOutcome = "away";
  else if (predictedOutcomeIndex === 2) predictedOutcome = "draw";

  let correctOutcome = "unknown";
  let correctScore = "unknown";

  if (match.score.home !== null && match.score.away !== null) {
    let actualOutcome = "";
    if (match.score.home > match.score.away) actualOutcome = "home";
    else if (match.score.home < match.score.away) actualOutcome = "away";
    else if (match.score.home === match.score.away) actualOutcome = "draw";
    correctOutcome = predictedOutcome === actualOutcome ? "correct" : "incorrect";
    correctScore = (match.scorePrediction[0] === match.score.home && match.scorePrediction[1] === match.score.away) ? "correct" : "incorrect";
  }

  return (
    <DashboardCard>
      <CardContent>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mb={2}>
          <Typography variant="h6">{match.date} &nbsp; • &nbsp; {match.stage}</Typography>
          <Typography sx={{ textTransform: "uppercase" }} mt={2}>{match.location}</Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          {/* Home */}
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" marginRight={2}>
            <Avatar alt="?" src={getFlag(match.teams.home)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
            <Typography variant="h3">{match.teams.home}</Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginX: 4 }}>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mr: 2 }}>
              <Typography variant="h1" component="span">{match.scorePrediction[0]}</Typography>
              <Typography variant="body1" component="span">({match.score.home})</Typography>
            </Box>
            <Typography variant="h4" component="span" sx={{ mx: 2 }}>-</Typography>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ ml: 2 }}>
              <Typography variant="h1" component="span">{match.scorePrediction[1]}</Typography>
              <Typography variant="body1" component="span">({match.score.away})</Typography>
            </Box>
          </Box>
          {/* Away */}
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" marginLeft={2}>
            <Avatar alt="?" src={getFlag(match.teams.away)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
            <Typography variant="h3">{match.teams.away}</Typography>
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

const MatchesPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const allMatches = [...euro2024.groupStage, ...euro2024.knockoutStage]
      .flatMap(stage => stage.matches.map(match => {
        const predictionKey = `${match.teams.home}_${match.teams.away}_${stage.round.startsWith("Group") ? "1" : "0"}`;
        const predictions = euro2024preds[predictionKey] ? euro2024preds[predictionKey].predictions : [0, 0, 0];
        const scorePrediction = euro2024preds[predictionKey] ? euro2024preds[predictionKey].scorePrediction : [0, 0];
        return { ...match, stage: stage.round, predictions, scorePrediction };
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setMatches(allMatches);
  }, []);

  return (
    <PageContainer title="Matches" description="List of all matches and predictions">
      <>
        {matches.filter(match => match.teams.home !== "?" && match.teams.away !== "?")
          .map((match, index) => <MatchCard key={index} match={match} />)}
      </>
    </PageContainer>
  );
};

export default MatchesPage;
