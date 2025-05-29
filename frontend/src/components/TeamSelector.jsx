import React from "react";

export default function TeamSelector({ teams, selected, onChange, label = "Team" }) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{label}:</label>
      <select
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={selected}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {teams.map(team => (
          <option key={team} value={team}>{team}</option>
        ))}
      </select>
    </div>
  );
}