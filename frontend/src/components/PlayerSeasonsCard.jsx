import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const PlayerSeasonsCard = ({ selectedTeam }) => {
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedTeam) {
      fetch(`${API_BASE}/team/${selectedTeam}/players`)
        .then((res) => res.json())
        .then((data) => setPlayerData(data))
        .catch((err) => {
          setError(`Failed to load data for ${selectedTeam}`);
          setPlayerData(null);
          console.error(err);
        });
    } else {
      setPlayerData(null); // Clear data when no team is selected
      setError(null);
    }
  }, [selectedTeam]);

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-200/90 text-red-800 rounded-lg text-center font-medium backdrop-blur-sm shadow-md">
        {error}
      </div>
    );
  }

  if (!playerData || !selectedTeam) {
    return (
      <h2 className="text-2xl font-bold text-gray-900 mb-4 drop-shadow-sm">
        Players
      </h2>
    );
  }

  return (
    <div className="mt-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-transparent bg-gradient-to-r from-indigo-100/50 to-purple-100/50 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 drop-shadow-sm">
        {playerData.team} Players
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 drop-shadow-sm">
                Player
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 drop-shadow-sm">
                Seasons
              </th>
            </tr>
          </thead>
          <tbody>
            {playerData.players && playerData.players.length > 0 ? (
              playerData.players.map((player, index) => (
                <tr
                  key={index}
                  className="border-b border-indigo-200/50 hover:bg-indigo-50/50 transition-all duration-200"
                >
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {player.player}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {player.seasons.join(", ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="py-4 px-4 text-center text-sm text-gray-600 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-lg"
                >
                  No players found for {selectedTeam}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerSeasonsCard;
