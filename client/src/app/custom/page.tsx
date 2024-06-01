'use client';
import { Avatar, Box, Button, CardContent, Typography, TextField, MenuItem, FormControlLabel, Switch, CircularProgress } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import DashboardCard from '@/app/components/shared/DashboardCard';

import { useEffect, useState } from 'react';

const countries = ["Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "England", "Estonia", "Faroe Islands", "Finland", "France", "Georgia", "Germany", "Gibraltar", "Greece", "Hungary", "Iceland", "Israel", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Northern Ireland", "Norway", "Poland", "Portugal", "Ireland", "Romania", "Russia", "San Marino", "Scotland", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "Wales"];

const CustomPage = () => {
  const [countryCodes, setCountryCodes] = useState<{ [key: string]: string; }>({});
  const [predictions, setPredictions] = useState([37.27, 43.33, 19.4]);
  const [home, setHome] = useState('England');
  const [away, setAway] = useState('France');
  const [allowDraw, setAllowDraw] = useState(true);
  const [homeScore, setHomeScore] = useState(1);
  const [awayScore, setAwayScore] = useState(2);
  const [loading, setLoading] = useState(false);

  async function fetchMatchPrediction() {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/predict`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ home, away, allow_draw: allowDraw })
      });
      const data = await response.json();
      setPredictions(data.predictions);
      setHomeScore(data.scorePrediction[0]);
      setAwayScore(data.scorePrediction[1]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Failed to fetch match prediction:', error);
    }
  }

  // fetchMatchPrediction();

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

  return (
    <PageContainer title="Custom Match" description="Get the odds for the matchup that didn't happen during the tournament">
      <DashboardCard>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            {/* Home */}
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" marginRight={2}>
              <Avatar alt="?" src={`https://flagcdn.com/w640/${countryCodes[home]}.png`} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
              <TextField id="filled-select-country" select defaultValue={home} variant="filled" onChange={(event) => setHome(event.target.value)}
                sx={{ '& .MuiInputBase-input': { fontSize: '1.5rem', fontWeight: 'bold' } }}>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginX: 4 }}>
              <Box display="flex" flexDirection="column" alignItems="center" sx={{ mr: 2 }}>
                {loading ? <CircularProgress /> : <Typography variant="h1" component="span">{homeScore}</Typography>}
              </Box>
              <Typography variant="h4" component="span" sx={{ mx: 2 }}>-</Typography>
              <Box display="flex" flexDirection="column" alignItems="center" sx={{ ml: 2 }}>
                {loading ? <CircularProgress /> : <Typography variant="h1" component="span">{awayScore}</Typography>}
              </Box>
            </Box>
            {/* Away */}
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" marginLeft={2}>
              <Avatar alt="?" src={`https://flagcdn.com/w640/${countryCodes[away]}.png`} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
              <TextField id="filled-select-country" select defaultValue={away} variant="filled" onChange={(event) => setAway(event.target.value)}
                sx={{ '& .MuiInputBase-input': { fontSize: '1.5rem', fontWeight: 'bold' } }}>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <FormControlLabel
              control={<Switch checked={allowDraw} onChange={(event) => setAllowDraw(event.target.checked)} />}
              label="Allow Draw"
              sx={{ marginTop: 2, '& .MuiFormControlLabel-label': { fontSize: '1.25rem', fontWeight: 'bold' } }}
            />
          </Box>
          <Box mt={5} sx={{ width: '100%', bgcolor: 'grey.300', borderRadius: '10px', height: '24px', display: 'flex' }}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: '6px 0 0 6px', width: `${predictions[0]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="white">{predictions[0]}%</Typography>
            </Box>
            {predictions[2] > 0 && (
              <Box sx={{ bgcolor: 'grey.300', width: `${predictions[2]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6">{predictions[2]}%</Typography>
              </Box>
            )}
            <Box sx={{ bgcolor: 'secondary.main', borderRadius: '0 6px 6px 0', width: `${predictions[1]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6">{predictions[1]}%</Typography>
            </Box>
          </Box>
          <Box mt={3} display="flex" justifyContent="center" width="100%">
            <Button variant="contained" onClick={fetchMatchPrediction} disableElevation color="primary" size="large">
              Predict
            </Button>
          </Box>
        </CardContent>
      </DashboardCard>
    </PageContainer>
  );
};

export default CustomPage;
