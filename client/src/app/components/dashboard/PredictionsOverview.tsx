import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/components/shared/DashboardCard';
import dynamic from "next/dynamic";
import Match from '../../types/match';
import Preds from '../../types/preds';
import euro2024 from '../../../../public/data/euro2024.json';
import euro2024predsJson from '../../../../public/data/euro2024preds.json';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const euro2024preds: Preds = euro2024predsJson;

const PredictionsOverview = () => {

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.error.main;

    const [categories, setCategories] = useState<string[]>([]);
    const [correct, setCorrect] = useState<number[]>();
    const [incorrect, setIncorrect] = useState<number[]>();

    useEffect(() => {
        const allMatches = [...euro2024.groupStage, ...euro2024.knockoutStage]
            .flatMap(stage => stage.matches
                .filter(match => match.score.home !== null && match.score.away !== null)
                .map(match => {
                    const predictionKey = `${match.teams.home}_${match.teams.away}_${stage.round.startsWith("Group") ? "1" : "0"}`;
                    const predictions = euro2024preds[predictionKey] ? euro2024preds[predictionKey].predictions : [0, 0, 0];
                    const scorePrediction = euro2024preds[predictionKey] ? euro2024preds[predictionKey].scorePrediction : [0, 0];
                    const date = new Date(match.date);
                    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                    return { ...match, stage: stage.round, predictions, scorePrediction, date: formattedDate };
                }))
            .sort((a, b) => {
                const [dayA, monthA] = a.date.split('/').map(Number);
                const [dayB, monthB] = b.date.split('/').map(Number);
                return monthA - monthB || dayA - dayB;
            });
        const formattedDates = Array.from(new Set(allMatches.map(match => match.date)));
        setCategories(formattedDates);
        const correctPredictionsPerDay = new Array(formattedDates.length).fill(0);
        const incorrectPredictionsPerDay = new Array(formattedDates.length).fill(0);

        allMatches.forEach(match => {
            if (match.score.home === null || match.score.away === null) {
                return;
            }

            const predictedOutcomeIndex = match.predictions.indexOf(Math.max(...match.predictions));
            let predictedOutcome = "";
            if (predictedOutcomeIndex === 0) predictedOutcome = "home";
            else if (predictedOutcomeIndex === 1) predictedOutcome = "away";
            else if (predictedOutcomeIndex === 2) predictedOutcome = "draw";

            let actualOutcome = "";
            if (match.score.home > match.score.away) actualOutcome = "home";
            else if (match.score.home < match.score.away) actualOutcome = "away";
            else if (match.score.home === match.score.away) actualOutcome = "draw";

            if (predictedOutcome === actualOutcome) {
                correctPredictionsPerDay[formattedDates.indexOf(match.date)]++;
            } else {
                incorrectPredictionsPerDay[formattedDates.indexOf(match.date)]++;
            }
            setCorrect(correctPredictionsPerDay);
            setIncorrect(incorrectPredictionsPerDay);
        });
    }, []);

    // chart
    const optionscolumnchart: any = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary, secondary],
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

        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            categories,
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: 'dark',
            fillSeriesColor: false,
        },
    };
    const seriescolumnchart: any = [
        {
            name: 'Predicted correct this day',
            data: correct,
        },
        {
            name: 'Predicted incorrect this day',
            data: incorrect,
        },
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
