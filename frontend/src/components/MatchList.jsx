import React from "react";

export default function MatchList({ matches }) {
  if (!matches || matches.length === 0) return <div className="mt-4 text-gray-500">No matches found.</div>;
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-blue-100">
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">Teams</th>
            <th className="py-2 px-3">Winner</th>
            <th className="py-2 px-3">Venue</th>
            <th className="py-2 px-3">Toss</th>
            <th className="py-2 px-3">Target Runs</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => (
            <tr key={match.match_id} className="border-b">
              <td className="py-1 px-2">{match.date}</td>
              <td className="py-1 px-2">{match.team1} vs {match.team2}</td>
              <td className="py-1 px-2">{match.winner}</td>
              <td className="py-1 px-2">{match.venue}</td>
              <td className="py-1 px-2">{match.toss_winner} ({match.toss_decision})</td>
              <td className="py-1 px-2">{match.target_runs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}