import pandas as pd
from typing import Dict, Any
from services import data_loader

class HeadToHeadAnalyzer:
    def get_head_to_head_matches(self, matches_df, team1: str, team2: str) -> pd.DataFrame:
        h2h_matches = matches_df[
            ((matches_df['team1'] == team1) & (matches_df['team2'] == team2)) |
            ((matches_df['team1'] == team2) & (matches_df['team2'] == team1))
        ].copy()
        return h2h_matches.sort_values('date' if 'date' in h2h_matches.columns else 'season')

    def analyze_basic_h2h_stats(self, matches_df, team1: str, team2: str) -> Dict[str, Any]:
        h2h_matches = self.get_head_to_head_matches(matches_df, team1, team2)

        if h2h_matches.empty:
            return {'error': f'No matches found between {team1} and {team2}'}

        total_matches = len(h2h_matches)
        team1_wins = len(h2h_matches[h2h_matches['winner'] == team1])
        team2_wins = len(h2h_matches[h2h_matches['winner'] == team2])
        no_results = total_matches - team1_wins - team2_wins

        team1_win_pct = (team1_wins / total_matches * 100) if total_matches > 0 else 0
        team2_win_pct = (team2_wins / total_matches * 100) if total_matches > 0 else 0

        return {
            'total_matches': total_matches,
            'team1_wins': team1_wins,
            'team2_wins': team2_wins,
            'no_results': no_results,
            'team1_win_pct': round(team1_win_pct, 2),
            'team2_win_pct': round(team2_win_pct, 2),
            'head_to_head_leader': team1 if team1_wins > team2_wins else team2 if team2_wins > team1_wins else 'Tied'
        }

    def analyze_venue_performance(self, matches_df, team1: str, team2: str) -> Dict[str, Any]:
        h2h_matches = self.get_head_to_head_matches(matches_df, team1, team2)

        if h2h_matches.empty:
            return {'error': 'No matches found'}

        venue_stats = {}
        venues = h2h_matches['venue'].value_counts()

        for venue in venues.index:
            venue_matches = h2h_matches[h2h_matches['venue'] == venue]
            team1_wins = len(venue_matches[venue_matches['winner'] == team1])
            team2_wins = len(venue_matches[venue_matches['winner'] == team2])
            total = len(venue_matches)

            venue_stats[venue] = {
                'total_matches': total,
                'team1_wins': team1_wins,
                'team2_wins': team2_wins,
                'team1_win_pct': round((team1_wins/total)*100, 2) if total > 0 else 0,
                'team2_win_pct': round((team2_wins/total)*100, 2) if total > 0 else 0,
                'venue_leader': team1 if team1_wins > team2_wins else team2 if team2_wins > team1_wins else 'Tied'
            }

        return venue_stats

    def get_h2h_analysis(self, team1: str, team2: str) -> Dict[str, Any]:
        matches_df = data_loader.matches_df
        return {
            'teams': f"{team1} vs {team2}",
            'basic_stats': self.analyze_basic_h2h_stats(matches_df, team1, team2),
            'venue_performance': self.analyze_venue_performance(matches_df, team1, team2)
        }