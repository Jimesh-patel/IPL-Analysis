from flask import Flask, jsonify
from flask_cors import CORS
from routes.teams import get_teams, get_team_performance
from routes.head_to_head import get_head_to_head
from routes.seasons import get_seasons, get_season_matches
from services.data_loader import load_data

app = Flask(__name__)
CORS(app)

@app.route('/teams', methods=['GET'])
def teams_route():
    return get_teams()

@app.route('/team/<team_name>/performance', methods=['GET'])
def team_performance_route(team_name):
    return get_team_performance(team_name)

@app.route('/head-to-head/<team1>/<team2>', methods=['GET'])
def head_to_head_route(team1, team2):
    return get_head_to_head(team1, team2)

@app.route('/seasons', methods=['GET'])
def seasons_route():
    return get_seasons()

@app.route('/season/<season>/matches', methods=['GET'])
def season_matches_route(season):
    return get_season_matches(season)

if __name__ == '__main__':
    print("Loading cricket data...")
    if load_data():
        print("Starting Flask server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("Failed to load data. Please ensure 'matches.csv' and 'deliveries.csv' are in the data directory.")