import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import Match from '@/types/match';

interface ReturnTypes {
  data: Match[];
  categories: string[];
  groups: string[];
  correctPredsPerDay: number[];
  incorrectPredsPerDay: number[];
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
  scorePred: number[];
  preds: number[];
} | null;

export async function getStats(year: number): Promise<ReturnTypes> {
  const predsFilePath = path.join(process.cwd(), 'public', 'data', 'predictions', `${year}.csv`);
  const matchesFilePath = path.join(process.cwd(), 'public', 'data', 'matches', `${year}.csv`);

  const predsCsvText = await fs.readFile(predsFilePath, 'utf-8');
  let predsData: any[] = [];
  Papa.parse(predsCsvText, {
    header: true,
    complete: (result) => {
      predsData = result.data;
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
        const homeTeamRow = predsData.find(predRow => predRow.home_team === row.home_team);
        let predResult: PredictionResult = null;
        if (homeTeamRow) {
          const predKey = `${row.away_team}_${row.stage.startsWith("Group") ? '1' : '0'}`;
          const predString = homeTeamRow[predKey];
          predResult = predString ? JSON.parse(predString) : null;
        }
        const preds = predResult ? predResult.preds : [0, 0, 0];
        const scorePred = predResult ? predResult.scorePred : [0, 0];

        const modifiedRow: Match = {
          ...row, date: new Date(row.date), preds, scorePred,
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
      date: `${String(match.date.getDate()).padStart(2, '0')}/${String(match.date.getMonth() + 1).padStart(2, '0')}${(year - 1960) % 4 === 0 ? '' : `/${String(match.date.getFullYear()).slice(-2)}`}`
    }] : []
  )
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('/').map(Number);
      const [dayB, monthB, yearB] = b.date.split('/').map(Number);
      return (yearA || 0) - (yearB || 0) || monthA - monthB || dayA - dayB;
    });

  const groupStages = Array.from(new Set(
    data.filter((match: Match) => match.stage.startsWith("Group"))
      .map((match: Match) => match.stage)
  )).sort();

  const formattedDates = Array.from(new Set(allMatches.map(match => match.date)));
  const correctPredsPerDay = new Array(formattedDates.length).fill(0);
  const incorrectPredsPerDay = new Array(formattedDates.length).fill(0);
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

    const predictedOutcomeIndex = match.preds.indexOf(Math.max(...match.preds));
    let predictedOutcome = "";
    if (predictedOutcomeIndex === 0) predictedOutcome = "home";
    else if (predictedOutcomeIndex === 1) predictedOutcome = "away";
    else if (predictedOutcomeIndex === 2) predictedOutcome = "draw";

    let actualOutcome = "";
    if (match.home_score_total > match.away_score_total) actualOutcome = "home";
    else if (match.home_score_total < match.away_score_total) actualOutcome = "away";
    else if (match.home_score_total === match.away_score_total) actualOutcome = "draw";

    if (predictedOutcome === actualOutcome) {
      correctPredsPerDay[formattedDates.indexOf(match.date)]++;
      if (isGroupStage) correctGroups++;
      else correctKnockouts++;
    } else {
      incorrectPredsPerDay[formattedDates.indexOf(match.date)]++;
    }

    if (match.scorePred[0] === match.home_score_total && match.scorePred[1] === match.away_score_total) {
      perfectScores++;
    }
  });

  return {
    data,
    categories: formattedDates,
    groups: groupStages,
    correctPredsPerDay,
    incorrectPredsPerDay,
    perfectScores,
    correctGroups,
    matchesPlayedGroups,
    correctKnockouts,
    matchesPlayedKnockouts
  };
}