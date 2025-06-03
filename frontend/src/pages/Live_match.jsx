import React, { useEffect, useState } from "react";
import RunsOverGraph from "../components/RunsOverGraph";

const Live_match = () => {
    const [liveMatches, setLiveMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

    const fetchLiveMatches = async () => {
        setLoading(true);
        try {
            const url = 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
                }
            };

            const res = await fetch(url, options);
            const data = await res.json();

            let iplMatches = [];
            if (Array.isArray(data.typeMatches)) {
                data.typeMatches.forEach(typeMatch => {
                    if (
                        typeMatch.matchType === "League" &&
                        Array.isArray(typeMatch.seriesMatches)
                    ) {
                        typeMatch.seriesMatches.forEach(series => {
                            const seriesData = series.seriesAdWrapper;
                            if (
                                seriesData &&
                                seriesData.seriesName &&
                                seriesData.seriesName.toLowerCase().includes("indian premier league 2025") &&
                                Array.isArray(seriesData.matches)
                            ) {
                                seriesData.matches.forEach(match => {
                                    console.log(match);
                                    iplMatches.push({
                                        ...match.matchInfo,
                                        matchScore: match.matchScore,
                                    });
                                });
                            }
                        });
                    }
                });
            }
            setLiveMatches(iplMatches);
        } catch (error) {
            console.error("Error fetching matches:", error);
        }
        setLoading(false);
    };

    const fetchScore = async (matchId) => {
        setLoading(true);
        try {
            const url = `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/scard`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
                }
            };

            const res = await fetch(url, options);
            const data = await res.json();
            setScore(data);
        } catch (error) {
            console.error("Error fetching score:", error);
        }
        setLoading(false);
    };

    const handleMatchSelect = (match) => {
        setSelectedMatch(match);
        fetchScore(match.matchId);
    };

    const handleRefreshScore = () => {
        if (selectedMatch) {
            fetchScore(selectedMatch.matchId);
        }
    };

    const getCurrentBatsmen = (inning) => {
        return inning.batsman?.filter(b =>
            b.outDec === "batting" || b.outDec === undefined
        ).slice(0, 2) || [];
    };

    const getCurrentBowler = (inning) => {
        return inning.bowler?.find(b => b.name && b.overs) || null;
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">🏏 IPL Live Matches</h1>

            <div className="flex gap-4 mb-6 justify-center">
                <button
                    onClick={fetchLiveMatches}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded"
                >
                    {loading ? "Loading..." : "Fetch Live Matches"}
                </button>

                {selectedMatch && (
                    <button
                        onClick={handleRefreshScore}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded"
                    >
                        {loading ? "Refreshing..." : "Refresh Score"}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {liveMatches.length === 0 ? (
                    <div className="col-span-full text-center py-4">
                        <p className="text-gray-600"> No match available. </p>
                    </div>
                ) : (
                    liveMatches.map((match) => (
                        <div
                            key={match.matchId}
                            onClick={() => handleMatchSelect(match)}
                            className={`border p-4 rounded cursor-pointer ${selectedMatch?.matchId === match.matchId
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <h3 className="font-bold text-lg">
                                {match.team1.teamName} vs {match.team2.teamName}
                            </h3>
                            <p className="text-sm text-gray-600">Status: {match.status}</p>
                            <p className="text-sm text-gray-600">Venue: {match.venueInfo?.ground || "TBA"}</p>
                        </div>
                    )))
                }
            </div>

            {selectedMatch && score && score.scorecard && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-green-700 text-white p-3 rounded-t-lg">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold">
                                {selectedMatch.team1.teamName} vs {selectedMatch.team2.teamName}
                            </h2>
                            <p className="text-sm opacity-90">{selectedMatch.venueInfo?.ground}</p>
                            <p className="text-sm opacity-90">{score.status}</p>
                        </div>
                    </div>

                    {score.scorecard.map((inning, index) => (
                        <div key={index} className="border-b border-gray-200 last:border-b-0">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg">{inning.batTeamName}</h3>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">
                                            {inning.score || 0}/{inning.wickets || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            ({inning.overs} overs)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                {getCurrentBatsmen(inning).length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-green-700 mb-2">Batting</h4>
                                        {getCurrentBatsmen(inning).map((batsman, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-center">
                                                    <span className="font-medium">{batsman.name || batsman.batName}</span>
                                                    <span className="text-green-600 text-sm ml-2">*</span>
                                                </div>
                                                <div className="flex gap-4 text-sm">
                                                    <span className="font-semibold">{batsman.runs}</span>
                                                    <span className="text-gray-600">({batsman.balls}b)</span>
                                                    <span className="text-gray-600">SR: {batsman.strkRate || batsman.strikeRate}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {getCurrentBowler(inning) && (
                                    <div>
                                        <h4 className="font-semibold text-red-700 mb-2">Bowling</h4>
                                        <div className="flex justify-between items-center py-1">
                                            <div className="flex items-center">
                                                <span className="font-medium">{getCurrentBowler(inning).name || getCurrentBowler(inning).bowlName}</span>
                                                <span className="text-red-600 text-sm ml-2">*</span>
                                            </div>
                                            <div className="flex gap-4 text-sm">
                                                <span className="text-gray-600">{getCurrentBowler(inning).overs} ov</span>
                                                <span className="text-gray-600">Econ: {getCurrentBowler(inning).economy}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {getCurrentBatsmen(inning).length === 2 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            Partnership: {
                                                Number(getCurrentBatsmen(inning)[0]?.runs || 0) +
                                                Number(getCurrentBatsmen(inning)[1]?.runs || 0)
                                            } runs
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {selectedMatch && score && score.scorecard && (
                <div className="mt-6">
                    <RunsOverGraph score={score} />
                </div>
            )}

        </div>
    );
};

export default Live_match;