from flask import Blueprint, jsonify
from services import data_loader

seasons_bp = Blueprint('seasons', __name__)

@seasons_bp.route('/', methods=['GET'])
def get_seasons():
    matches_df = data_loader.matches_df
    if matches_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    seasons = sorted(matches_df['season'].dropna().unique().tolist())
    return jsonify({'seasons': seasons})


@seasons_bp.route('/<season>/matches', methods=['GET'])
def get_season_matches(season):
    matches_df = data_loader.matches_df
    if matches_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    if(season not in matches_df['season'].unique()):
        return jsonify({'error': f'Invalid season: {season}'}), 400
    
    season_matches = matches_df[matches_df['season'] == season].copy()
    
    if season_matches.empty:
        return jsonify({'error': f'No matches found for season {season}'}), 404
    
    matches_list = []
    for _, match in season_matches.iterrows():
        matches_list.append({
            'match_id': int(match.get('id', 0)),
            'season': int(match['season']),
            'team1': match['team1'],
            'team2': match['team2'],
            'winner': match.get('winner', ''),
            'venue': match.get('venue', ''),
            'date': match.get('date', ''),
            'match_type': match.get('match_type', 'League'),
            'toss_winner': match.get('toss_winner', ''),
            'toss_decision': match.get('toss_decision', ''),
            'target_runs': int(match.get('target_runs', 0)),
            
            
        })
    
    return jsonify({
        'season': season,
        'total_matches': len(matches_list),
        'matches': matches_list
    })