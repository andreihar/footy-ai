import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import Match from '../app/types/match';

interface StatsContextType {
  data: Match[];
  categories: string[];
  correctPredictionsPerDay: number[];
  incorrectPredictionsPerDay: number[];
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

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [correctPredictionsPerDay, setCorrectPredictionsPerDay] = useState<number[]>([]);
  const [incorrectPredictionsPerDay, setIncorrectPredictionsPerDay] = useState<number[]>([]);
  const [data, setData] = useState<Match[]>([]);

  useEffect(() => {
    async function fetchData() {
      const responseData = await fetch('/data/matches/2024.csv');
      const responsePreds = await fetch('/data/predictions/2024.csv');
      if (responseData.body && responsePreds.body) {
        const readerData = responseData.body.getReader();
        const readerPreds = responsePreds.body.getReader();
        const resultData = await readerData.read();
        const resultPreds = await readerPreds.read();
        const decoder = new TextDecoder('utf-8');
        const csvData = decoder.decode(resultData.value);
        const csvPreds = decoder.decode(resultPreds.value);

        let preds: Predictions = {};
        Papa.parse(csvPreds, {
          header: true,
          complete: (result) => {
            (result.data as PredsRow[]).forEach((row) => {
              const homeTeam = row.home_team;
              Object.keys(row).forEach(key => {
                if (key !== 'home_team' && row[key] !== '') {
                  try {
                    preds[`${homeTeam}_${key}`] = JSON.parse(row[key]);
                  } catch (error) {
                    console.error(`Error parsing JSON for key ${key} in row with home_team ${homeTeam}:`, row[key]);
                    console.error(error);
                  }
                }
              });
            });
          }
        });

        Papa.parse(csvData, {
          complete: (result) => {
            const modifiedData: Match[] = (result.data as DataRow[]).filter((row: DataRow) => row.date).map((row: DataRow): Match => {
              const toInt = (value: string | undefined | null): number => {
                if (value === undefined || value === null) return NaN;
                return parseInt(value, 10);
              };

              const predictionKey = `${row.home_team}_${row.away_team}_${row.stage.startsWith("Group") ? "1" : "0"}`;
              const predictions = preds[predictionKey] ? preds[predictionKey].predictions : [0, 0, 0];
              const scorePrediction = preds[predictionKey] ? preds[predictionKey].scorePrediction : [0, 0];

              const modifiedRow: Match = {
                ...row, date: new Date(row.date), predictions, scorePrediction,
                home_score: toInt(row.home_score), away_score: toInt(row.away_score), home_penalty: toInt(row.home_penalty), away_penalty: toInt(row.away_penalty), home_score_total: toInt(row.home_score_total), away_score_total: toInt(row.away_score_total),
              };

              return modifiedRow;
            });
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

  return (
    <StatsContext.Provider value={{ data, categories, correctPredictionsPerDay, incorrectPredictionsPerDay }}>
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