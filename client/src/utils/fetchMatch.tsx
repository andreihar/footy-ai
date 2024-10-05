'use client';
import Papa from 'papaparse';

type PredictionResult = {
  scorePrediction: number[];
  predictions: number[];
} | null;

export default async function fetchMatch(home_team: string, away_team: string, allowDraw: boolean, year: number): Promise<PredictionResult> {
  try {
    const response = await fetch(`/data/predictions/${year}.csv`);
    if (!response.ok) {
      throw new Error('Failed to fetch CSV file');
    }
    const predictionsCsvText = await response.text();

    let matchPrediction: PredictionResult = null;
    Papa.parse(predictionsCsvText, {
      header: true,
      complete: (result) => {
        const parsedData = result.data as any[];
        const homeTeamRow = parsedData.find(row => row.home_team === home_team);
        if (homeTeamRow) {
          const predictionString = homeTeamRow[`${away_team}_${allowDraw ? '1' : '0'}`];
          if (predictionString) {
            const prediction = JSON.parse(predictionString);
            matchPrediction = {
              scorePrediction: prediction.scorePrediction,
              predictions: prediction.predictions,
            };
          }
        }
      }
    });
    return matchPrediction;
  } catch (error) {
    console.error('Error fetching or processing predictions:', error);
    return null;
  }
}