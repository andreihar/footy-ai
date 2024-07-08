export default interface Match {
	home_team: string;
	away_team: string;
	home_score: number;
	away_score: number;
	home_penalty: number;
	away_penalty: number;
	home_score_total: number;
	away_score_total: number;
	date: Date;
	stage: string;
	stadium: string;
	city: string;
	predictions: number[];
	scorePrediction: number[];
}