
import { Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Avatar, Accordion, AccordionSummary, Button, AccordionDetails, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { IconCheck, IconX, IconMinus, IconListNumbers, IconMathXDivideY2, IconBallFootball } from '@tabler/icons-react';
import grey from '@mui/material/colors/grey';
import DashboardCard from '@/app/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import Match from '../../types/match';
import Preds from '../../types/preds';
import euro2024 from '../../../../public/data/euro2024.json';
import euro2024predsJson from '../../../../public/data/euro2024preds.json';
const euro2024preds: Preds = euro2024predsJson;

interface TeamStat {
    team: string;
    rank: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    matches: string[];
}

type ProductPerformanceProps = {
    group: string;
};

const ProductPerformance = ({ group }: ProductPerformanceProps) => {
    const [countryCodes, setCountryCodes] = useState<{ [key: string]: string; }>({});
    const [teamStats, setTeamStats] = useState<Array<TeamStat>>([]);
    const [correctRankings, setCorrectRankings] = useState(0);
    const [correctOutcomes, setCorrectOutcomes] = useState(0);
    const [correctScores, setCorrectScores] = useState(0);

    useEffect(() => {
        const foundStage = euro2024.groupStage.find(stage => stage.round === group);
        if (!foundStage) return;
        const allMatches = foundStage
            ? foundStage.matches.map(match => {
                const predictionKey = `${match.teams.home}_${match.teams.away}_${foundStage.round.startsWith("Group") ? "1" : "0"}`;
                const predictions = euro2024preds[predictionKey]?.predictions || [0, 0, 0];
                const scorePrediction = euro2024preds[predictionKey]?.scorePrediction || [0, 0];
                return { ...match, stage: foundStage.round, predictions, scorePrediction };
            }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            : [];

        const teamStats: { [key: string]: TeamStat; } = {};

        allMatches.forEach(match => {
            const { home, away } = match.teams;
            const [goalsHome, goalsAway] = match.scorePrediction;

            if (!teamStats[home]) teamStats[home] = { team: home, rank: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, matches: [] };
            if (!teamStats[away]) teamStats[away] = { team: away, rank: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, matches: [] };

            teamStats[home].goalsFor += goalsHome;
            teamStats[home].goalsAgainst += goalsAway;
            teamStats[away].goalsFor += goalsAway;
            teamStats[away].goalsAgainst += goalsHome;

            if (goalsHome > goalsAway) {
                teamStats[home].wins++;
                teamStats[home].matches.push("win");
                teamStats[home].points += 3;
                teamStats[away].losses++;
                teamStats[away].matches.push("loss");
            } else if (goalsHome < goalsAway) {
                teamStats[away].wins++;
                teamStats[away].matches.push("win");
                teamStats[away].points += 3;
                teamStats[home].losses++;
                teamStats[home].matches.push("loss");
            } else {
                teamStats[home].draws++;
                teamStats[home].matches.push("draw");
                teamStats[away].draws++;
                teamStats[away].matches.push("draw");
                teamStats[home].points += 1;
                teamStats[away].points += 1;
            }
        });

        const teamsWithRank = Object.values(teamStats)
            .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst))
            .map((teamStat, index) => ({ ...teamStat, rank: index + 1 }));

        setTeamStats(teamsWithRank);

        const correctRankingsCount = teamsWithRank.filter((team, index) => team.team === foundStage.standings[index]).length;
        setCorrectRankings(correctRankingsCount);

        let outcomesCount = 0;
        let scoresCount = 0;
        allMatches.forEach(match => {
            const actualMatch = foundStage.matches.find(m => m.teams.home === match.teams.home && m.teams.away === match.teams.away);
            if (actualMatch) {
                const predictedOutcome = match.scorePrediction[0] > match.scorePrediction[1] ? 'win' :
                    match.scorePrediction[0] < match.scorePrediction[1] ? 'loss' : 'draw';
                const actualOutcome = actualMatch.score.home > actualMatch.score.away ? 'win' :
                    actualMatch.score.home < actualMatch.score.away ? 'loss' : 'draw';

                if (predictedOutcome === actualOutcome) {
                    outcomesCount++;
                    if (match.scorePrediction[0] === actualMatch.score.home && match.scorePrediction[1] === actualMatch.score.away) {
                        scoresCount++;
                    }
                }
            }
        });
        setCorrectOutcomes(outcomesCount);
        setCorrectScores(scoresCount);
    }, []);

    useEffect(() => {
        const fetchCountryCodes = async () => {
            const response = await fetch('https://flagcdn.com/en/codes.json');
            const data = await response.json();
            const invertedData = Object.entries(data).reduce((obj, [code, country]) => {
                if (!code.startsWith('us-')) {
                    obj[country as string] = code;
                }
                return obj;
            }, {} as { [key: string]: string; });
            setCountryCodes(invertedData);
        };
        fetchCountryCodes();
    }, []);

    const getCountryCode = (countryName: string) => {
        return countryCodes[countryName];
    };

    return (
        <DashboardCard title={group}>
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}></Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>Team</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>W</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>D</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>L</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>GF</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>GA</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>GD</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6">Pts</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}></Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teamStats.map((product) => (
                            <TableRow key={product.team}>
                                <TableCell>
                                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>{product.rank}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Avatar alt="?" src={`https://flagcdn.com/w640/${getCountryCode(product.team)}.png`} sx={{ width: 30, height: 30, mr: 1, border: '0.5px solid lightgray' }} />
                                        <Typography variant="subtitle1" fontWeight={600}>{product.team}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{product.wins}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{product.draws}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{product.losses}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{product.goalsFor}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{product.goalsAgainst}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{product.goalsFor - product.goalsAgainst}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">{product.points}</Typography>
                                </TableCell>
                                <TableCell>
                                    {product.matches.map((match) => {
                                        switch (match) {
                                            case "win":
                                                return <IconButton size="small" sx={{ color: '#fff', backgroundColor: 'success.dark', mr: '4px' }}><IconCheck /></IconButton>;
                                            case "loss":
                                                return <IconButton size="small" sx={{ color: '#fff', backgroundColor: 'error.main', mr: '4px' }}><IconX /></IconButton>;
                                            default:
                                                return <IconButton size="small" sx={{ color: '#fff', backgroundColor: grey[600], mr: '4px' }}><IconMinus /></IconButton>;
                                        }
                                    })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box mt={3} display="flex" justifyContent="center" width="100%">
                    <Accordion disableGutters elevation={0} sx={{ width: '100%' }}>
                        <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{ justifyContent: 'center', display: 'flex', width: '100%' }}
                        >
                            <Button variant="contained" color="primary" component="div" sx={{ mx: 'auto' }}>
                                Prediction Results
                            </Button>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconListNumbers style={{ marginRight: 5 }} />
                                    <Typography variant="h6">Correct Rankings: {correctRankings}/4</Typography>
                                </ListItem>
                                <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconMathXDivideY2 style={{ marginRight: 5 }} />
                                    <Typography variant="h6">Correct Match Outcomes: {correctOutcomes}/6</Typography>
                                </ListItem>
                                <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconBallFootball style={{ marginRight: 5 }} />
                                    <Typography variant="h6">Correct Match Scores: {correctScores}/6</Typography>
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </DashboardCard>
    );
};

export default ProductPerformance;
