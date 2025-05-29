import React from "react";

export default function SeasonSelector({ seasons, selected, onChange }) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Season:</label>
      <select
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={selected}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select Season</option>
        {seasons.map(season => (
          <option key={season} value={season}>{season}</option>
        ))}
      </select>
    </div>
  );
}