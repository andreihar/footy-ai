import { Box, Typography, Button } from '@mui/material';
import PageNotFoundIcon from '@/components/icon/PageNotFoundIcon';
import { generateMetadata as generateSEO } from '@/components/SEO';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';

type Props = {
  params?: { locale: string; };
};

export async function generateMetadata({ params: { locale } = { locale: 'en' } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('404');

  return generateSEO({
    title: t('title')
  });
}

export default function NotFoundPage({ params: { locale } = { locale: 'en' } }: Props) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('404');

  return (
    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mt={5}>
      <Typography variant="h1" gutterBottom>{t('error')}</Typography>
      <Typography mt={2} gutterBottom>{t('text')}</Typography>
      <PageNotFoundIcon sx={{ fontSize: 300 }} />
      <Button variant="contained" size="large" href="/" sx={{ mt: 2 }}>{t('button')}</Button>
    </Box>
  );
}
