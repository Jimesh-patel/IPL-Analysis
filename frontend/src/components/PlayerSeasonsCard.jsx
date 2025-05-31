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
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!playerData || !selectedTeam) {
    return (
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
        Players
      </h2>
    ); // Don't render anything if no team is selected or data is loading
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
        {playerData.team} Players
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-1 sm:py-2 px-2 sm:px-4 border-b text-left text-xs sm:text-sm font-medium text-gray-700">
                Player
              </th>
              <th className="py-1 sm:py-2 px-2 sm:px-4 border-b text-left text-xs sm:text-sm font-medium text-gray-700">
                Seasons
              </th>
            </tr>
          </thead>
          <tbody>
            {playerData.players && playerData.players.length > 0 ? (
              playerData.players.map((player, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-1 sm:py-2 px-2 sm:px-4 border-b text-xs sm:text-sm text-gray-800">
                    {player.player}
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4 border-b text-xs sm:text-sm text-gray-800">
                    {player.seasons.join(", ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="py-2 px-4 text-center text-sm text-gray-600"
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
