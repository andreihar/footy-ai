import { Avatar, Box, Button, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DashboardCard from '@/components/shared/DashboardCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import useYear from '@/utils/yearUtils';
import { useTranslations } from 'next-intl';
import Time from '@/layout/Time';
import Match from '@/types/match';

interface MatchCardProps extends Match {
  year: number;
  locale: string;
}

const OutcomeDisplay: React.FC<{ outcome: string, label: string; }> = ({ outcome, label }) => {
  return (
    <Box display="flex" mb={2}>
      {outcome === "correct" && <CheckCircleIcon color="success" />}
      {outcome === "incorrect" && <CancelIcon color="error" />}
      {outcome === "unknown" && <HelpIcon sx={{ color: 'gray' }} />}
      <Typography ml={1} align="center">{label}</Typography>
    </Box>
  );
};

const MatchCard: React.FC<MatchCardProps> = ({ home_team, away_team, home_score_total, away_score_total, date, stage, stadium, city, preds, scorePred, year, locale }) => {
  const { getFlag, getHistoricalName } = useYear(year);
  const t = useTranslations();

  const predictedOutcome = ["home", "away", "draw"][preds.indexOf(Math.max(...preds))] || "";

  let [correctOutcome, correctScore] = ["unknown", "unknown"];
  if (!isNaN(home_score_total) && !isNaN(away_score_total)) {
    const actualOutcome = home_score_total > away_score_total ? "home"
      : home_score_total < away_score_total ? "away" : "draw";
    correctOutcome = predictedOutcome === actualOutcome ? "correct" : "incorrect";
    correctScore = (scorePred[0] === home_score_total && scorePred[1] === away_score_total) ? "correct" : "incorrect";
  }

  return (
    <DashboardCard>
      <CardContent>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mb={2}>
          <Time date={date} locale={locale} />
          <Typography variant="h5" align="center" mt={2} >{
            stage.startsWith('Group') ? `${t(`Knockout.Group`)} ${stage.split(" ")[1]}` : t(`Knockout.${stage}` as any)
          }</Typography>
          <Typography sx={{ textTransform: "uppercase" }} align="center" mt={2}>{stadium}, {city}</Typography>
        </Box>
        <Grid container spacing={2}>
          {/* Home */}
          <Grid size={{ xs: 12, md: 4 }} display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Avatar alt="?" src={getFlag(home_team, true)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
            <Typography variant="h3" align="center">{getHistoricalName(home_team)}</Typography>
          </Grid>

          {/* Score */}
          <Grid size={{ xs: 12, md: 4 }} display="flex" justifyContent="center" alignItems="center">
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mr: 2 }}>
              <Typography variant="h1" component="span">{scorePred[0]}</Typography>
              <Typography variant="body1" component="span">({home_score_total})</Typography>
            </Box>
            <Typography variant="h4" component="span" sx={{ mx: 2 }}>-</Typography>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ ml: 2 }}>
              <Typography variant="h1" component="span">{scorePred[1]}</Typography>
              <Typography variant="body1" component="span">({away_score_total})</Typography>
            </Box>
          </Grid>

          {/* Away */}
          <Grid size={{ xs: 12, md: 4 }} display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Avatar alt="?" src={getFlag(away_team, true)} sx={{ width: 80, height: 80, marginBottom: 1, border: '0.5px solid lightgray' }} />
            <Typography variant="h3" align="center">{getHistoricalName(away_team)}</Typography>
          </Grid>
        </Grid>
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
        <Box mt={3} display="flex" justifyContent="center" width="100%">
          <Accordion disableGutters elevation={0} sx={{ width: '100%' }}>
            <AccordionSummary aria-controls="panel1a-content" id="panel1a-header"
              sx={{ justifyContent: 'center', display: 'flex', width: '100%', pointerEvents: 'none' }}
            >
              <Box sx={{ pointerEvents: 'auto', mx: 'auto' }}>
                <Button variant="contained" color="primary" component="div">
                  {t('Group.results')}
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                <OutcomeDisplay outcome={correctOutcome} label={t('Knockout.outcome')} />
                <OutcomeDisplay outcome={correctScore} label={t('Knockout.score')} />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
    </DashboardCard >
  );
};

export default MatchCard;
