import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import Match from '@/types/match';
import DataRow from '@/types/dataRow';
import Return from '@/types/return';

type PredictionResult = {
  scorePred: number[];
  preds: number[];
} | null;

export async function getStats(year: number): Promise<Return> {
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

  const groups = Array.from(new Set(
    data.filter((match: Match) => match.stage.startsWith("Group"))
      .map((match: Match) => match.stage)
  )).sort();

  const categories = Array.from(new Set(allMatches.map(match => match.date)));
  const correctPredsPerDay = new Array(categories.length).fill(0);
  const incorrectPredsPerDay = new Array(categories.length).fill(0);
  let [perfectScores, correctGroups, correctKnockouts, matchesPlayedGroups, matchesPlayedKnockouts] = [0, 0, 0, 0, 0];

  allMatches.forEach(match => {
    if (Number.isNaN(match.home_score_total) || Number.isNaN(match.away_score_total)) {
      return;
    }

    const isGroupStage = match.stage.startsWith("Group");
    if (isGroupStage) matchesPlayedGroups++;
    else matchesPlayedKnockouts++;

    const predictedOutcome = ["home", "away", "draw"][match.preds.indexOf(Math.max(...match.preds))] || "";
    const actualOutcome = match.home_score_total > match.away_score_total ? "home" : match.home_score_total < match.away_score_total ? "away" : "draw";

    if (predictedOutcome === actualOutcome) {
      correctPredsPerDay[categories.indexOf(match.date)]++;
      if (isGroupStage) correctGroups++;
      else correctKnockouts++;
    } else {
      incorrectPredsPerDay[categories.indexOf(match.date)]++;
    }

    if (match.scorePred[0] === match.home_score_total && match.scorePred[1] === match.away_score_total) {
      perfectScores++;
    }
  });

  return { data, categories, groups, correctPredsPerDay, incorrectPredsPerDay, perfectScores, correctGroups, matchesPlayedGroups, correctKnockouts, matchesPlayedKnockouts };
}