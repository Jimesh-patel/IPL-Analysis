import React from "react";

export default function HeadToHeadStats({ data }) {
  if (!data) return null;
  const { teams, basic_stats, venue_performance } = data;
  const [team1, team2] = teams.split(" vs ");

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mt-6 border border-transparent bg-gradient-to-r from-indigo-100/50 to-purple-100/50 transition-all duration-300 hover:shadow-2xl w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 drop-shadow-sm">
        {teams}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            Total Matches:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {basic_stats.total_matches}
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            {team1} Wins:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {basic_stats.team1_wins} ({basic_stats.team1_win_pct}%)
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            {team2} Wins:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {basic_stats.team2_wins} ({basic_stats.team2_win_pct}%)
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            No Results:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {basic_stats.no_results}
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            Leader:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {basic_stats.head_to_head_leader}
          </span>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4 drop-shadow-sm">
        Venue Performance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venue_performance &&
          Object.entries(venue_performance).map(([venue, stats]) => (
            <div
              key={venue}
              className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50"
            >
              <div className="font-bold text-gray-800 text-base mb-2">
                {venue}
              </div>
              <div className="text-sm text-gray-700">
                {team1}: {stats.team1_wins} wins ({stats.team1_win_pct}%)
              </div>
              <div className="text-sm text-gray-700">
                {team2}: {stats.team2_wins} wins ({stats.team2_win_pct}%)
              </div>
              <div className="text-sm text-gray-700">
                Leader: {stats.venue_leader}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
