'use client';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { Stack, Typography, Avatar, Grid } from '@mui/material';
import { IconArrowUpLeft, IconArrowDownRight } from '@tabler/icons-react';
import DashboardCard from '@/components/shared/DashboardCard';

interface OverallStatisticsProps {
  correctPrev: number;
  correct: number;
}

const OverallStatistics: React.FC<OverallStatisticsProps> = ({ correctPrev, correct }) => {
  const theme = useTheme();
  const t = useTranslations();

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 155,
    },
    colors: [theme.palette.primary.main, theme.palette.primary.light],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: { size: '75%', background: 'transparent' },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: { width: 120 },
        },
      },
    ],
    labels: [t('recentPredictions.correct'), t('recentPredictions.incorrect')],
  };

  return (
    <DashboardCard title={t('overallStatistics.title')}>
      <Grid container spacing={3}>
        <Grid item xs={7}>
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
            <Typography variant="subtitle2" color="textSecondary">{t('overallStatistics.before')}</Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: theme.palette.primary.main, svg: { display: 'none' } }}></Avatar>
              <Typography variant="subtitle2" color="textSecondary" textTransform="capitalize">{t('recentPredictions.correct')}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: theme.palette.primary.light, svg: { display: 'none' } }}></Avatar>
              <Typography variant="subtitle2" color="textSecondary" textTransform="capitalize">{t('recentPredictions.incorrect')}</Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={5}>
          <Chart options={optionscolumnchart} series={[correct, 100 - correct]} type="donut" height={150} width={"100%"} />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default OverallStatistics;
