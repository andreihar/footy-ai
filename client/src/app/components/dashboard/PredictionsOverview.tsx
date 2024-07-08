import { useTheme } from '@mui/material/styles';
import { useStats } from '../../../utils/StatsContext';
import DashboardCard from '@/app/components/shared/DashboardCard';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PredictionsOverview = () => {
    const theme = useTheme();
    const { categories, correctPredictionsPerDay, incorrectPredictionsPerDay } = useStats();

    // chart
    const optionscolumnchart: any = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: { show: true },
            height: 370,
        },
        colors: [theme.palette.primary.main, theme.palette.error.main],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: { show: true, width: 5, lineCap: "butt", colors: ["transparent"] },
        dataLabels: { enabled: false },
        legend: { show: false },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: { show: false },
            },
        },
        yaxis: { tickAmount: 4 },
        xaxis: {
            categories,
            axisBorder: { show: false },
        },
        tooltip: { theme: 'dark', fillSeriesColor: false },
    };
    const seriescolumnchart: any = [
        { name: 'Predicted correct this day', data: correctPredictionsPerDay },
        { name: 'Predicted incorrect this day', data: incorrectPredictionsPerDay }
    ];

    return (

        <DashboardCard title="Predictions Overview">
            <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height={370} width={"100%"}
            />
        </DashboardCard>
    );
};

export default PredictionsOverview;
