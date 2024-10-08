import { generateMetadata as generateSEO } from '@/components/SEO';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { getStats } from '@/utils/stats';
import GroupCard from '@/components/card/GroupCard';

type Props = {
  params: { locale: string; year: string; };
};

export async function generateMetadata({ params: { locale, year } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Group');

  return generateSEO({
    title: t('title'),
    description: t('description', { year: year })
  });
}

export default async function GroupPage({ params: { locale, year } }: Props) {
  unstable_setRequestLocale(locale);
  const stats = await getStats(Number(year));
  const { data, groups } = stats;

  return (
    <>
      {groups.map((group: any) => (
        <div key={group} style={{ marginBottom: '20px' }}>
          <GroupCard data={data} group={group} year={Number(year)} />
        </div>
      ))}
    </>
  );
};
