import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import Match from '../app/types/match';

interface StatsContextType {
  data: Match[];
  categories: string[];
  correctPredictionsPerDay: number[];
  incorrectPredictionsPerDay: number[];
  fetchMatch: (home_team: string, away_team: string, allowDraw: boolean) => Promise<PredictionResult | null>;
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

interface PredsRow {
  home_team: string;
  [key: string]: string;
}

interface Predictions {
  [key: string]: {
    predictions: number[];
    scorePrediction: number[];
  };
}

type PredictionResult = {
  scorePrediction: number[];
  predictions: number[];
} | null;

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [correctPredictionsPerDay, setCorrectPredictionsPerDay] = useState<number[]>([]);
  const [incorrectPredictionsPerDay, setIncorrectPredictionsPerDay] = useState<number[]>([]);
  const [data, setData] = useState<Match[]>([]);

  useEffect(() => {
    async function fetchData() {
      const responseData = await fetch('/data/matches/2024.csv');
      if (responseData.body) {
        const readerData = responseData.body.getReader();
        const resultData = await readerData.read();
        const decoder = new TextDecoder('utf-8');
        const csvData = decoder.decode(resultData.value);

        Papa.parse(csvData, {
          complete: async (result) => {
            const dataRows = (result.data as DataRow[]).filter((row: DataRow) => row.date);
            const modifiedData: Match[] = [];

            for (const row of dataRows) {
              const toInt = (value: string | undefined | null): number => {
                if (value === undefined || value === null) return NaN;
                return parseInt(value, 10);
              };

              const predictionResult = await fetchMatch(row.home_team, row.away_team, row.stage.startsWith("Group"));
              const predictions = predictionResult ? predictionResult.predictions : [0, 0, 0];
              const scorePrediction = predictionResult ? predictionResult.scorePrediction : [0, 0];

              const modifiedRow: Match = {
                ...row, date: new Date(row.date), predictions, scorePrediction,
                home_score: toInt(row.home_score), away_score: toInt(row.away_score), home_penalty: toInt(row.home_penalty), away_penalty: toInt(row.away_penalty), home_score_total: toInt(row.home_score_total), away_score_total: toInt(row.away_score_total),
              };

              modifiedData.push(modifiedRow);
            }

            setData(modifiedData.sort((a, b) => a.date.getTime() - b.date.getTime()));
          },
          header: true
        });
      } else {
        console.error('Response body is null');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
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
    const formattedDates = Array.from(new Set(allMatches.map(match => match.date)));
    setCategories(formattedDates);
    const correctPredictionsPerDay = new Array(formattedDates.length).fill(0);
    const incorrectPredictionsPerDay = new Array(formattedDates.length).fill(0);

    allMatches.forEach(match => {
      if (Number.isNaN(match.home_score_total) || Number.isNaN(match.away_score_total)) {
        return;
      }

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
      } else {
        incorrectPredictionsPerDay[formattedDates.indexOf(match.date)]++;
      }
      setCorrectPredictionsPerDay(correctPredictionsPerDay);
      setIncorrectPredictionsPerDay(incorrectPredictionsPerDay);
    });
  }, [data]);

  async function fetchMatch(home_team: string, away_team: string, allowDraw: boolean): Promise<PredictionResult> {
    try {
      const response = await fetch('/data/predictions/2024.csv');
      if (!response.ok) throw new Error('Failed to fetch predictions');

      const csvText = await response.text();

      let matchPrediction: PredictionResult = null;
      Papa.parse(csvText, {
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

  return (
    <StatsContext.Provider value={{ data, categories, correctPredictionsPerDay, incorrectPredictionsPerDay, fetchMatch }}>
      {children}
    </StatsContext.Provider>
  );

};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};