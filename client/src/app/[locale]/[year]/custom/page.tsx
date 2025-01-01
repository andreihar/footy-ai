'use client';
import { Avatar, Box, CardContent, Typography, TextField, MenuItem, FormControlLabel, Switch, CircularProgress, Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DashboardCard from '@/components/shared/DashboardCard';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCountries } from '@/utils/yearUtils';
import { useTranslations } from 'next-intl';
import fetchMatch from '@/utils/fetchMatch';

export default function CustomPage({ params: { year } }: { params: { year: string; }; }) {
  const { getFlag, getUefaCountries, getHistoricalName } = useCountries(Number(year));
  const countries = getUefaCountries().map(country => ({ country, name: getHistoricalName(country) }));
  const t = useTranslations('Custom');
  const searchParams = useSearchParams();
  const [preds, setPreds] = useState([0, 0, 0]);
  const [home, setHome] = useState(countries.find(c => c.country === 'England') || null);
  const [away, setAway] = useState(countries.find(c => c.country === 'France') || null);
  const [allowDraw, setAllowDraw] = useState(true);
  const [homeScore, setHomeScore] = useState(1);
  const [awayScore, setAwayScore] = useState(2);
  const [loading, setLoading] = useState(false);
  const [homeInputValue, setHomeInputValue] = useState('');
  const [awayInputValue, setAwayInputValue] = useState('');

  const fetchMatchPrediction = useCallback(async () => {
    if (!home || !away) {
      console.error('Home or away team is not selected');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await fetchMatch(home.country, away.country, allowDraw, Number(year));
      if (result) {
        setPreds(result.preds);
        setHomeScore(result.scorePred[0]);
        setAwayScore(result.scorePred[1]);
      }
      setLoading(false);
      const params = new URLSearchParams(searchParams);
      params.set('home', home.country);
      params.set('away', away.country);
      params.set('draw', String(allowDraw));
      window.history.pushState(null, '', `?${params.toString()}`);
    } catch (error) {
      setLoading(false);
      console.error('Failed to fetch match prediction:', error);
    }
  }, [home, away, allowDraw, year]);

  useEffect(() => {
    fetchMatchPrediction();
  }, [home, away, allowDraw, fetchMatchPrediction]);

  useEffect(() => {
    const homeParam = searchParams.get('home');
    const awayParam = searchParams.get('away');
    const drawParam = searchParams.get('draw');
    if (homeParam && awayParam) {
      setHome(countries.find(c => c.country === homeParam) || null);
      setAway(countries.find(c => c.country === awayParam) || null);
      setAllowDraw(drawParam === 'true');
    }
  }, [searchParams]);

  return (
    (<DashboardCard>
      <CardContent>
        <Grid container spacing={2}>
          {/* Home */}
          <Grid size={{ xs: 12, sm: 4 }} display="flex" flexDirection="column" alignItems="center" textAlign="center">
            {home && (
              <Avatar alt="?" src={getFlag(home.country, true)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
            )}
            <Autocomplete id="filled-select-home" options={countries.filter(country => country.country !== away?.country)} getOptionLabel={(option) => option.name} value={home} onChange={(_, newValue) => setHome(newValue)} inputValue={homeInputValue} onInputChange={(_, newInputValue) => setHomeInputValue(newInputValue)} isOptionEqualToValue={(option, value) => option.country === value.country} renderInput={(params) => (
              <>
                {/* eslint-disable-next-line */}
                {/* @ts-ignore */}
                <TextField {...params} variant="standard" sx={{ width: '250px', '& .MuiInputBase-root': { paddingRight: '0 !important' } }}
                  slotProps={{
                    htmlInput: { ...params.inputProps, "aria-label": "Select Home Country", style: { fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Header' } as React.CSSProperties, }
                  }}
                />
              </>
            )} renderOption={(props, option) => (
              <MenuItem {...props} key={option.country} value={option.country} sx={{ whiteSpace: 'nowrap' }}>{option.name}</MenuItem>
            )} />
          </Grid>

          {/* Score */}
          <Grid size={{ xs: 12, sm: 4 }} display="flex" justifyContent="center" alignItems="center">
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mr: 2 }}>
              {loading ? <CircularProgress /> : <Typography variant="h1" component="span">{homeScore}</Typography>}
            </Box>
            <Typography variant="h4" component="span" sx={{ mx: 2 }}>-</Typography>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ ml: 2 }}>
              {loading ? <CircularProgress /> : <Typography variant="h1" component="span">{awayScore}</Typography>}
            </Box>
          </Grid>

          {/* Away */}
          <Grid size={{ xs: 12, sm: 4 }} display="flex" flexDirection="column" alignItems="center" textAlign="center">
            {away && (
              <Avatar alt="?" src={getFlag(away.country, true)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
            )}
            <Autocomplete id="filled-select-away" options={countries.filter(country => country.country !== home?.country)} getOptionLabel={(option) => option.name} value={away} onChange={(_, newValue) => setAway(newValue)} inputValue={awayInputValue} onInputChange={(_, newInputValue) => setAwayInputValue(newInputValue)} isOptionEqualToValue={(option, value) => option.country === value.country} renderInput={(params) => (
              <>
                {/* eslint-disable-next-line */}
                {/* @ts-ignore */}
                <TextField {...params} variant="standard" sx={{ width: '250px', '& .MuiInputBase-root': { paddingRight: '0 !important' } }}
                  slotProps={{
                    htmlInput: { ...params.inputProps, "aria-label": "Select Away Country", style: { fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Header' } as React.CSSProperties, }
                  }}
                />
              </>
            )} renderOption={(props, option) => (
              <MenuItem {...props} key={option.country} value={option.country} sx={{ whiteSpace: 'nowrap' }}>{option.name}</MenuItem>
            )} />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" alignItems="center">
          <FormControlLabel control={<Switch checked={allowDraw} onChange={(event) => setAllowDraw(event.target.checked)} />} label={t('draw')} sx={{ marginTop: 2, '& .MuiFormControlLabel-label': { fontSize: '1.25rem', fontWeight: 'bold' } }} />
        </Box>
        <Box mt={5} sx={{ width: '100%', bgcolor: 'grey.300', borderRadius: '10px', height: '24px', display: 'flex' }}>
          <Box sx={{ bgcolor: 'primary.main', borderRadius: '6px 0 0 6px', width: `${preds[0]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="white">{preds[0]}%</Typography>
          </Box>
          {preds[2] > 0 && (
            <Box sx={{ bgcolor: 'grey.300', width: `${preds[2]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6">{preds[2]}%</Typography>
            </Box>
          )}
          <Box sx={{ bgcolor: 'secondary.main', borderRadius: '0 6px 6px 0', width: `${preds[1]}%`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6">{preds[1]}%</Typography>
          </Box>
        </Box>
      </CardContent>
    </DashboardCard >)
  );
}
