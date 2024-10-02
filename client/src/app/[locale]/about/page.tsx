import { Box, CardContent, Typography, Link, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { generateMetadata as generateSEO } from '@/components/SEO';
import DashboardCard from '@/components/shared/DashboardCard';
import GithubCard from '@/components/card/GithubCard';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { IconBallFootball, IconTableShare, IconTournament, IconBrain } from "@tabler/icons-react";

type Props = {
  params: { locale: string; };
};

export async function generateMetadata({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('about');

  return generateSEO({
    title: (() => {
      const words = t('title').split(' ');
      return words.length > 1 ? words.slice(0, -1).join(' ') : words.join(' ');
    })(),
    description: t('description')
  });
}

export default function AboutPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('about');

  const listItems = [
    { title: t('list.title1'), description: t('list.text1'), Icon: IconBrain },
    { title: t('list.title2'), description: t('list.text2'), Icon: IconTableShare },
    { title: t('list.title3'), description: t('list.text3'), Icon: IconTournament },
    { title: t('list.title4'), description: t('list.text4'), Icon: IconBallFootball }
  ];

  return (
    <DashboardCard title={`${t('title')} Footy AI`}>
      <CardContent>
        <Typography variant="body1" mb={2}>{t('text1')}</Typography>
        <Typography variant="h4" gutterBottom>{t('title2')}</Typography>
        <Typography mb={2}>{t('text2')}</Typography>
        <Typography variant="h4" gutterBottom>{t('title3')}</Typography>
        <Typography mb={2}>{t('text3')}</Typography>
        <Box pl={2} mb={2}>
          <Grid container spacing={2}>
            {listItems.map((item, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <ListItem>
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <item.Icon />
                  </ListItemIcon>
                  <ListItemText primary={item.title} secondary={item.description} primaryTypographyProps={{ sx: { fontWeight: '900', fontSize: '1.15rem' } }} secondaryTypographyProps={{ sx: { fontSize: '1rem', lineHeight: "1.3rem" } }} />
                </ListItem>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Typography variant="h4" gutterBottom>{t('title4')}</Typography>
        <Typography mb={2}>{t('text4')}</Typography>
        <Typography mb={2}>
          {t.rich('text4_1', {
            b: (chunks) => <Link href="https://github.com/andreihar/footy-ai" target="_blank">{chunks}</Link>
          })}
        </Typography>
        <GithubCard />
        <Typography variant="h4" gutterBottom>{t('title5')}</Typography>
        <Typography mb={2}>{t('text5')}</Typography>
        <Typography mb={2}>{t('text6')}</Typography>
      </CardContent>
    </DashboardCard>
  );
}
