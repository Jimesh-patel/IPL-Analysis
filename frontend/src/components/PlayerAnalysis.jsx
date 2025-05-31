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
      if(selectedRole=="batsman"){
      fetch(`${API_BASE}/batsman/${selectedPlayer}`)
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
        .finally(() => setLoading(false));}

        else if (selectedRole == "bowler") {
          fetch(`${API_BASE}/bowler/${selectedPlayer}`)
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
        }

    } else {
      setAnalysisData(null);
      setError(null);
    }
  }, [selectedPlayer, selectedRole]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-6">
        Player Performance Analysis
      </h1>

      <Player_Heatmap />

      {/* Player and Role Selection */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label
            htmlFor="player-select"
            className="block text-sm font-medium text-gray-700"
          >
            Select Player
          </label>
          <select
            id="player-select"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="">-- Select a Player --</option>
            {players.map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label
            htmlFor="role-select"
            className="block text-sm font-medium text-gray-700"
          >
            Select Role
          </label>
          <select
            id="role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="batsman">Batsman</option>
            <option value="bowler">Bowler</option>
          </select>
        </div>
      </div>

      {/* Error and Loading States */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-gray-600 text-center mb-4">Loading...</p>}

      {/* Analysis Display */}
      {analysisData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedRole === "batsman" ? "Batting" : "Bowling"} Analysis:{" "}
            {analysisData[selectedRole === "batsman" ? "Batsman" : "Bowler"]}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(analysisData).map(
              ([key, value]) =>
                key !== (selectedRole === "batsman" ? "Batsman" : "Bowler") && (
                  <div
                    key={key}
                    className="border-b sm:border-b-0 sm:border-r border-gray-200 pb-2 sm:pb-0 sm:pr-4"
                  >
                    <span className="text-sm font-medium text-gray-600">
                      {key}:
                    </span>
                    <span className="ml-2 text-sm text-gray-800">{value}</span>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerAnalysis;
