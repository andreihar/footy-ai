import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Papa from 'papaparse';
import Match from '@/types/match';
import Loading from '@/app/[locale]/loading';

interface StatsContextType {
  data: Match[];
  categories: string[];
  groups: string[];
  correctPredictionsPerDay: number[];
  incorrectPredictionsPerDay: number[];
  perfectScores: number,
  correctGroups: number,
  matchesPlayedGroups: number,
  correctKnockouts: number,
  matchesPlayedKnockouts: number,
  fetchMatch: (home_team: string, away_team: string, allowDraw: boolean) => Promise<PredictionResult | null>;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
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

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const [data, setData] = useState<Match[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [correctPredictionsPerDay, setCorrectPredictionsPerDay] = useState<number[]>([]);
  const [incorrectPredictionsPerDay, setIncorrectPredictionsPerDay] = useState<number[]>([]);
  const [perfectScores, setPerfectScores] = useState<number>(0);
  const [correctGroups, setCorrectGroups] = useState<number>(0);
  const [matchesPlayedGroups, setMatchesGroupsPlayed] = useState<number>(0);
  const [correctKnockouts, setCorrectKnockouts] = useState<number>(0);
  const [matchesPlayedKnockouts, setMatchesKnockoutsPlayed] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => { setIsClient(true); }, []);

  const [year, setYear] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const storedYear = localStorage.getItem('year');
      const urlYear = searchParams.get('year');
      return urlYear ? Number(urlYear) : (storedYear ? Number(storedYear) : 2024);
    }
    return 2024;
  });

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('year', year.toString());
      const params = new URLSearchParams(searchParams.toString());
      params.set('year', year.toString());
      window.history.pushState(null, '', `?${params.toString()}`);
    }
  }, [year, isClient, searchParams]);

  const fetchMatch = useCallback(async (home_team: string, away_team: string, allowDraw: boolean): Promise<PredictionResult> => {
    try {
      const response = await fetch(`/data/predictions/${year}.csv`);
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
  }, [year]);

  useEffect(() => {
    async function fetchData() {
      const predictionsResponse = await fetch(`/data/predictions/${year}.csv`);
      const predictionsCsvText = await predictionsResponse.text();
      let predictionsData: any[] = [];
      Papa.parse(predictionsCsvText, {
        header: true,
        complete: (result) => {
          predictionsData = result.data;
        }
      });

      const responseData = await fetch(`/data/matches/${year}.csv`);
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

            setData(modifiedData.sort((a, b) => a.date.getTime() - b.date.getTime()));
          },
          header: true
        });
      } else {
        console.error('Response body is null');
      }
    }
    if (isClient) {
      fetchData();
    }
  }, [year, isClient, fetchMatch]);

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

    const groupStages = Array.from(new Set(
      data.filter((match: Match) => match.stage.startsWith("Group"))
        .map((match: Match) => match.stage)
    )).sort();
    setGroups(groupStages);

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

    setCategories(formattedDates);
    setCorrectPredictionsPerDay(correctPredictionsPerDay);
    setIncorrectPredictionsPerDay(incorrectPredictionsPerDay);
    setPerfectScores(perfectScores);
    setCorrectGroups(correctGroups);
    setMatchesGroupsPlayed(matchesPlayedGroups);
    setCorrectKnockouts(correctKnockouts);
    setMatchesKnockoutsPlayed(matchesPlayedKnockouts);
  }, [data]);

  if (!isClient) {
    return <Loading />;
  }

  return (
    <StatsContext.Provider value={{ data, categories, groups, correctPredictionsPerDay, incorrectPredictionsPerDay, perfectScores, correctGroups, matchesPlayedGroups, correctKnockouts, matchesPlayedKnockouts, fetchMatch, year, setYear }}>
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