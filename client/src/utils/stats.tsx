import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import Match from '@/types/match';

interface ReturnTypes {
  data: Match[];
  categories: string[];
  groups: string[];
  correctPredictionsPerDay: number[];
  incorrectPredictionsPerDay: number[];
  perfectScores: number;
  correctGroups: number;
  matchesPlayedGroups: number;
  correctKnockouts: number;
  matchesPlayedKnockouts: number;
}

interface DataRow {
  home_team: string;
  away_team: string;
  home_score: string;
  away_score: string;
  home_penalty: string;
  away_penalty: string;
  home_score_total: string;
  away_score_total: string;
  date: string;
  stage: string;
  stadium: string;
  city: string;
}

type PredictionResult = {
  scorePrediction: number[];
  predictions: number[];
} | null;

export async function getStats(year: number): Promise<ReturnTypes> {
  const predictionsFilePath = path.join(process.cwd(), 'public', 'data', 'predictions', `${year}.csv`);
  const matchesFilePath = path.join(process.cwd(), 'public', 'data', 'matches', `${year}.csv`);

  const predictionsCsvText = await fs.readFile(predictionsFilePath, 'utf-8');
  let predictionsData: any[] = [];
  Papa.parse(predictionsCsvText, {
    header: true,
    complete: (result) => {
      predictionsData = result.data;
    }
  });

  const matchesCsvText = await fs.readFile(matchesFilePath, 'utf-8');
  let data: Match[] = [];
  Papa.parse(matchesCsvText, {
    header: true,
    complete: (result) => {
      const dataRows = (result.data as DataRow[]).filter((row: DataRow) => row.date);
      const modifiedData: Match[] = [];

      for (const row of dataRows) {
        const toInt = (value: string | undefined | null): number => {
          if (value === undefined || value === null) return NaN;
          return parseInt(value, 10);
        };
        const homeTeamRow = predictionsData.find(predictionRow => predictionRow.home_team === row.home_team);
        let predictionResult: PredictionResult = null;
        if (homeTeamRow) {
          const predictionKey = `${row.away_team}_${row.stage.startsWith("Group") ? '1' : '0'}`;
          const predictionString = homeTeamRow[predictionKey];
          predictionResult = predictionString ? JSON.parse(predictionString) : null;
        }
        const predictions = predictionResult ? predictionResult.predictions : [0, 0, 0];
        const scorePrediction = predictionResult ? predictionResult.scorePrediction : [0, 0];

        const modifiedRow: Match = {
          ...row, date: new Date(row.date), predictions, scorePrediction,
          home_score: toInt(row.home_score), away_score: toInt(row.away_score), home_penalty: toInt(row.home_penalty), away_penalty: toInt(row.away_penalty), home_score_total: toInt(row.home_score_total), away_score_total: toInt(row.away_score_total),
        };

        modifiedData.push(modifiedRow);
      }

      data = modifiedData.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
  });

  const allMatches = data.flatMap(match =>
    !isNaN(match.home_score_total) && !isNaN(match.away_score_total) ? [{
      ...match,
      date: `${String(match.date.getDate()).padStart(2, '0')}/${String(match.date.getMonth() + 1).padStart(2, '0')}`
    }] : []
  )
    .sort((a, b) => {
      const [dayA, monthA] = a.date.split('/').map(Number);
      const [dayB, monthB] = b.date.split('/').map(Number);
      return monthA - monthB || dayA - dayB;
    });

  const groupStages = Array.from(new Set(
    data.filter((match: Match) => match.stage.startsWith("Group"))
      .map((match: Match) => match.stage)
  )).sort();

  const formattedDates = Array.from(new Set(allMatches.map(match => match.date)));
  const correctPredictionsPerDay = new Array(formattedDates.length).fill(0);
  const incorrectPredictionsPerDay = new Array(formattedDates.length).fill(0);
  let perfectScores = 0;
  let correctGroups = 0;
  let correctKnockouts = 0;
  let matchesPlayedGroups = 0;
  let matchesPlayedKnockouts = 0;

  allMatches.forEach(match => {
    if (Number.isNaN(match.home_score_total) || Number.isNaN(match.away_score_total)) {
      return;
    }

    const isGroupStage = match.stage.startsWith("Group");
    if (isGroupStage) matchesPlayedGroups++;
    else matchesPlayedKnockouts++;

    const predictedOutcomeIndex = match.predictions.indexOf(Math.max(...match.predictions));
    let predictedOutcome = "";
    if (predictedOutcomeIndex === 0) predictedOutcome = "home";
    else if (predictedOutcomeIndex === 1) predictedOutcome = "away";
    else if (predictedOutcomeIndex === 2) predictedOutcome = "draw";

    let actualOutcome = "";
    if (match.home_score_total > match.away_score_total) actualOutcome = "home";
    else if (match.home_score_total < match.away_score_total) actualOutcome = "away";
    else if (match.home_score_total === match.away_score_total) actualOutcome = "draw";

    if (predictedOutcome === actualOutcome) {
      correctPredictionsPerDay[formattedDates.indexOf(match.date)]++;
      if (isGroupStage) correctGroups++;
      else correctKnockouts++;
    } else {
      incorrectPredictionsPerDay[formattedDates.indexOf(match.date)]++;
    }

    if (match.scorePrediction[0] === match.home_score_total && match.scorePrediction[1] === match.away_score_total) {
      perfectScores++;
    }
  });

  return {
    data,
    categories: formattedDates,
    groups: groupStages,
    correctPredictionsPerDay,
    incorrectPredictionsPerDay,
    perfectScores,
    correctGroups,
    matchesPlayedGroups,
    correctKnockouts,
    matchesPlayedKnockouts
  };
}