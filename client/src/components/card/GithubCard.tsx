'use client';
import { useEffect, useState } from 'react';
import { Card, CardActionArea, CardContent, CardHeader, CardMedia, Avatar, Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface GithubCardProps {
  stars: number;
  description: string;
}

const GithubCard: React.FC = () => {
  const [data, setData] = useState<GithubCardProps | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      const response = await fetch('https://api.github.com/repos/andreihar/footy-ai');
      const data = await response.json();
      setData({
        stars: data.stargazers_count,
        description: data.description,
      });
    };

    fetchGitHubData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
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
        <CardMedia component="img" height="140" image="/img/banner.jpg" alt="Banner" />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography gutterBottom variant="h3" component="div">Footy AI</Typography>
            <Box display="flex" alignItems="center">
              <StarIcon sx={{ color: "gold", mr: '3px' }} />
              <Typography variant="subtitle1">{data.stars}</Typography>
            </Box>
          </Box>
          <Typography variant="body1" color="text.secondary">{data.description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GithubCard;