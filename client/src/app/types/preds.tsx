
export default interface Preds {
	[key: string]: {
		predictions: number[];
		scorePrediction: number[];
	};
}