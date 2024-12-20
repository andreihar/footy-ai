import Match from '@/types/match';

export default interface Return {
	data: Match[];
	categories: string[];
	groups: string[];
	correctPredsPerDay: number[];
	incorrectPredsPerDay: number[];
	perfectScores: number;
	correctGroups: number;
	matchesPlayedGroups: number;
	correctKnockouts: number;
	matchesPlayedKnockouts: number;
}