'use client';
import { Avatar, Box, Button, CardContent, Typography, TextField, MenuItem, FormControlLabel, Switch, CircularProgress, Grid } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import DashboardCard from '@/components/shared/DashboardCard';
import { useState } from 'react';
import { useStats } from '@/utils/StatsContext';
import useCountryFlags from '@/utils/countryUtils';
import { useTranslations } from 'next-intl';

const CustomPage = () => {
  const { getFlag, getUefaCountries, getHistoricalName } = useCountryFlags();
  const countries = getUefaCountries();
  const { fetchMatch } = useStats();
  const t = useTranslations();
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
      const result = await fetchMatch(home, away, allowDraw);
      if (result) {
        setPredictions(result.predictions);
        setHomeScore(result.scorePrediction[0]);
        setAwayScore(result.scorePrediction[1]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Failed to fetch match prediction:', error);
    }
  }

  return (
    <PageContainer title={t('header.custom')} description="Get the odds for the matchup that didn't happen during the tournament">
      <DashboardCard>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Grid container justifyContent="center" alignItems="center" spacing={2}>
              {/* Home */}
              <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Avatar alt="?" src={getFlag(home, true)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
                <TextField id="filled-select-country" select defaultValue={home} variant="filled" onChange={(event) => setHome(event.target.value)}
                  sx={{ '& .MuiInputBase-input': { fontSize: '1.5rem', fontWeight: 'bold' } }}>
                  {countries
                    .map(country => ({ country, name: getHistoricalName(country) }))
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .filter(({ country }) => country !== away)
                    .map(({ country, name }) => (
                      <MenuItem key={country} value={country}>{name}</MenuItem>
                    ))}
                </TextField>
              </Grid>

              {/* Score */}
              <Grid item xs={12} sm={4} display="flex" justifyContent="center" alignItems="center">
                <Box display="flex" flexDirection="column" alignItems="center" sx={{ mr: 2 }}>
                  {loading ? <CircularProgress /> : <Typography variant="h1" component="span">{homeScore}</Typography>}
                </Box>
                <Typography variant="h4" component="span" sx={{ mx: 2 }}>-</Typography>
                <Box display="flex" flexDirection="column" alignItems="center" sx={{ ml: 2 }}>
                  {loading ? <CircularProgress /> : <Typography variant="h1" component="span">{awayScore}</Typography>}
                </Box>
              </Grid>

              {/* Away */}
              <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Avatar alt="?" src={getFlag(away, true)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
                <TextField id="filled-select-country" select defaultValue={away} variant="filled" onChange={(event) => setAway(event.target.value)}
                  sx={{ '& .MuiInputBase-input': { fontSize: '1.5rem', fontWeight: 'bold' } }}>
                  {countries
                    .map(country => ({ country, name: getHistoricalName(country) }))
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .filter(({ country }) => country !== home)
                    .map(({ country, name }) => (
                      <MenuItem key={country} value={country}>{name}</MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <FormControlLabel
              control={<Switch checked={allowDraw} onChange={(event) => setAllowDraw(event.target.checked)} />}
              label={t('custom.draw')}
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
              {t('custom.predict')}
            </Button>
          </Box>
        </CardContent>
      </DashboardCard>
    </PageContainer>
  );
};

export default CustomPage;
