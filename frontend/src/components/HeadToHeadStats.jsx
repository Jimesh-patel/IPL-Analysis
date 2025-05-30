import React from "react";

export default function HeadToHeadStats({ data }) {
  if (!data) return null;
  const { teams, basic_stats, venue_performance } = data;
  const [team1, team2] = teams.split(" vs ");
  return (
    <div className="bg-green-50 rounded-lg p-6 mt-4 shadow w-full">
      <h2 className="text-xl font-bold text-green-700 mb-2">{teams} Head-to-Head</h2>
      <div className="grid grid-cols-2 gap-2">
        <div>Total Matches: <span className="font-semibold">{basic_stats.total_matches}</span></div>
        <div>{team1} Wins: <span className="font-semibold">{basic_stats.team1_wins} ({basic_stats.team1_win_pct}%)</span></div>
        <div>{team2} Wins: <span className="font-semibold">{basic_stats.team2_wins} ({basic_stats.team2_win_pct}%)</span></div>
        <div>No Results: <span className="font-semibold">{basic_stats.no_results}</span></div>
        <div>Leader: <span className="font-semibold">{basic_stats.head_to_head_leader}</span></div>
      </div>
      <h3 className="mt-4 font-semibold">Venue Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {venue_performance && Object.entries(venue_performance).map(([venue, stats]) => (
          <div key={venue} className="bg-white rounded p-2 shadow text-sm">
            <div className="font-bold">{venue}</div>
            <div>{team1}: {stats.team1_wins} wins ({stats.team1_win_pct}%)</div>
            <div>{team2}: {stats.team2_wins} wins ({stats.team2_win_pct}%)</div>
            <div>Leader: {stats.venue_leader}</div>
          </div>
        ))}
      </div>
    </div>
  );
}