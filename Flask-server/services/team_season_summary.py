import pandas as pd
from typing import Dict, Any
from flask import current_app

def get_team_season_match_summary(team_name: str) -> Dict[str, Any]:
    matches_df = current_app.config['matches_df']

    team_matches = matches_df[
        (matches_df['team1'] == team_name) |
        (matches_df['team2'] == team_name)
    ].copy()

    if team_matches.empty:
        return {
            'team': team_name,
            'error': f"No matches found for team: {team_name}"
        }

    if 'date' in team_matches.columns:
        team_matches = team_matches.sort_values(['season', 'date'])
    else:
        team_matches = team_matches.sort_values(['season'])

    season_summaries = {}

    for season in sorted(team_matches['season'].unique()):
        season_matches = team_matches[team_matches['season'] == season].copy()

        match_results = []
        match_details = []

        for idx, (_, match) in enumerate(season_matches.iterrows(), 1):
            opponent = match['team2'] if match['team1'] == team_name else match['team1']

            if pd.isna(match['winner']) or match['winner'] == '' or match['winner'] == '-':
                result = 'NR'
            elif match['winner'] == team_name:
                result = 'W'
            else:
                result = 'L'

            match_results.append(result)
            match_details.append({
                'match_no': idx,
                'opponent': opponent,
                'result': result,
                'venue': match.get('venue', 'Unknown'),
                'match_type': match.get('match_type', 'League')
            })

        final_matches = season_matches[season_matches['match_type'] == 'Final']
        champion = False
        runner_up = False

        if not final_matches.empty:
            final_match = final_matches.iloc[0]
            if final_match['winner'] == team_name:
                champion = True
            elif final_match['winner'] != '' and final_match['winner'] != '-' and not pd.isna(final_match['winner']):
                runner_up = True

        wins = match_results.count('W')
        losses = match_results.count('L')
        no_results = match_results.count('NR')
        total_matches = len(match_results)
        win_percentage = (wins / total_matches * 100) if total_matches > 0 else 0

        season_summaries[season] = {
            'season': season,
            'match_details': match_details,
            'match_results': match_results,
            'total_matches': total_matches,
            'wins': wins,
            'losses': losses,
            'no_results': no_results,
            'win_percentage': round(win_percentage, 2),
            'champion': champion,
            'runner_up': runner_up
        }

    return {
        'team': team_name,
        'season_summaries': season_summaries
    }