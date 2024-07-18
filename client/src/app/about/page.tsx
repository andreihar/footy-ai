'use client';
import { Box, CardContent, Typography, Link, ListItem, ListItemText, ListItemIcon, Card, CardActionArea, CardMedia, CardHeader, Avatar, Grid } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import DashboardCard from '@/app/components/shared/DashboardCard';
import { useIntl, FormattedMessage } from 'react-intl';
import StarIcon from '@mui/icons-material/Star';
import { IconBallFootball, IconTableShare, IconTournament, IconBrain } from "@tabler/icons-react";
import { useEffect, useState } from 'react';

const AboutPage = () => {
  const { formatMessage } = useIntl();
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetch('https://api.github.com/repos/andreihar/footy-ai')
      .then(response => response.json())
      .then(data => {
        setStars(data.stargazers_count);
        setDescription(data.description);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const GithubCard = () => (
    <Card sx={{ maxWidth: 345, my: '20px', mx: "auto" }}>
      <CardActionArea onClick={() => window.open('https://github.com/andreihar', '_blank')}>
        <CardHeader
          avatar={
            <Avatar aria-label="profile" src="https://avatars.githubusercontent.com/u/95883512?v=4" />
          }
          title={<Typography variant="h6" component="div">Andrei Harbachov</Typography>}
          subheader="andreihar"
        />
      </CardActionArea>
      <CardActionArea onClick={() => window.open('https://github.com/andreihar/footy-ai', '_blank')}>
        <CardMedia component="img" height="140" image="/images/banner.jpg" alt="Banner" />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography gutterBottom variant="h3" component="div">Footy AI</Typography>
            <Box display="flex" alignItems="center">
              <StarIcon sx={{ color: "gold", mr: '3px' }} />
              <Typography variant="subtitle1">{stars}</Typography>
            </Box>
          </Box>
          <Typography variant="body1" color="text.secondary">{description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  const listItems = [
    { title: formatMessage({ id: 'about.list.title1' }), description: formatMessage({ id: 'about.list.text1' }), Icon: IconBrain },
    { title: formatMessage({ id: 'about.list.title2' }), description: formatMessage({ id: 'about.list.text2' }), Icon: IconTableShare },
    { title: formatMessage({ id: 'about.list.title3' }), description: formatMessage({ id: 'about.list.text3' }), Icon: IconTournament },
    { title: formatMessage({ id: 'about.list.title4' }), description: formatMessage({ id: 'about.list.text4' }), Icon: IconBallFootball }
  ];

  return (
    <PageContainer title={formatMessage({ id: 'header.about' })} description="List of all matches and predictions">
      <DashboardCard title={`${formatMessage({ id: 'about.title' })} Footy AI`}>
        <CardContent>
          <Typography paragraph variant="body1">{formatMessage({ id: 'about.text1' })}</Typography>
          <Typography variant="h4" gutterBottom>{formatMessage({ id: 'about.title2' })}</Typography>
          <Typography paragraph>{formatMessage({ id: 'about.text2' })}</Typography>
          <Typography variant="h4" gutterBottom>{formatMessage({ id: 'about.title3' })}</Typography>
          <Typography paragraph>{formatMessage({ id: 'about.text3' })}</Typography>
          <Box pl={2} mb={2}>
            <Grid container spacing={2}>
              {listItems.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <ListItem>
                    <ListItemIcon sx={{ color: "inherit" }}><item.Icon /></ListItemIcon>
                    <ListItemText primary={item.title} secondary={item.description} primaryTypographyProps={{ sx: { fontWeight: '900', fontSize: '1.15rem' } }} secondaryTypographyProps={{ sx: { fontSize: '1rem' } }} />
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Typography variant="h4" gutterBottom>{formatMessage({ id: 'about.title4' })}</Typography>
          <Typography paragraph>{formatMessage({ id: 'about.text4' })}</Typography>
          <Typography paragraph>
            <FormattedMessage id="about.text4.1"
              values={{ b: chunks => <Link href="https://github.com/andreihar/footy-ai" target="_blank">{chunks}</Link> }}
            />
          </Typography>
          <GithubCard />
          <Typography variant="h4" gutterBottom>{formatMessage({ id: 'about.title5' })}</Typography>
          <Typography paragraph>{formatMessage({ id: 'about.text5' })}</Typography>
          <Typography paragraph>{formatMessage({ id: 'about.text6' })}</Typography>
        </CardContent>
      </DashboardCard>
    </PageContainer>
  );
};

export default AboutPage;
