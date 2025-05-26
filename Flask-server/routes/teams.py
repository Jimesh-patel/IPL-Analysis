from flask import Blueprint, jsonify
from services import data_loader

matches_df = data_loader.matches_df
teams_bp = Blueprint('teams', __name__)

@teams_bp.route('/', methods=['GET'])
def get_teams():
    if matches_df is None or matches_df.empty:
        return jsonify({'error': 'Data not loaded or empty'}), 500

    try:
        team1 = matches_df['team1'].dropna().unique().tolist()
        team2 = matches_df['team2'].dropna().unique().tolist()
        teams = list(set(team1 + team2))

        teams = [team for team in teams if team and team.strip() != '']

        return jsonify({'teams': sorted(teams)})
    
    except Exception as e:
        return jsonify({'error': f'Internal error: {str(e)}'}), 500


@teams_bp.route('/<team_name>/performance', methods=['GET'])
def get_team_performance(team_name):
    if matches_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    from services.team_performance import analyze_team_performance
    try:
        stats = analyze_team_performance(team_name.upper())
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500