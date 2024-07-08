export default interface Match {
	stage: string;
	date: string;
	stadium: string;
	city: string;
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