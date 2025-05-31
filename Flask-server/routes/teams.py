from flask import Blueprint, jsonify
from services import data_loader


teams_bp = Blueprint('teams', __name__)

@teams_bp.route('/', methods=['GET'])
def get_teams():
    matches_df = data_loader.matches_df
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
    if(team_name is None or team_name.strip() == ''):
        return jsonify({'error': 'Team name is required'}), 400
    matches_df = data_loader.matches_df
    if matches_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    from services.team_performance import analyze_team_performance
    try:
        stats = analyze_team_performance(team_name)
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def team_players(team_name):
    try:
        import pandas as pd
        from flask import jsonify  # If using Flask

        # Validate input
        if not team_name or not isinstance(team_name, str):
            return jsonify({'error': 'Invalid team name provided'}), 400

        # Load data
        matches_df = data_loader.matches_df
        deliveries_df = data_loader.deliveries_df

        if matches_df is None or deliveries_df is None:
            return jsonify({'error': 'Data not loaded. Ensure CSVs are present'}), 500

        # Merge season into deliveries
        merged_df = deliveries_df.merge(
            matches_df[['id', 'season']],
            left_on='match_id',
            right_on='id',
            how='inner'
        )

        # Filter rows where team was involved
        team_df = merged_df[
            (merged_df['batting_team'] == team_name) |
            (merged_df['bowling_team'] == team_name)
        ]

        if team_df.empty:
            return {'error': f'No data found for team: {team_name}'}

        # Extract relevant columns
        player_data = team_df[['batting_team', 'bowling_team',
                               'batter', 'bowler', 'non_striker', 'season']]

        # Melt batting side (batter & non_striker)
        melted_batting = player_data[['batting_team', 'batter', 'non_striker', 'season']].melt(
            id_vars=['batting_team', 'season'],
            value_vars=['batter', 'non_striker'],
            value_name='player'
        ).rename(columns={'batting_team': 'team'})[['team', 'season', 'player']]

        # Bowling side (bowler only)
        melted_bowling = player_data[['bowling_team', 'bowler', 'season']].rename(
            columns={'bowling_team': 'team', 'bowler': 'player'}
        )[['team', 'season', 'player']]

        # Combine both
        combined = pd.concat(
            [melted_batting, melted_bowling], ignore_index=True)

        # Remove duplicates
        unique_entries = combined.drop_duplicates(
            subset=['team', 'player', 'season'])

        # Filter again to ensure only requested team (safety check)
        team_entries = unique_entries[unique_entries['team'] == team_name]


        # Group by player and collect seasons
# Group by player and collect seasons
        grouped = team_entries.groupby('player')['season'].apply(
                 lambda x: sorted(set(x), reverse=True)).reset_index()

# Add season count for sorting
        grouped['season_count'] = grouped['season'].apply(len)
        grouped['latest_season'] = grouped['season'].apply(lambda x: max(x))

# Sort by: latest season DESC, then season count DESC, then player name ASC
        grouped_sorted = grouped.sort_values(
          by=['latest_season', 'season_count', 'player'], ascending=[False, False, True])

# Format output
        players = [
         {
        'player': row['player'],
        'seasons': [str(season) for season in row['season']]
             }
             for _, row in grouped_sorted.iterrows()
            ]

        return {
            'team': team_name,
            'players': players
        }

    except AttributeError as e:
        return jsonify({'error': f'Data access error: {str(e)}'}), 500
    except KeyError as e:
        return jsonify({'error': f'Missing column: {str(e)}'}), 500
    except ValueError as e:
        return jsonify({'error': f'Data processing error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error for {team_name}: {str(e)}'}), 500
