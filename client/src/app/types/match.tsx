export default interface Match {
	stage: string;
	date: string;
	location: string;
	teams: {
		home: string;
		away: string;
	};
	score: {
		home: number | null;
		away: number | null;
	};
	predictions: number[];
	scorePrediction: number[];
}