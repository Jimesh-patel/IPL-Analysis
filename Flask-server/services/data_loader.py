import pandas as pd
from models.team_mapping import team_to_state_mapping

matches_df = None
deliveries_df = None

def load_data() -> bool:
    global matches_df, deliveries_df
    try:
        deliveries_df = pd.read_csv('data/deliveries.csv')
        matches_df = pd.read_csv('data/matches.csv')

        deliveries_df['batting_team'] = deliveries_df['batting_team'].map(team_to_state_mapping)
        deliveries_df['bowling_team'] = deliveries_df['bowling_team'].map(team_to_state_mapping)
        matches_df['team1'] = matches_df['team1'].map(team_to_state_mapping)
        matches_df['team2'] = matches_df['team2'].map(team_to_state_mapping)
        matches_df['toss_winner'] = matches_df['toss_winner'].map(team_to_state_mapping)
        matches_df['winner'] = matches_df['winner'].map(team_to_state_mapping)

        deliveries_df.fillna(0, inplace=True)
        matches_df.fillna(0, inplace=True)
        print("Data loaded successfully!")
        # print(matches_df.head())
        # print(deliveries_df.head())
        return True
    except Exception as e:
        print(f"Error loading data: {e}")
        return False