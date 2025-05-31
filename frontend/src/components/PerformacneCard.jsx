import React from "react";

export default function PerformanceCard({ data, seasonSummary }) {
  console.log("data:", seasonSummary);

  const summaryArr = seasonSummary?.season_summaries
    ? Object.values(seasonSummary.season_summaries)
    : [];

  const champions = summaryArr.filter((s) => s.champion === true).length || 0;
  const runnerUps = summaryArr.filter((s) => s.runner_up === true).length || 0;

  return (
    <div className="bg-blue-50 rounded-lg p-6 mt-4 shadow">
      <h2 className="text-xl font-bold text-blue-700 mb-2">{data.team} Performance</h2>
      <div className="grid grid-cols-2 gap-2">
        
        <div>Total Seasons : <span className="font-semibold">{data.total_seasons}</span></div>
        <div>Total Matches : <span className="font-semibold">{data.total_matches}</span></div>
        <div>Wins : <span className="font-semibold">{data.wins}</span></div>
        <div>Losses : <span className="font-semibold">{data.losses}</span></div>
        <div>No Result : <span className="font-semibold">{data.no_result}</span></div>
        <div>Win Ratio : <span className="font-semibold">{data.win_ratio}%</span></div>
        <div>Championships 🏆 :  <span className="font-semibold">{champions}</span></div>
        <div>Runner-up 🥈 :  <span className="font-semibold">{runnerUps}</span></div>
      </div>
    </div>
  );
}
