'use client';
import { useEffect, useState } from 'react';
import { Card, CardActionArea, CardContent, CardHeader, CardMedia, Avatar, Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const GithubCard: React.FC = () => {
  const [data, setData] = useState<{ stars: number; description: string; avatar: string; name: string; } | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      const repoData = await (await fetch(`https://api.github.com/repos/${process.env.NEXT_PUBLIC_REPO_OWNER}/${process.env.NEXT_PUBLIC_REPO_NAME}`)).json();
      const userData = await (await fetch(`https://api.github.com/users/${process.env.NEXT_PUBLIC_REPO_OWNER}`)).json();
      setData({
        stars: repoData.stargazers_count,
        description: repoData.description,
        avatar: repoData.owner.avatar_url,
        name: userData.name,
      });
    };

    fetchGitHubData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Card sx={{ maxWidth: 345, my: '20px', mx: "auto" }}>
      <CardActionArea onClick={() => window.open(`https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER}`, '_blank')}>
        <CardHeader
          avatar={
            <Avatar aria-label="profile" src={data.avatar} alt={`${data.name}'s profile picture`} />
          }
          title={<Typography variant="h6" component="div">{data.name}</Typography>}
          subheader={process.env.NEXT_PUBLIC_REPO_OWNER}
        />
      </CardActionArea>
      <CardActionArea onClick={() => window.open(`https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER}/${process.env.NEXT_PUBLIC_REPO_NAME}`, '_blank')}>
        <CardMedia component="img" height="140" image="/img/banner.jpg" alt="Banner" />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography gutterBottom variant="h3" component="div">{process.env.NEXT_PUBLIC_TITLE}</Typography>
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
