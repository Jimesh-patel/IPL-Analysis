import pandas as pd
import numpy as np

def create_player_performance_df(deliveries_df):
    
    deliveries_df['batsman_runs'] = pd.to_numeric(deliveries_df['batsman_runs'], errors='coerce').fillna(0)
    deliveries_df['ball'] = pd.to_numeric(deliveries_df['ball'], errors='coerce').fillna(0)
    if 'total_runs' in deliveries_df.columns:
        deliveries_df['total_runs'] = pd.to_numeric(deliveries_df['total_runs'], errors='coerce').fillna(0)
    if 'is_wicket' in deliveries_df.columns:
        deliveries_df['is_wicket'] = pd.to_numeric(deliveries_df['is_wicket'], errors='coerce').fillna(0)

    batting_stats = deliveries_df.groupby('batter').agg({
        'batsman_runs': 'sum',
        'ball': 'count'
    }).round(2)
    
    batting_stats.columns = ['total_runs', 'balls_faced']
    batting_stats['strike_rate'] = (batting_stats['total_runs'] / batting_stats['balls_faced'].replace(0, np.nan) * 100).round(2)
    batting_stats['strike_rate'] = batting_stats['strike_rate'].fillna(0)
    fours = deliveries_df[deliveries_df['batsman_runs'] == 4].groupby('batter').size()
    sixes = deliveries_df[deliveries_df['batsman_runs'] == 6].groupby('batter').size()
    batting_stats['fours'] = fours.reindex(batting_stats.index, fill_value=0)
    batting_stats['sixes'] = sixes.reindex(batting_stats.index, fill_value=0)
    
    if 'player_dismissed' in deliveries_df.columns:
        dismissals = deliveries_df[deliveries_df['player_dismissed'].notna()]['player_dismissed'].value_counts()
        batting_stats['times_out'] = dismissals.reindex(batting_stats.index, fill_value=0)
    else:
        batting_stats['times_out'] = 0
        
    innings_played = deliveries_df.groupby('batter')['match_id'].nunique()
    batting_stats['innings_played'] = innings_played
    batting_stats['batting_average'] = (batting_stats['total_runs'] / batting_stats['times_out'].replace(0, np.nan)).round(2)
    batting_stats['batting_average'] = batting_stats['batting_average'].fillna(batting_stats['total_runs'])

    bowling_stats = deliveries_df.groupby('bowler').agg({
        'total_runs': 'sum',
        'ball': 'count'
    }).round(2)
    
    bowling_stats.columns = ['runs_conceded', 'balls_bowled']
    
    if 'is_wicket' in deliveries_df.columns:
        wickets = deliveries_df.groupby('bowler')['is_wicket'].sum()
        bowling_stats['wickets'] = wickets
    else:
        bowling_stats['wickets'] = 0
        
    bowling_stats['overs_bowled'] = (bowling_stats['balls_bowled'] / 6).round(1)
    bowling_stats['economy_rate'] = (bowling_stats['runs_conceded'] / bowling_stats['overs_bowled'].replace(0, np.nan)).round(2)
    bowling_stats['economy_rate'] = bowling_stats['economy_rate'].fillna(0)
    bowling_stats['bowling_average'] = (bowling_stats['runs_conceded'] / bowling_stats['wickets'].replace(0, np.nan)).round(2)
    bowling_stats['bowling_average'] = bowling_stats['bowling_average'].fillna(0)
    bowling_stats['bowling_strike_rate'] = (bowling_stats['balls_bowled'] / bowling_stats['wickets'].replace(0, np.nan)).round(2)
    bowling_stats['bowling_strike_rate'] = bowling_stats['bowling_strike_rate'].fillna(0)

    fielding_stats = pd.Series(dtype=int, name='catches')
    if 'fielder' in deliveries_df.columns:
        catches = deliveries_df[deliveries_df['fielder'].notna()].groupby('fielder').size()
        fielding_stats = catches
    stumpings = pd.Series(dtype=int, name='stumpings')
    
    if 'dismissal_kind' in deliveries_df.columns:
        stumpings = deliveries_df[deliveries_df['dismissal_kind'] == 'stumped'].groupby('fielder').size()
    runouts = pd.Series(dtype=int, name='runouts')
    if 'dismissal_kind' in deliveries_df.columns and 'fielder' in deliveries_df.columns:
        runouts = deliveries_df[deliveries_df['dismissal_kind'] == 'run out'].groupby('fielder').size()

    all_players = set(batting_stats.index.tolist() + bowling_stats.index.tolist())
    if len(fielding_stats) > 0:
        all_players.update(fielding_stats.index.tolist())
    if len(stumpings) > 0:
        all_players.update(stumpings.index.tolist())
    if len(runouts) > 0:
        all_players.update(runouts.index.tolist())

    all_players = {p for p in all_players if isinstance(p, str)}
    player_performance = pd.DataFrame(index=sorted(list(all_players)))
    player_performance.index.name = 'player_name'
    batting_cols = ['total_runs', 'balls_faced', 'strike_rate', 'batting_average', 'fours', 'sixes', 'times_out', 'innings_played']
    for col in batting_cols:
        if col in batting_stats.columns:
            player_performance[col] = batting_stats[col].reindex(player_performance.index, fill_value=0)
        else:
            player_performance[col] = 0
            
    bowling_cols = ['overs_bowled', 'runs_conceded', 'wickets', 'economy_rate', 'bowling_average', 'bowling_strike_rate']
    for col in bowling_cols:
        if col in bowling_stats.columns:
            player_performance[col] = bowling_stats[col].reindex(player_performance.index, fill_value=0)
        else:
            player_performance[col] = 0
    player_performance['catches'] = fielding_stats.reindex(player_performance.index, fill_value=0)
    
    if len(stumpings) > 0:
        player_performance['stumpings'] = stumpings.reindex(player_performance.index, fill_value=0)
    else:
        player_performance['stumpings'] = 0
        
    if len(runouts) > 0:
        player_performance['runouts'] = runouts.reindex(player_performance.index, fill_value=0)
    else:
        player_performance['runouts'] = 0
        
    int_cols = ['total_runs', 'balls_faced', 'fours', 'sixes', 'times_out', 'innings_played', 'runs_conceded', 'wickets', 'catches', 'stumpings', 'runouts']
    
    for col in int_cols:
        if col in player_performance.columns:
            player_performance[col] = pd.to_numeric(player_performance[col], errors='coerce').fillna(0).astype(int)
    player_performance = player_performance.fillna(0)
    
    print('Player performance processing completed !')
    return player_performance