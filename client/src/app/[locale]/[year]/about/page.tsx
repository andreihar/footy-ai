import { Box, Grid, CardContent, Typography, Link, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { generateMetadata as generateSEO } from '@/components/SEO';
import DashboardCard from '@/components/shared/DashboardCard';
import GithubCard from '@/components/card/GithubCard';
import { useTranslations } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import useYear from '@/utils/yearUtils';
import { years } from '@/config';
import { IconBallFootball, IconTableShare, IconTournament, IconBrain } from "@tabler/icons-react";

type Props = {
  params: { locale: string; };
};

export async function generateMetadata({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations('About');

  return generateSEO({
    title: (() => {
      const words = t('title', { title: '' }).split(' ');
      return words.length > 1 ? words.slice(0, -1).join(' ') : words.join(' ');
    })(),
    description: t('description', { title: process.env.NEXT_PUBLIC_TITLE }),
  });
}

export default function AboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('About');
  const { getTourneyName } = useYear(2024);

  const listItems = [
    { title: t('list.title1'), description: t('list.text1', { tourney: getTourneyName(years[0]) }), Icon: IconBrain },
    { title: t('list.title2'), description: t('list.text2'), Icon: IconTableShare },
    { title: t('list.title3'), description: t('list.text3'), Icon: IconTournament },
    { title: t('list.title4'), description: t('list.text4'), Icon: IconBallFootball }
  ];

  return (
    <DashboardCard title={t('title', { title: process.env.NEXT_PUBLIC_TITLE })}>
      <CardContent>
        <Typography variant="body1" mb={2}>{t('text1', { title: process.env.NEXT_PUBLIC_TITLE })}</Typography>
        <Typography variant="h4" gutterBottom>{t('title2')}</Typography>
        <Typography mb={2}>{t('text2', { title: process.env.NEXT_PUBLIC_TITLE })}</Typography>
        <Typography variant="h4" gutterBottom>{t('title3')}</Typography>
        <Typography mb={2}>{t('text3', { title: process.env.NEXT_PUBLIC_TITLE })}</Typography>
        <Box pl={2} mb={2}>
          <Grid container spacing={2}>
            {listItems.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <List>
                  <ListItem>
                    <ListItemIcon sx={{ color: "inherit" }}>
                      <item.Icon />
                    </ListItemIcon>
                    <ListItemText primary={item.title} secondary={item.description} primaryTypographyProps={{ sx: { fontWeight: '900', fontSize: '1.15rem' } }} secondaryTypographyProps={{ sx: { fontSize: '1rem', lineHeight: "1.3rem" } }} />
                  </ListItem>
                </List>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Typography variant="h4" gutterBottom>{t('title4')}</Typography>
        <Typography mb={2}>{t('text4')}</Typography>
        <Typography mb={2}>
          {t.rich('text4_1', {
            b: (chunks) => <Link href={`https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER}/${process.env.NEXT_PUBLIC_REPO_NAME}`} target="_blank" sx={{ fontWeight: 'bold' }}>{chunks}</Link>
          })}
        </Typography>
        <GithubCard />
        <Typography variant="h4" gutterBottom>{t('title5')}</Typography>
        <Typography mb={2}>{t('text5', { title: process.env.NEXT_PUBLIC_TITLE, tourney: getTourneyName(years[0]).split(' ').slice(0, -1).join(' ') })}</Typography>
        <Typography mb={2}>{t('text6', { title: process.env.NEXT_PUBLIC_TITLE })}</Typography>
      </CardContent>
    </DashboardCard>
  );
}
