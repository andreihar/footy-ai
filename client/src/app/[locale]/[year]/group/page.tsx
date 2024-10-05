import { generateMetadata as generateSEO } from '@/components/SEO';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import * as stats from '@/utils/stats';
import GroupPerformance from '@/components/shared/GroupPerformance';

type Props = {
  params: { locale: string; };
};

export async function generateMetadata({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('groupPerformance');

  return generateSEO({
    title: t('title'),
    description: t('description', { year: 2024 })
  });
}

export default function GroupPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const { groups } = stats;

  return (
    <>
      {groups.map((group: any) => (
        <div key={group} style={{ marginBottom: '20px' }}>
          <GroupPerformance group={group} />
        </div>
      ))}
    </>
  );
};
