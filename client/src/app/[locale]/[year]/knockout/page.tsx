import MatchBracket from '@/components/knockout/MatchBracket';
import { generateMetadata as generateSEO } from '@/components/SEO';
import Match from '@/types/match';
import { getStats } from '@/utils/stats';
import { getTourneyNameStatic } from '@/utils/yearUtils';
import { Box, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import './style.scss';

type Props = {
  params: { locale: string; year: string; };
};

export async function generateMetadata({ params: { locale, year } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations('Knockout');

  return generateSEO({
    title: t('title'),
    description: t('description', { tourney: await getTourneyNameStatic(Number(year)) })
  });
}

export default async function KnockoutPage({ params: { locale, year } }: Props) {
  setRequestLocale(locale);
  const stats = await getStats(Number(year));
  const { data } = stats;
  const t = await getTranslations('Knockout');

  const sortTournamentMatches = (data: Match[], playOuts: boolean): { [stage: string]: Match[]; } => {
    let stages = playOuts ? [] : ['Round of 16', 'Quarter-finals', 'Semi-finals', 'Final', 'Third-place play-off'];
    let teamWeights: { [team: string]: number; } = {};
    const sortedMatchesByStage = stages.reduce<{ [stage: string]: Match[]; }>((acc, stage) => {
      acc[stage] = [];
      return acc;
    }, {});

    if (playOuts) {
      const playOutMatches = data.filter(match => match.stage === 'Play-outs').sort((a, b) => a.date.getTime() - b.date.getTime());
      playOutMatches.forEach((match, index) => {
        const stage = `Play-outs ${Math.floor(index / 2) + 1}`;
        sortedMatchesByStage[stage] = [];
        stages.push(stage);
        match.stage = stage;
      });
    }

    // Handle duplicate pairs before main loop
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const stageMatches = data.filter(match => match.stage === stage);

      // Group matches by unique team pairs (ignoring home/away)
      const pairsMap: { [pair: string]: Match[]; } = {};
      stageMatches.forEach(match => {
        const pair = [match.home_team, match.away_team].sort().join(' vs ');
        if (!pairsMap[pair]) pairsMap[pair] = [];
        pairsMap[pair].push(match);
      });

      Object.entries(pairsMap).forEach(([pair, matches]) => {
        if (matches.length > 1) {
          matches.sort((a, b) => a.date.getTime() - b.date.getTime());
          // The first match stays in the current stage, the rest go to new arrays
          for (let j = 1; j < matches.length; j++) {
            const newStage = `${j + 1} ${stage}`;
            if (!stages.includes(newStage)) {
              stages.splice(i + j, 0, newStage);
              sortedMatchesByStage[newStage] = [];
            }
            sortedMatchesByStage[newStage].push(matches[j]);
            const idx = data.indexOf(matches[j]);
            if (idx !== -1) data[idx].stage = newStage;
          }
        }
      });
    }

    const mainStageOrder = [
      'Round of 16',
      'Quarter-finals',
      'Semi-finals',
      'Final',
      'Third-place play-off'
    ];

    for (let i = stages.length - 1; i >= 0; i--) {
      const stage = stages[i];
      const stageMatches = data.filter(match => match.stage === stage);

      const sortedMatches = stageMatches.sort((a, b) => {
        const aWeight = (teamWeights[a.home_team] || 0) + (teamWeights[a.away_team] || 0);
        const bWeight = (teamWeights[b.home_team] || 0) + (teamWeights[b.away_team] || 0);
        return aWeight - bWeight;
      });
      sortedMatches.forEach((match, index) => {
        if (match.home_team !== '?') teamWeights[match.home_team] = (index * 2) + 1;
        if (match.away_team !== '?') teamWeights[match.away_team] = (index * 2) + 2;
      });
      sortedMatchesByStage[stage] = sortedMatches;
    }

    stages = stages
      .map(s => ({
        base: s.replace(/^\d+\s/, ''),
        num: /^\d+/.test(s) ? parseInt(s) : 0,
        orig: s
      }))
      .sort((a, b) => {
        const aIdx = mainStageOrder.indexOf(a.base);
        const bIdx = mainStageOrder.indexOf(b.base);
        if (aIdx !== bIdx) return aIdx - bIdx;
        return a.num - b.num;
      })
      .map(s => s.orig);

    // Rebuild sortedMatchesByStage in the correct order
    const orderedMatchesByStage: { [stage: string]: Match[]; } = {};
    for (const stage of stages) {
      if (sortedMatchesByStage[stage]) {
        orderedMatchesByStage[stage] = sortedMatchesByStage[stage];
      }
    }

    return orderedMatchesByStage;
  };

  const box = (data: { [stage: string]: Match[]; }) => {
    return (
      <Box display="flex">
        {Object.entries(data).map(([stageName, matches]) => {
          const stageTrans = stageName.startsWith('Play-outs')
            ? `${t('Play-outs')} ${stageName.split(' ')[1]}`
            : t(stageName.replace(/^\d+\s/, '') as any);
          return (
            matches.length > 0 && (
              <Box className="stage-column" key={stageName} display="flex" flexDirection="column" minHeight="100%" justifyContent="space-around" alignItems="center" position="relative" pt={5}>
                <Typography variant="h5" position="absolute" zIndex={1} top={0} left="50%" sx={{ transform: 'translateX(-50%)' }}>
                  {stageTrans}
                </Typography>
                {matches.map((match, index) => (
                  <MatchBracket key={`${stageName}-${index}`} match={match} year={Number(year)} />
                ))}
              </Box>
            )
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ overflow: 'auto', maxWidth: '90vw' }}>
      {box(sortTournamentMatches(data, false))}
      {box(sortTournamentMatches(data, true))}
    </Box>
  );
};
