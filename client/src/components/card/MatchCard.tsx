import { Avatar, Box, Button, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import DashboardCard from '@/components/shared/DashboardCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import useCountryFlags from '@/utils/countryUtils';
import { useTranslations } from 'next-intl';
import Match from '@/types/match';

interface MatchCardProps extends Match {
  year: number;
  locale: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ home_team, away_team, home_score_total, away_score_total, date, stage, stadium, city, predictions, scorePrediction, year, locale }) => {
  const { getFlag, getHistoricalName } = useCountryFlags(year);
  const t = useTranslations();

  const predictedOutcome = ["home", "away", "draw"][predictions.indexOf(Math.max(...predictions))] || "";

  let correctOutcome = "unknown";
  let correctScore = "unknown";
  if (!isNaN(home_score_total) && !isNaN(away_score_total)) {
    const actualOutcome = home_score_total > away_score_total ? "home"
      : home_score_total < away_score_total ? "away" : "draw";
    correctOutcome = predictedOutcome === actualOutcome ? "correct" : "incorrect";
    correctScore = (scorePrediction[0] === home_score_total && scorePrediction[1] === away_score_total) ? "correct" : "incorrect";
  }

  return (
    <DashboardCard>
      <CardContent>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mb={2}>
          <Typography variant="h6">
            {new Date(date).toLocaleString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            &nbsp; • &nbsp;
            {new Date(date).toLocaleString(locale, { hour: 'numeric', minute: 'numeric' })}
          </Typography>
          <Typography variant="h5" mt={2} >{
            stage.startsWith('Group')
              ? `${t(`matches.Group`)} ${stage.split(" ")[1]}`
              : t(`matches.${stage}` as any)
          }</Typography>
          <Typography sx={{ textTransform: "uppercase" }} mt={2}>{stadium}, {city}</Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            {/* Home */}
            <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Avatar alt="?" src={getFlag(home_team, true)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
              <Typography variant="h3">{getHistoricalName(home_team)}</Typography>
            </Grid>

            {/* Score */}
            <Grid item xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
              <Box display="flex" flexDirection="column" alignItems="center" sx={{ mr: 2 }}>
                <Typography variant="h1" component="span">{scorePrediction[0]}</Typography>
                <Typography variant="body1" component="span">({home_score_total})</Typography>
              </Box>
              <Typography variant="h4" component="span" sx={{ mx: 2 }}>-</Typography>
              <Box display="flex" flexDirection="column" alignItems="center" sx={{ ml: 2 }}>
                <Typography variant="h1" component="span">{scorePrediction[1]}</Typography>
                <Typography variant="body1" component="span">({away_score_total})</Typography>
              </Box>
            </Grid>

            {/* Away */}
            <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Avatar alt="?" src={getFlag(away_team, true)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
              <Typography variant="h3">{getHistoricalName(away_team)}</Typography>
            </Grid>
          </Grid>
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
          <Accordion disableGutters elevation={0} sx={{ width: '100%' }}>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ justifyContent: 'center', display: 'flex', width: '100%' }}
            >
              <Button variant="contained" color="primary" component="div" sx={{ mx: 'auto' }}>
                {t('groupPerformance.results')}
              </Button>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                <Box display="flex" mb={2}>
                  {correctOutcome === "correct" && <CheckCircleIcon color="success" />}
                  {correctOutcome === "incorrect" && <CancelIcon color="error" />}
                  {correctOutcome === "unknown" && <HelpIcon sx={{ color: 'gray' }} />}
                  <Typography ml={1}>{t('matches.outcome')}</Typography>
                </Box>
                <Box display="flex">
                  {correctScore === "correct" && <CheckCircleIcon color="success" />}
                  {correctScore === "incorrect" && <CancelIcon color="error" />}
                  {correctScore === "unknown" && <HelpIcon sx={{ color: 'gray' }} />}
                  <Typography ml={1}>{t('matches.score')}</Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
    </DashboardCard >
  );
};

export default MatchCard;
