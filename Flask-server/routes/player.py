from flask import Blueprint, jsonify
from services import data_loader
import pandas as pd
import numpy as np

def analyze_batsman(batsman_name):
    try:
        if not batsman_name or not isinstance(batsman_name, str):
            return jsonify({'error': 'Invalid batsman name provided'}), 400

        df = data_loader.deliveries_df
        if df is None:
            return jsonify({'error': 'Deliveries data not loaded. Ensure deliveries.csv is present'}), 500

        required_cols = ['match_id', 'inning', 'batter',
                         'batsman_runs', 'extras_type', 'player_dismissed']
        if not all(col in df.columns for col in required_cols):
            return jsonify({'error': f'Missing columns in deliveries data: {", ".join([col for col in required_cols if col not in df.columns])}'}), 500

        data = df[df['batter'] == batsman_name]
        if data.empty:
            return jsonify({'error': f'No batting records found for {batsman_name}'}), 404

        total_runs = int(data['batsman_runs'].sum())  # Convert to Python int
        # Convert to Python int
        balls_faced = int(data[data['extras_type'] != 'wides'].shape[0])
        total_matches = int(data['match_id'].nunique()
                            )  # Convert to Python int

        # Innings-wise runs
        # Convert to Python int
        first_innings_runs = int(
            data[data['inning'] == 1]['batsman_runs'].sum())
        # Convert to Python int
        second_innings_runs = int(
            data[data['inning'] == 2]['batsman_runs'].sum())

        # Dismissals
        dismissals = df[df['player_dismissed'] == batsman_name]
        total_dismissals = int(dismissals.shape[0])  # Convert to Python int

        # Batting average and strike rate
        average = total_runs / total_dismissals if total_dismissals > 0 else total_runs
        strike_rate = (total_runs / balls_faced *
                       100) if balls_faced > 0 else 0

        # Per match total runs (to count 50s and 100s)
        runs_per_match = data.groupby('match_id')['batsman_runs'].sum()
        # Convert to Python int
        fifties = int(((runs_per_match >= 50) & (runs_per_match < 100)).sum())
        hundreds = int((runs_per_match >= 100).sum())  # Convert to Python int

        # Convert to Python int, handle empty case
        highest_score = int(runs_per_match.max()
                            ) if not runs_per_match.empty else 0

        return jsonify({
            "Batsman": batsman_name,
            "Matches": total_matches,
            "Runs": total_runs,
            "Balls Faced": balls_faced,
            "Strike Rate": round(float(strike_rate), 2),  # Ensure float
            "Average": round(float(average), 2),  # Ensure float
            "Dismissals": total_dismissals,
            "Runs (1st Innings)": first_innings_runs,
            "Runs (2nd Innings)": second_innings_runs,
            "50s": fifties,
            "100s": hundreds,
            "Highest Score": highest_score
        })
    except AttributeError as e:
        return jsonify({'error': f'Data access error: {str(e)}'}), 500
    except KeyError as e:
        return jsonify({'error': f'Missing column: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error for {batsman_name}: {str(e)}'}), 500
    
    
def analyze_bowler(bowler_name):
    try:
        if not bowler_name or not isinstance(bowler_name, str):
            return jsonify({'error': 'Invalid bowler name provided'}), 400

        if not hasattr(data_loader, 'deliveries_df'):
            print("Data loader missing deliveries_df attribute")
            return jsonify({'error': 'Data loader not initialized properly'}), 500

        df = data_loader.deliveries_df
        if df is None:
            print("Deliveries_df is None")
            return jsonify({'error': 'Deliveries data not loaded. Ensure deliveries.csv is present'}), 500

        required_cols = ['match_id', 'bowler', 'over', 'ball', 'total_runs',
                         'extra_runs', 'extras_type', 'is_wicket', 'dismissal_kind']
        if not all(col in df.columns for col in required_cols):
            print(
                f"Missing columns: {[col for col in required_cols if col not in df.columns]}")
            return jsonify({'error': f'Missing columns in deliveries data: {", ".join([col for col in required_cols if col not in df.columns])}'}), 500

        data = df[df['bowler'] == bowler_name]
        if data.empty:
            print(f"No bowling records for {bowler_name}")
            return jsonify({'error': f'No bowling records found for {bowler_name}'}), 404

        total_balls = int(data[data['extras_type'] !=
                          'wides'][['over', 'ball']].shape[0])
        overs = total_balls // 6 + (total_balls % 6) / 6

        runs_conceded = int(data['total_runs'].sum() -
                            data['extra_runs'].sum())
        wickets = int(data[
            (data['bowler'] == bowler_name) &
            (data['is_wicket'] == 1) &
            (~data['dismissal_kind'].isin(['run out', 'retired hurt']))
        ].shape[0])

        matches = int(data['match_id'].nunique())
        bowling_avg = runs_conceded / wickets if wickets > 0 else None
        economy = runs_conceded / overs if overs > 0 else None
        strike_rate = total_balls / wickets if wickets > 0 else None

        dismissals = data[data['is_wicket'] != 0 & (
            data['dismissal_kind'] != 'run out')]
        # print(dismissals)
        wickets_per_match = dismissals.groupby('match_id').size()

        runs_per_match = data.groupby('match_id')['total_runs'].sum()
        bowling_performance = pd.DataFrame({
            'wickets': wickets_per_match,
            'runs_conceded': runs_per_match
        })
        # print(bowling_performance)
        bowling_performance = bowling_performance.dropna(subset=['wickets'])
        if bowling_performance.empty:
            best_figures = "0/0"
        else:
            bowling_performance_sorted = bowling_performance.sort_values(
                by=['wickets', 'runs_conceded'], ascending=[False, True])
            # print(bowling_performance_sorted)
            best_match = bowling_performance_sorted.iloc[0]
            best_figures = f"{int(best_match['wickets'])}/{int(best_match['runs_conceded'])}"

        return jsonify({
            "Bowler": bowler_name,
            "Matches": matches,
            "Wickets": wickets,
            "Overs": round(float(overs), 2),
            "Runs Conceded": runs_conceded,
            "Bowling Average": round(float(bowling_avg), 2) if bowling_avg is not None else "NA",
            "Economy": round(float(economy), 2) if economy is not None else "NA",
            "Strike Rate": round(float(strike_rate), 2) if strike_rate is not None else "NA",
            "Best Figures": best_figures
        })
    except AttributeError as e:
        print(f"AttributeError in analyze_bowler: {str(e)}")
        return jsonify({'error': f'Data access error: {str(e)}'}), 500
    except KeyError as e:
        print(f"KeyError in analyze_bowler: {str(e)}")
        return jsonify({'error': f'Missing column: {str(e)}'}), 500
    except IndexError as e:
        print(f"IndexError in analyze_bowler: {str(e)}")
        return jsonify({'error': f'No wickets taken by {bowler_name}, cannot compute best figures'}), 404
    except Exception as e:
        print(f"Unexpected error in analyze_bowler: {str(e)}")
        return jsonify({'error': f'Unexpected error for {bowler_name}: {str(e)}'}), 500

def players_route():
    try:
        deliveries_df = data_loader.deliveries_df
        if deliveries_df is None:
            return jsonify({'error': 'Deliveries data not loaded. Ensure deliveries.csv is present'}), 500
        required_cols = ['batter', 'bowler']
        if not all(col in deliveries_df.columns for col in required_cols):
            return jsonify({'error': f'Missing columns in deliveries data: {", ".join([col for col in required_cols if col not in deliveries_df.columns])}'}), 500
        batters = deliveries_df['batter'].dropna().unique().tolist()
        bowlers = deliveries_df['bowler'].dropna().unique().tolist()
        players = sorted(list(set(batters + bowlers)))
        if not players:
            return jsonify({'error': 'No players found in the data'}), 404
        # print(players)
        return {'players': players}
    except AttributeError as e:
        return jsonify({'error': f'Data access error: {str(e)}'}), 500
    except KeyError as e:
        return jsonify({'error': f'Missing column: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error fetching players: {str(e)}'}), 500
