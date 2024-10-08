import { generateMetadata as generateSEO } from '@/components/SEO';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import Page from "./page";

type Props = {
  params: { year: string; locale: string; };
};

export async function generateMetadata({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Custom');

  return generateSEO({
    title: t('title'),
    description: t('description')
  });
}

export default function PageLayout({ params }: Props) {
  return (<Page params={params} />);
}
