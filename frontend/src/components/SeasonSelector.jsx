import React from "react";

export default function SeasonSelector({ seasons, selected, onChange }) {
  return (
    <div className="mb-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-transparent bg-gradient-to-r from-indigo-100/50 to-purple-100/50 transition-all duration-300 hover:shadow-2xl">
      <label
        htmlFor="season-select"
        className="block text-sm font-semibold text-gray-900 mb-2 drop-shadow-sm"
      >
        Select Season
      </label>
      <select
        id="season-select"
        className="w-full p-3 rounded-lg bg-white/95 text-gray-900 focus:ring-2 focus:ring-purple-400 border border-indigo-200/70 shadow-md hover:shadow-lg transition-all duration-300 text-sm backdrop-blur-sm"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Season</option>
        {seasons.map((season) => (
          <option key={season} value={season}>
            {season}
          </option>
        ))}
      </select>
    </div>
  );
}
