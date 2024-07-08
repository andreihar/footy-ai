import React, { createContext, useContext, useState, useEffect } from 'react';

import Match from '../app/types/match';
import Preds from '../app/types/preds';
import data from '../../public/data/euro2024.json';
import predsJson from '../../public/data/euro2024preds.json';
const preds: Preds = predsJson;

interface StatsContextType {
  categories: string[];
  correctPredictionsPerDay: number[];
  incorrectPredictionsPerDay: number[];
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [correctPredictionsPerDay, setCorrectPredictionsPerDay] = useState<number[]>([]);
  const [incorrectPredictionsPerDay, setIncorrectPredictionsPerDay] = useState<number[]>([]);

  useEffect(() => {
    const allMatches = [...data.groupStage, ...data.knockoutStage]
      .flatMap(stage => stage.matches
        .flatMap(match =>
          match.score.home !== null && match.score.away !== null ? [{
            ...match,
            stage: stage.round,
            predictions: preds[`${match.teams.home}_${match.teams.away}_${stage.round.startsWith("Group") ? "1" : "0"}`]?.predictions || [0, 0, 0],
            scorePrediction: preds[`${match.teams.home}_${match.teams.away}_${stage.round.startsWith("Group") ? "1" : "0"}`]?.scorePrediction || [0, 0],
            date: `${String(new Date(match.date).getDate()).padStart(2, '0')}/${String(new Date(match.date).getMonth() + 1).padStart(2, '0')}`
          }] : []
        )
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
      setCorrectPredictionsPerDay(correctPredictionsPerDay);
      setIncorrectPredictionsPerDay(incorrectPredictionsPerDay);
    });
  }, []);

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