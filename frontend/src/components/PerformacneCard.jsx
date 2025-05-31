import React from "react";

export default function PerformanceCard({ data, seasonSummary }) {
  console.log("data:", seasonSummary);

  const summaryArr = seasonSummary?.season_summaries
    ? Object.values(seasonSummary.season_summaries)
    : [];

  const champions = summaryArr.filter((s) => s.champion === true).length || 0;
  const runnerUps = summaryArr.filter((s) => s.runner_up === true).length || 0;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mt-6 border border-transparent bg-gradient-to-r from-indigo-100/50 to-purple-100/50 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 drop-shadow-sm">
        {data.team} Performance
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            Total Seasons:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {data.total_seasons}
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            Total Matches:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {data.total_matches}
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            Wins:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {data.wins}
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            Losses:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {data.losses}
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            No Result:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {data.no_result}
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            Win Ratio:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {data.win_ratio}%
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            Championships 🏆:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {champions}
          </span>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50">
          <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
            Runner-up 🥈:
          </span>
          <span className="block text-lg font-medium text-indigo-900">
            {runnerUps}
          </span>
        </div>
      </div>
    </div>
  );
}
