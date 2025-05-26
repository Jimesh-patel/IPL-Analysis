from flask import Blueprint, jsonify
from services.data_loader import matches_df

seasons_bp = Blueprint('seasons', __name__)

@seasons_bp.route('/', methods=['GET'])
def get_seasons():
    """Get list of all seasons"""
    if matches_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    seasons = sorted(matches_df['season'].dropna().unique().tolist())
    return jsonify({'seasons': seasons})

@seasons_bp.route('/<int:season>/matches', methods=['GET'])
def get_season_matches(season):
    """Get all matches for a specific season"""
    if matches_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
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
            'match_type': match.get('match_type', 'League')
        })
    
    return jsonify({
        'season': season,
        'total_matches': len(matches_list),
        'matches': matches_list
    })