
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { useStats } from '../../../utils/StatsContext';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft, IconArrowDownRight } from '@tabler/icons-react';
import Preds from '../../types/preds';
import euro2024 from '../../../../public/data/euro2024.json';
import euro2024predsJson from '../../../../public/data/euro2024preds.json';
import DashboardCard from '@/app/components/shared/DashboardCard';
import { useEffect, useState } from "react";
const euro2024preds: Preds = euro2024predsJson;

const OverallStatistics = () => {
  const theme = useTheme();
  const { correctPredictionsPerDay, incorrectPredictionsPerDay } = useStats();

  const correctPrev = Number((100 * correctPredictionsPerDay.slice(0, -1).reduce((a, c) => a + c, 0) / (correctPredictionsPerDay.slice(0, -1).concat(incorrectPredictionsPerDay.slice(0, -1)).reduce((a, c) => a + c, 0))).toFixed(2));
  const correct = Number((100 * correctPredictionsPerDay.reduce((a, c) => a + c, 0) / (correctPredictionsPerDay.concat(incorrectPredictionsPerDay).reduce((a, c) => a + c, 0))).toFixed(2));


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
    colors: [theme.palette.primary.main, theme.palette.primary.light],
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
              (correct - correctPrev) >= 0 ? (
                <Avatar sx={{ bgcolor: theme.palette.success.light, width: 27, height: 27 }}>
                  <IconArrowUpLeft width={20} color="#39B69A" />
                </Avatar>
              ) : (
                <Avatar sx={{ bgcolor: '#fdede8', width: 27, height: 27 }}>
                  <IconArrowDownRight width={20} color="#FA896B" />
                </Avatar>
              )
            }
            <Typography variant="subtitle2" fontWeight="600">{(correct - correctPrev).toFixed(2)}%</Typography>
            <Typography variant="subtitle2" color="textSecondary">from the day before</Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: theme.palette.primary.main, svg: { display: 'none' } }}></Avatar>
              <Typography variant="subtitle2" color="textSecondary">Correct</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: theme.palette.primary.light, svg: { display: 'none' } }}></Avatar>
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

export default OverallStatistics;
