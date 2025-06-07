import pandas as pd

df = pd.read_csv('data/ipl_2025_deliveries.csv')

def count_wickets(x):
    return x['wicket_type'].notnull().sum()


over_summary = df.groupby(
    ['match_id', 'season', 'phase', 'match_no', 'date', 'venue', 'batting_team', 'bowling_team', 'innings', 'over']
).agg(
    runs_of_bat=('runs_of_bat', 'sum'),
    extras=('extras', 'sum'),
    total_runs=('runs_of_bat', 'sum'),  
    wickets=('wicket_type', count_wickets)
).reset_index()

print(over_summary.head())