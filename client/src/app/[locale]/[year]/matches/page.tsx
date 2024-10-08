import { Box } from '@mui/material';
import { getStats } from '@/utils/stats';
import { generateMetadata as generateSEO } from '@/components/SEO';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import MatchCard from '@/components/card/MatchCard';
import PaginationComponent from '@/components/shared/PaginationComponent';

type Props = {
  params: { locale: string; year: string; };
  searchParams: { page?: string; };
};

export async function generateMetadata({ params: { locale, year } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Matches');

  return generateSEO({
    title: t('title'),
    description: t('description', { year: year })
  });
}

export default async function MatchesPage({ params: { locale, year }, searchParams: { page = '1' } }: Props) {
  unstable_setRequestLocale(locale);
  const current = Number(page);
  const pageSize = 10;
  const stats = await getStats(Number(year));
  const { data } = stats;
  const filteredData = data.filter(match => match.home_team !== "?" && match.away_team !== "?").reverse();

  const startIndex = (current - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <>
      {paginatedData.map((match, index) => (
        <Box key={index} mt={2}>
          <MatchCard {...match} year={Number(year)} locale={locale} />
        </Box>
      ))}
      <PaginationComponent total={Math.ceil(filteredData.length / pageSize)} current={current} />
    </>
  );
}
