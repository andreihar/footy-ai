'use client';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { useTranslations } from "next-intl";
import { Stack, Typography, Avatar } from '@mui/material';
import { IconArrowDownRight, IconArrowUpLeft, IconPercentage } from '@tabler/icons-react';
import DashboardCard from '@/components/shared/DashboardCard';

interface DailyPredictionsProps {
  categories: string[];
  dailyPercentages: number[];
}

const DailyPredictions: React.FC<DailyPredictionsProps> = ({ categories, dailyPercentages }) => {
  const theme = useTheme();
  const t = useTranslations();

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 60,
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'solid', opacity: 0.05 },
    markers: { size: 0 },
    tooltip: { theme: theme.palette.mode === 'dark' ? 'dark' : 'light' },
    xaxis: { categories },
  };
  const seriescolumnchart: any = [
    {
      name: '',
      color: theme.palette.secondary.main,
      data: dailyPercentages,
    },
  ];

  return (
    <DashboardCard
      title={t('DailyPredictions.title')}
      action={
        <Avatar sx={{ height: 48, width: 48, bgcolor: theme.palette.secondary.main, boxShadow: 6 }} >
          <IconPercentage width={24} />
        </Avatar>
      }
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height={73} width={"100%"} />
      }
    >
      <>
        {dailyPercentages.length >= 2 && (
          <>
            <Typography variant="h3" fontWeight="700" mt="-20px">
              {dailyPercentages[dailyPercentages.length - 1]}%
            </Typography>
            <Stack direction="row" spacing={1} my={1} alignItems="center">
              {(() => {
                const percentageChange = dailyPercentages[dailyPercentages.length - 1] - dailyPercentages[dailyPercentages.length - 2];

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
                    <Typography variant="subtitle2" color="textSecondary">{t('OverallStatistics.before')}</Typography>
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
