import React, { useState, useEffect, use } from "react";
import TeamSelector from "../components/TeamSelector";
import SeasonSelector from "../components/SeasonSelector";
import PerformanceCard from "../components/PerformacneCard";
import HeadToHeadStats from "../components/HeadToHeadStats";
import MatchList from "../components/MatchList";
import PlayerSeasonsCard from "../components/PlayerSeasonsCard";

// import from .env file
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Home() {
  const [analysisType, setAnalysisType] = useState("team");
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTeam2, setSelectedTeam2] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [performance, setPerformance] = useState(null);
  const [headToHead, setHeadToHead] = useState(null);
  const [matches, setMatches] = useState([]);
  const [SeasonWiseTeamSummary, setSeasonWiseTeamSummary] = useState([]);
  

  useEffect(() => {
    fetch(`${API_BASE}/teams`)
      .then((res) => res.json())
      .then((data) => setTeams(data.teams));
    fetch(`${API_BASE}/seasons`)
      .then((res) => res.json())
      .then((data) => setSeasons(data.seasons));
  }, []);

  useEffect(() => {
    if (analysisType === "team" && selectedTeam) {
      fetch(`${API_BASE}/team/${selectedTeam}/performance`)
        .then((res) => res.json())
        .then(setPerformance);

      fetch(`${API_BASE}/team/${selectedTeam}/season-summary`)
        .then((res) => res.json())
        .then(setSeasonWiseTeamSummary);
    }
  }, [analysisType, selectedTeam]);

  useEffect(() => {
    if (
      analysisType === "head" &&
      selectedTeam &&
      selectedTeam2 &&
      selectedTeam !== selectedTeam2
    ) {
      fetch(`${API_BASE}/head-to-head/${selectedTeam}/${selectedTeam2}`)
        .then((res) => res.json())
        .then(setHeadToHead);
    }
  }, [analysisType, selectedTeam, selectedTeam2]);

  useEffect(() => {
    if (analysisType === "season" && selectedSeason) {
      fetch(`${API_BASE}/season/${selectedSeason}/matches`)
        .then((res) => res.json())
        .then((data) => setMatches(data.matches || []));
    }
  }, [analysisType, selectedSeason]);


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        IPL Cricket Analysis Workshop
      </h1>
      <div className="flex justify-center gap-8 mb-8">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="team"
            checked={analysisType === "team"}
            onChange={() => setAnalysisType("team")}
            className="accent-blue-600"
          />
          <span className="font-medium">Team Performance</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="head"
            checked={analysisType === "head"}
            onChange={() => setAnalysisType("head")}
            className="accent-blue-600"
          />
          <span className="font-medium">Head-to-Head</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="season"
            checked={analysisType === "season"}
            onChange={() => setAnalysisType("season")}
            className="accent-blue-600"
          />
          <span className="font-medium">Season Matches</span>
        </label>
      </div>

      {analysisType === "team" && (
        <div>
          <TeamSelector
            teams={teams}
            selected={selectedTeam}
            onChange={setSelectedTeam}
          />
          {performance && <PerformanceCard data={performance} seasonSummary={SeasonWiseTeamSummary} />}
          {selectedTeam && <PlayerSeasonsCard selectedTeam ={selectedTeam}/>}
        </div>
      )}

      {analysisType === "head" && (
        <div className="flex flex-col md:flex-row gap-4">
          <TeamSelector
            teams={teams}
            selected={selectedTeam}
            onChange={setSelectedTeam}
            label="Team 1"
          />
          <TeamSelector
            teams={teams}
            selected={selectedTeam2}
            onChange={setSelectedTeam2}
            label="Team 2"
          />
          {headToHead && <HeadToHeadStats data={headToHead} />}
        </div>
      )}

      {analysisType === "season" && (
        <div>
          <SeasonSelector
            seasons={seasons}
            selected={selectedSeason}
            onChange={setSelectedSeason}
          />
          <MatchList matches={matches} />
        </div>
      )}
    </div>
  );
}
