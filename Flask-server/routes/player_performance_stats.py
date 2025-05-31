import pandas as pd
from flask import current_app, jsonify, request
from sklearn.preprocessing import MinMaxScaler

def get_player_performance_heatmap():
    df = current_app.config['player_performance_df'].copy()
    top_n = int(request.args.get('top_n', 20))
    sort_by = request.args.get('sort_by')

    # --- Add this block to compute overall_performance_score if missing ---
    if 'overall_performance_score' not in df.columns:
        # Example weights and stats (adjust as needed)
        batting_stats = ['total_runs', 'centuries', 'half_centuries', 'strike_rate', 'average']
        bowling_stats = ['wickets', 'economy_rate', 'bowling_average']
        fielding_stats = ['catches', 'stumpings']

        stat_columns = [col for col in df.columns if col != 'player_name' and pd.api.types.is_numeric_dtype(df[col])]
        scaler = MinMaxScaler()
        normalized_data = pd.DataFrame(
            scaler.fit_transform(df[stat_columns]),
            columns=stat_columns,
            index=df.index
        )

        overall_score = pd.Series(0, index=df.index, dtype=float)
        weight_sum = pd.Series(0, index=df.index, dtype=float)

        # Batting (40%)
        batting_score = pd.Series(0, index=df.index, dtype=float)
        batting_count = 0
        for stat in batting_stats:
            if stat in normalized_data.columns:
                if stat == 'economy_rate':
                    batting_score += (1 - normalized_data[stat])
                else:
                    batting_score += normalized_data[stat]
                batting_count += 1
        if batting_count > 0:
            overall_score += (batting_score / batting_count) * 0.4
            weight_sum += 0.4

        # Bowling (35%)
        bowling_score = pd.Series(0, index=df.index, dtype=float)
        bowling_count = 0
        for stat in bowling_stats:
            if stat in normalized_data.columns:
                if stat in ['economy_rate', 'bowling_average']:
                    bowling_score += (1 - normalized_data[stat])
                else:
                    bowling_score += normalized_data[stat]
                bowling_count += 1
        if bowling_count > 0:
            overall_score += (bowling_score / bowling_count) * 0.35
            weight_sum += 0.35

        # Fielding (25%)
        fielding_score = pd.Series(0, index=df.index, dtype=float)
        fielding_count = 0
        for stat in fielding_stats:
            if stat in normalized_data.columns:
                fielding_score += normalized_data[stat]
                fielding_count += 1
        if fielding_count > 0:
            overall_score += (fielding_score / fielding_count) * 0.25
            weight_sum += 0.25

        # Normalize final score
        mask = weight_sum > 0
        overall_score[mask] = overall_score[mask] / weight_sum[mask]
        df['overall_performance_score'] = overall_score
    # --- End block ---

    stat_columns = [col for col in df.columns if col != 'player_name' and pd.api.types.is_numeric_dtype(df[col])]
    display_columns = [col for col in stat_columns if col != 'overall_performance_score']

    # Sorting
    if sort_by and sort_by in df.columns:
        ascending = sort_by in ['economy_rate', 'bowling_average']
        df_sorted = df.sort_values(by=sort_by, ascending=ascending)
    else:
        df_sorted = df.sort_values(by='overall_performance_score', ascending=False)

    df_top = df_sorted.head(top_n)
    df_top = df_top.reset_index()  # <-- Add this line

    heatmap_data = df_top[['player_name'] + display_columns].copy()

    # Remove columns with all zeros
    non_zero_cols = [col for col in display_columns if heatmap_data[col].sum() > 0]
    heatmap_data = heatmap_data[['player_name'] + non_zero_cols]

    # Save raw values before normalization
    raw_values = heatmap_data[non_zero_cols].values.tolist()

    # Normalize if requested
    normalized_values = None
    if non_zero_cols:
        scaler = MinMaxScaler()
        heatmap_data[non_zero_cols] = scaler.fit_transform(heatmap_data[non_zero_cols])
        normalized_values = heatmap_data[non_zero_cols].values.tolist()
    else:
        normalized_values = raw_values

    response = {
        "players": heatmap_data['player_name'].tolist(),
        "stats": non_zero_cols,
        "values": raw_values,
        "normalized_values": normalized_values
    }
    return jsonify(response)


def get_player_performance_stats():
    df = current_app.config['player_performance_df']
    stat_columns = [col for col in df.columns if col != 'player_name' and pd.api.types.is_numeric_dtype(df[col])]
    return jsonify({"stats": stat_columns})