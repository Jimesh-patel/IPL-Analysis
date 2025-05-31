import React, { useState, useEffect } from "react";
import Player_Heatmap from "./Player_Heatmap";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const PlayerAnalysis = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedRole, setSelectedRole] = useState("batsman");
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch players (unique batters and bowlers)
  useEffect(() => {
    fetch(`${API_BASE}/players`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch players: ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log("Players data:", data); // For debugging
        setPlayers(data.players || []);
      })
      .catch((err) => {
        setError("Failed to load players");
        console.error("Error fetching players:", err);
      });
  }, []);

  // Fetch analysis when player and role are selected
  useEffect(() => {
    if (selectedPlayer && selectedRole) {
      setLoading(true);
      const endpoint =
        selectedRole === "batsman"
          ? `${API_BASE}/batsman/${selectedPlayer}`
          : `${API_BASE}/bowler/${selectedPlayer}`;
      fetch(endpoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch analysis: ${response.status} ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log("Analysis data:", data); // For debugging
          setAnalysisData(data);
          setError(null);
        })
        .catch((err) => {
          setError(
            `Failed to load analysis for ${selectedPlayer} as ${selectedRole}`
          );
          setAnalysisData(null);
          console.error("Error fetching analysis:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setAnalysisData(null);
      setError(null);
    }
  }, [selectedPlayer, selectedRole]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 tracking-tight drop-shadow-lg">
          Player Performance Analysis
        </h1>

        {/* Heatmap Section */}
        <div className="mb-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-transparent bg-gradient-to-r from-indigo-100/50 to-purple-100/50">
          <Player_Heatmap />
        </div>

        {/* Player and Role Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="relative">
            <label
              htmlFor="player-select"
              className="block text-sm font-semibold text-white mb-2 drop-shadow-sm"
            >
              Select Player
            </label>
            <select
              id="player-select"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/90 text-gray-900 focus:ring-2 focus:ring-purple-400 border border-indigo-300/50 shadow-sm hover:shadow-lg transition-all duration-300 text-sm backdrop-blur-sm"
            >
              <option value="">-- Select a Player --</option>
              {players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label
              htmlFor="role-select"
              className="block text-sm font-semibold text-white mb-2 drop-shadow-sm"
            >
              Select Role
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/90 text-gray-900 focus:ring-2 focus:ring-purple-400 border border-indigo-300/50 shadow-sm hover:shadow-lg transition-all duration-300 text-sm backdrop-blur-sm"
            >
              <option value="batsman">Batsman</option>
              <option value="bowler">Bowler</option>
            </select>
          </div>
        </div>

        {/* Error and Loading States */}
        {error && (
          <div className="mb-6 p-4 bg-red-200/90 text-red-800 rounded-lg text-center font-medium backdrop-blur-sm shadow-md">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-6 p-4 bg-blue-200/90 text-blue-800 rounded-lg text-center font-medium flex items-center justify-center backdrop-blur-sm shadow-md">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-blue-800"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Loading...
          </div>
        )}

        {/* Analysis Display */}
        {analysisData && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-transparent bg-gradient-to-r from-indigo-100/50 to-purple-100/50">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 drop-shadow-sm">
              {selectedRole === "batsman" ? "Batting" : "Bowling"} Analysis:{" "}
              {analysisData[selectedRole === "batsman" ? "Batsman" : "Bowler"]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(analysisData).map(
                ([key, value]) =>
                  key !==
                    (selectedRole === "batsman" ? "Batsman" : "Bowler") && (
                    <div
                      key={key}
                      className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-indigo-200/50"
                    >
                      <span className="block text-sm font-semibold text-gray-700 capitalize drop-shadow-sm">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="block text-lg font-medium text-indigo-900">
                        {value}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerAnalysis;
