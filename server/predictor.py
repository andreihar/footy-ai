import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

teams_list = ["Albania","Andorra","Armenia","Austria","Azerbaijan","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czechia","Denmark","England","Estonia","Faroe Islands","Finland","France","Georgia","Germany","Gibraltar","Greece","Hungary","Iceland","Israel","Italy","Kazakhstan","Kosovo","Latvia","Liechtenstein","Lithuania","Luxembourg","Malta","Moldova","Monaco","Montenegro","Netherlands","North Macedonia","Northern Ireland","Norway","Poland","Portugal","Ireland","Romania","Russia","San Marino","Scotland","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Turkey","Ukraine","Wales"]

reg = None
xG = {}
elo_dict = {}

def initialise():
    global reg, elo_dict, xG
    date_from = '2020-01-01'
    date_to = '2024-06-12'
    elo_ratings = pd.read_csv("data/elo.csv")
    match_results = pd.read_csv("data/results.csv")
    team_stats = {}
    elo_ratings_dict = {(row['team'], row['year']): row['rating'] for idx, row in elo_ratings.iterrows()}

    def update_team_stats(team, opponent_score, team_score, elo_diff):
        if team not in team_stats:
            team_stats[team] = {'total_score': team_score, 'games': 1, 'scores': [team_score], 
                                'opponent_scores': [opponent_score], 'elo_diffs': [elo_diff]}
        else:
            stats = team_stats[team]
            stats['total_score'] += team_score
            stats['games'] += 1
            stats['scores'].append(team_score)
            stats['opponent_scores'].append(opponent_score)
            stats['elo_diffs'].append(elo_diff)
    
    filtered_matches = match_results.loc[(match_results['date'] > date_from) & (match_results['date'] <= date_to)]

    for idx, match in filtered_matches.iterrows():
        home_team, away_team = match["home_team"], match["away_team"]
        match_year = int(match['date'][:4])
        home_elo = elo_ratings_dict.get((home_team, match_year))
        away_elo = elo_ratings_dict.get((away_team, match_year))
        if home_elo is None or away_elo is None:
            continue

        update_team_stats(home_team, match["away_score"], match["home_score"], home_elo - away_elo)
        update_team_stats(away_team, match["home_score"], match["away_score"], away_elo - home_elo)
    
    xG = {team: stats['total_score'] / stats['games'] for team, stats in team_stats.items()}
    X, y = [], []
    for team, stats in team_stats.items():
        X.extend(stats['elo_diffs'])
        y.extend((np.array(stats['scores']) - xG[team]).tolist())
    X, y = np.array(X).reshape(-1, 1), np.array(y).reshape(-1, 1)
    reg = LinearRegression().fit(X, y)
    elo_dict = {i: j for i, j in zip(teams_list, [(elo_ratings[(elo_ratings['year'] == int(date_to.split('-')[0])) & (elo_ratings['team'] == team)]['rating']).to_list()[0] for team in teams_list])}

def match(home, away, allow_draw=True):
    home_advantage = int(reg.predict(np.array(elo_dict[home] - elo_dict[away]).reshape(-1, 1)))
    away_advantage = int(reg.predict(np.array(elo_dict[away] - elo_dict[home]).reshape(-1, 1)))
    home_score = np.random.poisson(xG[home], 10000) + home_advantage
    away_score = np.random.poisson(xG[away], 10000) + away_advantage

    win_team = max(home_score.max(), away_score.max())
    
    scores, counts = np.unique(np.vstack((home_score, away_score)).T, axis=0, return_counts=True)
    score_matrix = np.zeros((win_team+1, win_team+1))
    score_matrix[scores[:,0], scores[:,1]] = counts

    home_win_count = np.sum(np.tril(score_matrix, -1))
    away_win_count = np.sum(np.triu(score_matrix, 1))
    draw_count = np.sum(np.diag(score_matrix)) if allow_draw else 0

    outcomes = np.array([home_win_count, away_win_count, draw_count])
    most_probable_outcome_index = outcomes.argmax()

    if most_probable_outcome_index == 0:  # Home win
        score = np.unravel_index(np.argmax(np.tril(score_matrix, -1)), score_matrix.shape)
    elif most_probable_outcome_index == 1:  # Away win
        score = np.unravel_index(np.argmax(np.triu(score_matrix, 1)), score_matrix.shape)
    else:  # Draw
        score = np.argmax(np.diag(score_matrix)), np.argmax(np.diag(score_matrix))
    
    total_simulations = outcomes.sum() if allow_draw else home_win_count + away_win_count
    home_win = (home_win_count / total_simulations) * 100
    away_win = (away_win_count / total_simulations) * 100
    draw = (draw_count / total_simulations) * 100

    predictions = {
        "predictions": [round(home_win, 2), round(away_win, 2), round(draw, 2)],
        "scorePrediction": [int(score[0]), int(score[1])]
    }
    
    return predictions