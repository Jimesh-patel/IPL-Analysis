import React, { useEffect, useState } from "react";

const Live_match = () => {
    const [liveMatches, setLiveMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [score, setScore] = useState(null);
    const [intervalId, setIntervalId] = useState(null);

    const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

    const fetchLiveMatches = async () => {
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
            console.log("Fetched Matches:", data);

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
    };

    const fetchScore = async (matchId) => {
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
            console.log("Fetched Score:", data);
            setScore(data);
        } catch (error) {
            console.error("Error fetching score:", error);
        }
    };

    const handleMatchSelect = (match) => {
        setSelectedMatch(match);
        console.log("Selected Match:", match);
        fetchScore(match.matchId);

        if (intervalId) clearInterval(intervalId);

        const newInterval = setInterval(() => fetchScore(match.matchId), 600000);
        setIntervalId(newInterval);
    };

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    return (
        <div className="p-6 font-sans">
            <h1 className="text-3xl font-bold mb-4">🏏 IPL Live Match</h1>

            <button
                onClick={fetchLiveMatches}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded mb-6"
            >
                🔄 Fetch Live Matches
            </button>

            <div className="flex flex-wrap gap-4">
                {liveMatches.length === 0 ? (
                    <p className="text-gray-600 text-lg"> No live IPL matches found. </p>
                ) : (
                    liveMatches.map((match) => (
                        <div
                            key={match.matchId}
                            onClick={() => handleMatchSelect(match)}
                            className={`border p-4 rounded-md shadow-md cursor-pointer w-64 hover:bg-gray-100 ${selectedMatch?.matchId === match.matchId ? "bg-gray-100 border-blue-500" : "bg-white"
                                }`}
                        >
                            <h3>matchId : {match.matchId}</h3>
                            <h3 className="font-semibold text-lg">
                                {match.team1.teamName} vs {match.team2.teamName}
                            </h3>
                            <p className="text-sm text-gray-700 mt-1">
                                <strong>Status:</strong> {match.status}
                            </p>
                            {match.matchScore && match.matchScore.team1Score && (
                                <p className="text-sm text-gray-700 mt-1">
                                    <strong>Score:</strong> {match.matchScore.team1Score.inngs1?.runs}/{match.matchScore.team1Score.inngs1?.wickets} ({match.matchScore.team1Score.inngs1?.overs} ov)
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {selectedMatch && score && (
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-2">
                        🏟️ {selectedMatch.venueInfo?.ground || "Unknown Ground"}
                    </h2>
                    <h3 className="text-xl mb-2">
                        {selectedMatch.team1.teamName} vs {selectedMatch.team2.teamName}
                    </h3>
                    <p className="mb-2 text-gray-700">
                        <strong>Status:</strong> {score.status || selectedMatch.status}
                    </p>

                    {score.scorecard?.map((inning, index) => (
                        <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-bold mb-1">{inning.batTeamName}</h3>
                            <p className="text-gray-700 mb-2">
                                <strong>Score:</strong> {inning.score}/{inning.wickets} in {inning.overs} overs
                            </p>
                            <div className="mb-2">
                                <h4 className="font-semibold">🎯 Current Bowler(s)</h4>
                                {inning.bowler?.slice(0, 2).map((b) => (
                                    <p key={b.id || b.bowlId} className="text-gray-700">
                                        {b.name || b.bowlName} - {b.overs} overs, Econ: {b.economy}
                                    </p>
                                ))}
                            </div>
                            <div>
                                <h4 className="font-semibold">🧠 Current Batsmen</h4>
                                {inning.batsman?.filter(b => b.outDec === "batting" || b.outDec === undefined).slice(0, 2).map((b) => (
                                    <p key={b.id || b.batId} className="text-gray-700">
                                        {b.name || b.batName} - {b.runs} runs ({b.balls} balls), SR: {b.strkRate || b.strikeRate}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Live_match;

