import React from "react";

export default function PerformanceCard({ data }) {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mt-4 shadow">
      <h2 className="text-xl font-bold text-blue-700 mb-2">{data.team} Performance</h2>
      <div className="grid grid-cols-2 gap-2">
        <div>Total Matches: <span className="font-semibold">{data.total_matches}</span></div>
        <div>Wins: <span className="font-semibold">{data.wins}</span></div>
        <div>Losses: <span className="font-semibold">{data.losses}</span></div>
        <div>No Result: <span className="font-semibold">{data.no_result}</span></div>
        <div>Win Ratio: <span className="font-semibold">{data.win_ratio}%</span></div>
        <div>Loss Ratio: <span className="font-semibold">{data.loss_ratio}%</span></div>
        <div>Seasons Played: <span className="font-semibold">{data.seasons_played.join(", ")}</span></div>
        <div>Total Seasons: <span className="font-semibold">{data.total_seasons}</span></div>
      </div>
    </div>
  );
}