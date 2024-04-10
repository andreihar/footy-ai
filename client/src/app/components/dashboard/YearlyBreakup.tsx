
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft, IconArrowDownRight } from '@tabler/icons-react';
import Preds from '../../types/preds';
import euro2024 from '../../../../public/data/euro2024.json';
import euro2024predsJson from '../../../../public/data/euro2024preds.json';
import DashboardCard from '@/app/components/shared/DashboardCard';
import { useEffect, useState } from "react";
const euro2024preds: Preds = euro2024predsJson;

const YearlyBreakup = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const [correct, setCorrect] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);

  useEffect(() => {
    const allMatches = [...euro2024.groupStage, ...euro2024.knockoutStage]
      .flatMap(stage => stage.matches.map(match => {
        const predictionKey = `${match.teams.home}_${match.teams.away}_${stage.round.startsWith("Group") ? "1" : "0"}`;
        const predictions = euro2024preds[predictionKey] ? euro2024preds[predictionKey].predictions : [0, 0, 0];
        const scorePrediction = euro2024preds[predictionKey] ? euro2024preds[predictionKey].scorePrediction : [0, 0];
        return { ...match, stage: stage.round, predictions, scorePrediction };
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let incorrectPredictions = 0;
    let correctPredictions = 0;
    let prevDayCorrect = 0;
    let prevDayIncorrect = 0;

    allMatches.forEach(match => {
      if (match.score.home === null || match.score.away === null) {
        return;
      }

      const predictedOutcomeIndex = match.predictions.indexOf(Math.max(...match.predictions));
      const outcomes = ["home", "away", "draw"];
      const predictedOutcome = outcomes[predictedOutcomeIndex];
      const actualOutcome = match.score.home > match.score.away ? "home" :
        match.score.home < match.score.away ? "away" : "draw";

      if (new Date(match.date).getTime() < new Date(allMatches[allMatches.length - 1].date).getTime()) {
        if (predictedOutcome === actualOutcome) {
          prevDayCorrect++;
        } else {
          prevDayIncorrect++;
        }
      }
      if (predictedOutcome === actualOutcome) {
        correctPredictions++;
      } else {
        incorrectPredictions++;
      }
    });
    const prevDayPercentage = Number(((prevDayCorrect / (prevDayCorrect + prevDayIncorrect)) * 100).toFixed(2));
    const lastDayPercentage = Number(((correctPredictions / (correctPredictions + incorrectPredictions)) * 100).toFixed(2));
    setCorrect(lastDayPercentage);
    setPercentageChange(Number((lastDayPercentage - prevDayPercentage).toFixed(2)));
  }, []);


  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
    labels: ['Correct', 'Incorrect'],
  };
  const seriescolumnchart: any = [correct, 100 - correct];

  return (
    <DashboardCard title="Overall Statistics">
      <Grid container spacing={3}>
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">{correct}%</Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            {
              percentageChange >= 0 ? (
                <Avatar sx={{ bgcolor: theme.palette.success.light, width: 27, height: 27 }}>
                  <IconArrowUpLeft width={20} color="#39B69A" />
                </Avatar>
              ) : (
                <Avatar sx={{ bgcolor: '#fdede8', width: 27, height: 27 }}>
                  <IconArrowDownRight width={20} color="#FA896B" />
                </Avatar>
              )
            }
            <Typography variant="subtitle2" fontWeight="600">{percentageChange}%</Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}></Avatar>
              <Typography variant="subtitle2" color="textSecondary">Correct</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: primarylight, svg: { display: 'none' } }}></Avatar>
              <Typography variant="subtitle2" color="textSecondary">Incorrect</Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart options={optionscolumnchart} series={seriescolumnchart} type="donut" height={150} width={"100%"} />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
