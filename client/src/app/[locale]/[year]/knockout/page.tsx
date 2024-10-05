import { Box, Typography } from '@mui/material';
import { getStats } from '@/utils/stats';
import { generateMetadata as generateSEO } from '@/components/SEO';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Match from '@/types/match';
import MatchBracket from '@/components/knockout/MatchBracket';
import './style.scss';

type Props = {
  params: { locale: string; year: string; };
};

export async function generateMetadata({ params: { locale, year } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('matches');

  return generateSEO({
    title: t('title'),
    description: t('description', { year: year })
  });
}

export default async function KnockoutPage({ params: { locale, year } }: Props) {
  unstable_setRequestLocale(locale);
  const stats = await getStats(Number(year));
  const { data } = stats;
  const t = await getTranslations('matches');

  const sortTournamentMatches = (data: Match[]): { [stage: string]: Match[]; } => {
    const stages = ['Round of 16', 'Quarter-finals', 'Semi-finals', 'Final', 'Third-place play-off'];
    let teamWeights: { [team: string]: number; } = {};
    const sortedMatchesByStage = stages.reduce<{ [stage: string]: Match[]; }>((acc, stage) => {
      acc[stage] = [];
      return acc;
    }, {});

    for (let i = stages.length - 1; i >= 0; i--) {
      const stageMatches = data.filter(match => match.stage === stages[i]);
      const sortedMatches = stageMatches.sort((a, b) => {
        const aWeight = (teamWeights[a.home_team] || 0) + (teamWeights[a.away_team] || 0);
        const bWeight = (teamWeights[b.home_team] || 0) + (teamWeights[b.away_team] || 0);
        return aWeight - bWeight;
      });
      sortedMatches.forEach((match, index) => {
        if (match.home_team !== '?') teamWeights[match.home_team] = (index * 2) + 1;
        if (match.away_team !== '?') teamWeights[match.away_team] = (index * 2) + 2;
      });
      sortedMatchesByStage[stages[i]] = sortedMatches;
    }
    return sortedMatchesByStage;
  };

  return (
    <Box display="flex" sx={{ overflow: 'auto', maxWidth: '90vw' }}>
      {Object.entries(sortTournamentMatches(data)).map(([stageName, matches]) => {
        return (
          matches.length > 0 && (
            <Box className="stage-column" key={stageName} display="flex" flexDirection="column" minHeight="100%" justifyContent="space-around" alignItems="center" position="relative" pt={5}>
              <Typography variant="h5" position="absolute" zIndex={1} top={0} left="50%" sx={{ transform: 'translateX(-50%)' }}>
                {t(`${stageName}` as any)}
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
