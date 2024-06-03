
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowDownRight, IconArrowUpLeft, IconPercentage } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import Preds from '../../types/preds';
import euro2024 from '../../../../public/data/euro2024.json';
import euro2024predsJson from '../../../../public/data/euro2024preds.json';
const euro2024preds: Preds = euro2024predsJson;
import DashboardCard from '@/app/components/shared/DashboardCard';

interface DailyStat {
  correct: number;
  incorrect: number;
}

const DailyPredictions = () => {
  const theme = useTheme();
  const secondarylight = '#f5fcff';
  const [dailyPercentages, setDailyPercentages] = useState<{ date: string; percentage: number; }[]>([]);

  useEffect(() => {
    const allMatches = [...euro2024.groupStage, ...euro2024.knockoutStage]
      .flatMap(stage => stage.matches
        .flatMap(match => {
          if (match.score.home === null || match.score.away === null) return [];
          const predictionKey = `${match.teams.home}_${match.teams.away}_${stage.round.startsWith("Group") ? "1" : "0"}`;
          const predictions = euro2024preds[predictionKey] ? euro2024preds[predictionKey].predictions : [0, 0, 0];
          const scorePrediction = euro2024preds[predictionKey] ? euro2024preds[predictionKey].scorePrediction : [0, 0];
          const date = new Date(match.date);
          const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
          return [{ ...match, stage: stage.round, predictions, scorePrediction, date: formattedDate }];
        }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dailyStats: Record<string, DailyStat> = {};

    allMatches.forEach(match => {
      const homeScore = match.score.home as number;
      const awayScore = match.score.away as number;

      const outcomes = ["home", "away", "draw"];
      const actualOutcome = homeScore > awayScore ? "home" :
        homeScore < awayScore ? "away" : "draw";

      if (!dailyStats[match.date]) {
        dailyStats[match.date] = { correct: 0, incorrect: 0 };
      }

      if (outcomes[match.predictions.indexOf(Math.max(...match.predictions))] === actualOutcome) {
        dailyStats[match.date].correct++;
      } else {
        dailyStats[match.date].incorrect++;
      }
    });

    const dailyPercentages = Object.keys(dailyStats).map(date => {
      const { correct, incorrect } = dailyStats[date];
      const percentage = Number(((correct / (correct + incorrect)) * 100).toFixed(2));
      return { date, percentage };
    }).sort((a, b) => {
      const [dayA, monthA] = a.date.split('/').map(Number);
      const [dayB, monthB] = b.date.split('/').map(Number);
      return monthA - monthB || dayA - dayB;
    });
    setDailyPercentages(dailyPercentages);
  }, []);

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    xaxis: {
      categories: dailyPercentages.map(item => item.date),
    },
  };
  const seriescolumnchart: any = [
    {
      name: '',
      color: theme.palette.secondary.main,
      data: dailyPercentages.map(item => item.percentage),
    },
  ];

  return (
    <DashboardCard
      title="Daily Predictions"
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
          <IconPercentage width={24} />
        </Fab>
      }
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height={73} width={"100%"} />
      }
    >
      <>
        {dailyPercentages.length >= 2 && (
          <>
            <Typography variant="h3" fontWeight="700" mt="-20px">
              {dailyPercentages[dailyPercentages.length - 1].percentage}%
            </Typography>
            <Stack direction="row" spacing={1} my={1} alignItems="center">
              {(() => {
                const latestPercentage = dailyPercentages[dailyPercentages.length - 1].percentage;
                const previousPercentage = dailyPercentages[dailyPercentages.length - 2].percentage;
                const percentageChange = latestPercentage - previousPercentage;

                return (
                  <>
                    {percentageChange >= 0 ? (
                      <Avatar sx={{ bgcolor: theme.palette.success.light, width: 27, height: 27 }}>
                        <IconArrowUpLeft width={20} color="#39B69A" />
                      </Avatar>
                    ) : (
                      <Avatar sx={{ bgcolor: theme.palette.error.light, width: 27, height: 27 }}>
                        <IconArrowDownRight width={20} color="#FA896B" />
                      </Avatar>
                    )}
                    <Typography variant="subtitle2" fontWeight="600">
                      {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      from the day before
                    </Typography>
                  </>
                );
              })()}
            </Stack>
          </>
        )}
      </>
    </DashboardCard>
  );
};

export default DailyPredictions;
