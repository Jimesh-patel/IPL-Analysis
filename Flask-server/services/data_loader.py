import pandas as pd
from models.team_mapping import team_to_state_mapping

matches_df = None
deliveries_df = None

def load_data() -> bool:
    global matches_df, deliveries_df
    try:
        deliveries_df = pd.read_csv('data/deliveries.csv')
        matches_df = pd.read_csv('data/matches.csv')
        
#         deliveries column:
# Index(['match_id', 'inning', 'batting_team', 'bowling_team', 'over', 'ball',
#        'batter', 'bowler', 'non_striker', 'batsman_runs', 'extra_runs',
#        'total_runs', 'extras_type', 'is_wicket', 'player_dismissed',
#        'dismissal_kind', 'fielder'],
        
        deliveries_df['batting_team'] = deliveries_df['batting_team'].map(team_to_state_mapping)
        deliveries_df['bowling_team'] = deliveries_df['bowling_team'].map(team_to_state_mapping)
        matches_df['team1'] = matches_df['team1'].map(team_to_state_mapping)
        matches_df['team2'] = matches_df['team2'].map(team_to_state_mapping)
        matches_df['toss_winner'] = matches_df['toss_winner'].map(team_to_state_mapping)
        matches_df['winner'] = matches_df['winner'].map(team_to_state_mapping)

        deliveries_df.fillna(0, inplace=True)
        matches_df.fillna(0, inplace=True)
        print("Data loaded successfully!")
        # print(matches_df.head(10))
        # print("matches_df columns :" )
        # print(matches_df.columns)
        
        # print(deliveries_df.head(10))
        # print("deliveries column : ")
        # print(deliveries_df.columns)
        
        # Index(['id', 'season', 'city', 'date', 'match_type', 'player_of_match',
        #        'venue', 'team1', 'team2', 'toss_winner', 'toss_decision', 'winner',
        #        'result', 'result_margin', 'target_runs', 'target_overs', 'super_over',
        #        'method', 'umpire1', 'umpire2'],
        # print(deliveries_df.head())
        return True
    except Exception as e:
        print(f"Error loading data: {e}")
        return False