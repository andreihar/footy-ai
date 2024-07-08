import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

import Match from '../app/types/match';
import Preds from '../app/types/preds';
import predsJson from '../../public/data/euro2024preds.json';
const preds: Preds = predsJson;

interface StatsContextType {
  categories: string[];
  correctPredictionsPerDay: number[];
  incorrectPredictionsPerDay: number[];
}

interface Row {
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

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [correctPredictionsPerDay, setCorrectPredictionsPerDay] = useState<number[]>([]);
  const [incorrectPredictionsPerDay, setIncorrectPredictionsPerDay] = useState<number[]>([]);
  const [data2, setData] = useState<Match[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/data/2024.csv');
      if (response.body) {
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        Papa.parse(csv, {
          complete: (result) => {
            const modifiedData: Match[] = (result.data as Row[]).map((row: Row): Match => {
              const toInt = (value: string | undefined | null): number => {
                if (value === undefined || value === null) return NaN;
                return parseInt(value, 10);
              };

              const modifiedRow: Match = {
                ...row, date: new Date(row.date), predictions: [], scorePrediction: [],
                home_score: toInt(row.home_score), away_score: toInt(row.away_score), home_penalty: toInt(row.home_penalty), away_penalty: toInt(row.away_penalty), home_score_total: toInt(row.home_score_total), away_score_total: toInt(row.away_score_total),
              };

              return modifiedRow;
            });
            setData(modifiedData);
            console.log(modifiedData);
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
    const allMatches = data2
      .flatMap(match =>
        !isNaN(match.home_score_total) && !isNaN(match.away_score_total) ? [{
          ...match,
          predictions: preds[`${match.home_team}_${match.away_team}_${match.stage.startsWith("Group") ? "1" : "0"}`]?.predictions || [0, 0, 0],
          scorePrediction: preds[`${match.home_team}_${match.away_team}_${match.stage.startsWith("Group") ? "1" : "0"}`]?.scorePrediction || [0, 0],
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
      if (isNaN(match.home_score_total) || isNaN(match.away_score_total)) {
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
  }, [data2]);

  return (
    <StatsContext.Provider value={{ categories, correctPredictionsPerDay, incorrectPredictionsPerDay }}>
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