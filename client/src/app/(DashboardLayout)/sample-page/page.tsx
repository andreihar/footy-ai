'use client';
import { Avatar, Box, Button, CardContent, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

import euro2024 from '../../../../public/data/euro2024.json';
import { useEffect, useState } from 'react';
import Match from '../types/match';

const MatchCard = ({ match, predictions, scorePrediction }: { match: Match; predictions: number[]; scorePrediction: number[]; }) => {
  const [countryCodes, setCountryCodes] = useState<{ [key: string]: string; }>({});
  const [isTextVisible, setIsTextVisible] = useState(false);

  const toggleTextVisibility = () => {
    setIsTextVisible(!isTextVisible);
  };

  const predictedOutcomeIndex = predictions.indexOf(Math.max(...predictions));
  let predictedOutcome = "";
  if (predictedOutcomeIndex === 0) predictedOutcome = "home";
  else if (predictedOutcomeIndex === 1) predictedOutcome = "draw";
  else if (predictedOutcomeIndex === 2) predictedOutcome = "away";

  let correctOutcome = "unknown";
  let correctScore = "unknown";

  if (match.score.home !== null && match.score.away !== null) {
    let actualOutcome = "";
    if (match.score.home > match.score.away) actualOutcome = "home";
    else if (match.score.home < match.score.away) actualOutcome = "away";
    else if (match.score.home === match.score.away) actualOutcome = "draw";
    correctOutcome = predictedOutcome === actualOutcome ? "correct" : "incorrect";
    correctScore = (scorePrediction[0] === match.score.home && scorePrediction[1] === match.score.away) ? "correct" : "incorrect";
  }

  useEffect(() => {
    const fetchCountryCodes = async () => {
      const response = await fetch('https://flagcdn.com/en/codes.json');
      const data = await response.json();
      const invertedData = Object.entries(data).reduce((obj, [code, country]) => {
        if (!code.startsWith('us-')) {
          obj[country as string] = code;
        }
        return obj;
      }, {} as { [key: string]: string; });
      setCountryCodes(invertedData);
    };

    fetchCountryCodes();
  }, []);

  const getCountryCode = (countryName: string) => {
    return countryCodes[countryName];
  };

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
            <Avatar alt="Country Flag" src={`https://flagcdn.com/w640/${getCountryCode(match.teams.home)}.png`} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
            <Typography variant="h3">{match.teams.home}</Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginX: 4 }}>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mr: 2 }}>
              <Typography variant="h1" component="span">2</Typography>
              <Typography variant="body1" component="span">({match.score.home})</Typography>
            </Box>
            <Typography variant="h4" component="span" sx={{ mx: 2 }}>-</Typography>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ ml: 2 }}>
              <Typography variant="h1" component="span">2</Typography>
              <Typography variant="body1" component="span">({match.score.away})</Typography>
            </Box>
          </Box>
          {/* Away */}
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" marginLeft={2}>
            <Avatar alt="Country Flag" src={`https://flagcdn.com/w640/${getCountryCode(match.teams.away)}.png`} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
            <Typography variant="h3">{match.teams.away}</Typography>
          </Box>
        </Box>
        <Box mt={5} sx={{ width: '100%', bgcolor: 'grey.300', borderRadius: '10px', height: '24px', display: 'flex' }}>
          <Box sx={{ bgcolor: 'primary.main', borderRadius: '6px 0 0 6px', width: `${predictions[0]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="white">{predictions[0]}%</Typography>
          </Box>
          {predictions[1] > 0 && (
            <Box sx={{ bgcolor: 'grey.300', width: `${predictions[1]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6">{predictions[1]}%</Typography>
            </Box>
          )}
          <Box sx={{ bgcolor: 'secondary.main', borderRadius: '0 6px 6px 0', width: `${predictions[2]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6">{predictions[2]}%</Typography>
          </Box>
        </Box>
        <Box mt={3} display="flex" justifyContent="center" width="100%">
          <Button variant="contained" onClick={toggleTextVisibility} disableElevation color="primary" >
            Prediction Details
          </Button>
        </Box>
        {isTextVisible && (
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Box display="flex" alignItems="center" mb={2}>
              {correctOutcome === "correct" && <CheckCircleIcon color="success" />}
              {correctOutcome === "incorrect" && <CancelIcon color="error" />}
              {correctOutcome === "unknown" && <HelpIcon sx={{ color: 'gray' }} />}
              <Typography ml={1}>Correct Outcome Prediction</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              {correctScore === "correct" && <CheckCircleIcon color="success" />}
              {correctScore === "incorrect" && <CancelIcon color="error" />}
              {correctScore === "unknown" && <HelpIcon sx={{ color: 'gray' }} />}
              <Typography ml={1}>Correct Score Prediction</Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </DashboardCard >
  );
};

const SamplePage = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const allMatches = [...euro2024.groupStage, ...euro2024.knockoutStage]
      .flatMap(stage => stage.matches.map(match => ({ ...match, stage: stage.round })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setMatches(allMatches);
  }, []);

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <DashboardCard title="Sample Page">
        <Typography>This is a sample page</Typography>
      </DashboardCard>
      <>
        {matches.filter(match => match.teams.home !== "?" && match.teams.away !== "?")
          .map(match => <MatchCard match={match} predictions={[41.95, 21.42, 36.63]} scorePrediction={[2, 2]} />)}
      </>
    </PageContainer>
  );
};

export default SamplePage;

