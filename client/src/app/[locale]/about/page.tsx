import { Box, CardContent, Typography, Link, ListItem, ListItemText, ListItemIcon, Grid } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import DashboardCard from '@/components/shared/DashboardCard';
import { useTranslations } from 'next-intl';
import { IconBallFootball, IconTableShare, IconTournament, IconBrain } from "@tabler/icons-react";
// import dynamic from 'next/dynamic';

// const GithubCard = dynamic(() => import('@/components/card/GithubCard'), { ssr: false });

const AboutPageContent: React.FC = () => {
  const t = useTranslations();

  const listItems = [
    { title: t('about.list.title1'), description: t('about.list.text1'), Icon: IconBrain },
    { title: t('about.list.title2'), description: t('about.list.text2'), Icon: IconTableShare },
    { title: t('about.list.title3'), description: t('about.list.text3'), Icon: IconTournament },
    { title: t('about.list.title4'), description: t('about.list.text4'), Icon: IconBallFootball }
  ];

  return (
    <PageContainer title={t('header.about')} description="List of all matches and predictions" >
      <DashboardCard title={`${t('about.title')} Footy AI`}>
        <CardContent>
          <Typography paragraph variant="body1">{t('about.text1')}</Typography>
          <Typography variant="h4" gutterBottom>{t('about.title2')}</Typography>
          <Typography paragraph>{t('about.text2')}</Typography>
          <Typography variant="h4" gutterBottom>{t('about.title3')}</Typography>
          <Typography paragraph>{t('about.text3')}</Typography>
          <Box pl={2} mb={2}>
            <Grid container spacing={2}>
              {listItems.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <ListItem>
                    <ListItemIcon sx={{ color: "inherit" }}><item.Icon /></ListItemIcon>
                    <ListItemText primary={item.title} secondary={item.description} primaryTypographyProps={{ sx: { fontWeight: '900', fontSize: '1.15rem' } }} secondaryTypographyProps={{ sx: { fontSize: '1rem', lineHeight: "1.3rem" } }} />
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Typography variant="h4" gutterBottom>{t('about.title4')}</Typography>
          <Typography paragraph>{t('about.text4')}</Typography>
          <Typography paragraph>
            {t.rich('about.text4_1', {
              b: (chunks) => <Link href="https://github.com/andreihar/footy-ai" target="_blank">{chunks}</Link>
            })}
          </Typography>
          {/* <GithubCard /> */}
          <Typography variant="h4" gutterBottom>{t('about.title5')}</Typography>
          <Typography paragraph>{t('about.text5')}</Typography>
          <Typography paragraph>{t('about.text6')}</Typography>
        </CardContent>
      </DashboardCard>
    </PageContainer >
  );
};

export default AboutPageContent;