import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LiveCricketPredictor = () => {
    const [liveMatches, setLiveMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [matchDetails, setMatchDetails] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [predictionLoading, setPredictionLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);

    // Mock API base - replace with your actual prediction API
    const API_BASE = 'http://localhost:8000'; // Replace with your API URL

    const fetchLiveMatches = async () => {
        setLoading(true);
        try {
            const url = 'https://cricket-api17.p.rapidapi.com/api/v2/getHome';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '2625c83700mshcaab051baeefc3cp13512cjsn87b64c3021a2',
                    'x-rapidapi-host': 'cricket-api17.p.rapidapi.com'
                }
            };

            const res = await fetch(url, options);
            const data = await res.json();
            
            // Filter live matches
            const live = data.matches?.filter(match => 
                match.status === 'Live' || match.status === 'In Progress'
            ) || [];
            
            setLiveMatches(live);
        } catch (error) {
            console.error("Error fetching matches:", error);
            // Mock data for demonstration
            setLiveMatches([
                {
                    matchId: 'demo-match-1',
                    team1: { teamName: 'Mumbai Indians' },
                    team2: { teamName: 'Chennai Super Kings' },
                    status: 'Live',
                    venue: 'Wankhede Stadium'
                }
            ]);
        }
        setLoading(false);
    };

    const fetchMatchDetails = async (matchId) => {
        setLoading(true);
        try {
            const url = `https://cricket-api17.p.rapidapi.com/api/v2/getMatchDetails?matchId=${matchId}`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '2625c83700mshcaab051baeefc3cp13512cjsn87b64c3021a2',
                    'x-rapidapi-host': 'cricket-api17.p.rapidapi.com'
                }
            };
            
            const res = await fetch(url, options);
            const data = await res.json();
            setMatchDetails(data);
            
            // Process match data for prediction
            await processBallByBallData(data);
            
        } catch (error) {
            console.error("Error fetching match details:", error);
            // Generate mock match details for demonstration
            generateMockMatchData();
        }
        setLoading(false);
    };

    const generateMockMatchData = () => {
        const mockData = {
            matchId: 'demo-match-1',
            team1: { teamName: 'Mumbai Indians' },
            team2: { teamName: 'Chennai Super Kings' },
            innings: [
                {
                    inningNumber: 1,
                    battingTeam: 'Mumbai Indians',
                    bowlingTeam: 'Chennai Super Kings',
                    overs: generateMockOvers(12), // 12 overs completed
                    totalRuns: 98,
                    totalWickets: 3,
                    currentBatsmen: [
                        { name: 'Rohit Sharma', runs: 45, balls: 32 },
                        { name: 'Ishan Kishan', runs: 23, balls: 18 }
                    ],
                    currentBowler: { name: 'Ravindra Jadeja', overs: 2.4, runs: 18, wickets: 1 }
                }
            ]
        };
        setMatchDetails(mockData);
        processBallByBallData(mockData);
    };

    const generateMockOvers = (numOvers) => {
        const overs = [];
        let cumRuns = 0;
        let cumWickets = 0;
        
        for (let i = 0; i < numOvers; i++) {
            const runs = Math.floor(Math.random() * 18) + 2; // 2-20 runs per over
            const wickets = Math.random() < 0.3 ? 1 : 0; // 30% chance of wicket
            cumRuns += runs;
            cumWickets += wickets;
            
            overs.push({
                overNumber: i + 1,
                runs: runs,
                wickets: wickets,
                cumRuns: cumRuns,
                cumWickets: cumWickets,
                balls: [
                    { runs: Math.floor(Math.random() * 7) },
                    { runs: Math.floor(Math.random() * 7) },
                    { runs: Math.floor(Math.random() * 7) },
                    { runs: Math.floor(Math.random() * 7) },
                    { runs: Math.floor(Math.random() * 7) },
                    { runs: Math.floor(Math.random() * 7) }
                ]
            });
        }
        return overs;
    };

    const processBallByBallData = async (matchData) => {
        if (!matchData.innings || matchData.innings.length === 0) return;
        
        const currentInning = matchData.innings[0];
        const overs = currentInning.overs || [];
        
        if (overs.length < 6) return; // Need at least 6 overs for prediction
        
        // Prepare data for each over prediction
        const overPredictions = [];
        
        for (let i = 5; i < overs.length; i++) { // Start from 6th over
            const lastOvers = overs.slice(Math.max(0, i - 5), i); // Last 5 overs
            const currentOver = overs[i];
            
            const predictionData = preparePredictionData(lastOvers, currentOver, i + 1);
            
            try {
                const prediction = await predictNextOverRuns(predictionData);
                overPredictions.push({
                    overNumber: i + 1,
                    actualRuns: currentOver.runs,
                    predictedRuns: prediction.predicted_runs,
                    confidence: prediction.confidence || 0.75
                });
            } catch (error) {
                console.error(`Error predicting over ${i + 1}:`, error);
                // Add mock prediction
                overPredictions.push({
                    overNumber: i + 1,
                    actualRuns: currentOver.runs,
                    predictedRuns: Math.floor(Math.random() * 15) + 5,
                    confidence: 0.65
                });
            }
        }
        
        // Predict next over (current over + 1)
        if (overs.length >= 6) {
            const lastOversForNext = overs.slice(-5);
            const nextOverNumber = overs.length + 1;
            const nextPredictionData = preparePredictionData(lastOversForNext, null, nextOverNumber);
            
            try {
                const nextPrediction = await predictNextOverRuns(nextPredictionData);
                overPredictions.push({
                    overNumber: nextOverNumber,
                    actualRuns: null,
                    predictedRuns: nextPrediction.predicted_runs,
                    confidence: nextPrediction.confidence || 0.75,
                    isNext: true
                });
            } catch (error) {
                console.error('Error predicting next over:', error);
                overPredictions.push({
                    overNumber: nextOverNumber,
                    actualRuns: null,
                    predictedRuns: Math.floor(Math.random() * 15) + 5,
                    confidence: 0.65,
                    isNext: true
                });
            }
        }
        
        setPredictions(overPredictions);
    };

    const preparePredictionData = (lastOvers, currentOver, overNumber) => {
        // Calculate cumulative stats
        let cumRuns = 0;
        let cumWickets = 0;
        
        lastOvers.forEach(over => {
            cumRuns += over.runs || 0;
            cumWickets += over.wickets || 0;
        });
        
        if (currentOver) {
            cumRuns += currentOver.runs || 0;
            cumWickets += currentOver.wickets || 0;
        }
        
        const runRate = cumRuns / Math.max(overNumber - 1, 1);
        
        return {
            last_overs: lastOvers.map(over => ({
                total_runs: Number(over.runs) || 0,
                wickets: Number(over.wickets) || 0,
            })),
            metadata: {
                cum_runs: cumRuns,
                cum_wickets: cumWickets,
                bowler_economy: cumRuns / Math.max(overNumber - 1, 1),
                over_number: overNumber,
                cum_run_rate: runRate,
                partnership: Math.floor(Math.random() * 50) + 10, // Mock partnership
            }
        };
    };

    const predictNextOverRuns = async (predictionData) => {
        setPredictionLoading(true);
        try {
            // Replace with your actual API endpoint
            const res = await fetch(`${API_BASE}/predict-runs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(predictionData),
            });

            if (!res.ok) throw new Error('Prediction failed');
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Prediction API error:', error);
            // Return mock prediction
            return {
                predicted_runs: Math.floor(Math.random() * 15) + 5,
                confidence: 0.65 + Math.random() * 0.25
            };
        } finally {
            setPredictionLoading(false);
        }
    };

    const handleMatchSelect = (match) => {
        setSelectedMatch(match);
        fetchMatchDetails(match.matchId);
    };

    const handleRefresh = () => {
        if (selectedMatch) {
            fetchMatchDetails(selectedMatch.matchId);
        }
    };

    // Auto refresh functionality
    useEffect(() => {
        let interval;
        if (autoRefresh && selectedMatch) {
            interval = setInterval(() => {
                fetchMatchDetails(selectedMatch.matchId);
            }, 30000); // Refresh every 30 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh, selectedMatch]);

    const chartData = predictions.map(p => ({
        over: p.overNumber,
        actual: p.actualRuns,
        predicted: p.predictedRuns,
        confidence: (p.confidence * 100).toFixed(1)
    }));

    const nextOverPrediction = predictions.find(p => p.isNext);

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">
                🏏 Live IPL Match Predictor
            </h1>

            {/* Controls */}
            <div className="flex gap-4 mb-6 justify-center flex-wrap">
                <button
                    onClick={fetchLiveMatches}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded"
                >
                    {loading ? "Loading..." : "Fetch Live Matches"}
                </button>

                {selectedMatch && (
                    <>
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded"
                        >
                            {loading ? "Refreshing..." : "Refresh Data"}
                        </button>
                        
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="rounded"
                            />
                            Auto Refresh (30s)
                        </label>
                    </>
                )}
            </div>

            {/* Live Matches */}
            {liveMatches.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Live matches:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {liveMatches.map((match) => (
                            <div
                                key={match.matchId}
                                onClick={() => handleMatchSelect(match)}
                                className={`border p-4 rounded cursor-pointer transition-all ${
                                    selectedMatch?.matchId === match.matchId
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                <h3 className="font-bold text-lg">
                                    {match.team1.teamName} vs {match.team2.teamName}
                                </h3>
                                <p className="text-sm text-gray-600">{match.venue}</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                    {match.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Next Over Prediction */}
            {nextOverPrediction && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2 text-green-800">
                        🔮 Next Over Prediction
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-blue-600">
                            Over {nextOverPrediction.overNumber}: {nextOverPrediction.predictedRuns} runs
                        </div>
                        <div className="text-sm text-gray-600">
                            Confidence: {(nextOverPrediction.confidence * 100).toFixed(1)}%
                        </div>
                        {predictionLoading && (
                            <div className="text-sm text-orange-600">Updating...</div>
                        )}
                    </div>
                </div>
            )}

            {/* Match Details */}
            {matchDetails && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Match Details</h2>
                    {matchDetails.innings?.map((inning, idx) => (
                        <div key={idx} className="mb-4">
                            <h3 className="font-semibold text-lg">
                                {inning.battingTeam} - {inning.totalRuns}/{inning.totalWickets}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Overs: {inning.overs?.length || 0} | 
                                Run Rate: {((inning.totalRuns || 0) / Math.max(inning.overs?.length || 1, 1)).toFixed(2)}
                            </p>
                            {inning.currentBatsmen && (
                                <div className="mt-2 text-sm">
                                    <strong>Batsmen:</strong> {inning.currentBatsmen.map(b => 
                                        `${b.name} (${b.runs}* off ${b.balls})`
                                    ).join(', ')}
                                </div>
                            )}
                            {inning.currentBowler && (
                                <div className="text-sm">
                                    <strong>Bowler:</strong> {inning.currentBowler.name} 
                                    ({inning.currentBowler.overs}-{inning.currentBowler.runs}-{inning.currentBowler.wickets})
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Predictions Chart */}
            {predictions.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Predictions vs Actual</h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="over" />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value, name) => [
                                        name === 'predicted' ? `${value} runs` : `${value} runs`,
                                        name === 'predicted' ? 'Predicted' : 'Actual'
                                    ]}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="actual" 
                                    stroke="#8884d8" 
                                    strokeWidth={2}
                                    name="Actual Runs"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="predicted" 
                                    stroke="#82ca9d" 
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    name="Predicted Runs"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Predictions Table */}
            {predictions.length > 0 && (
                <div className="overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-3">Detailed Predictions</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Over</th>
                                <th className="border border-gray-300 px-4 py-2">Predicted Runs</th>
                                <th className="border border-gray-300 px-4 py-2">Actual Runs</th>
                                <th className="border border-gray-300 px-4 py-2">Accuracy</th>
                                <th className="border border-gray-300 px-4 py-2">Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {predictions.map((pred) => (
                                <tr 
                                    key={pred.overNumber} 
                                    className={pred.isNext ? "bg-yellow-50" : ""}
                                >
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {pred.overNumber} {pred.isNext && "(Next)"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {pred.predictedRuns}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {pred.actualRuns || "TBD"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {pred.actualRuns 
                                            ? `${Math.abs(pred.predictedRuns - pred.actualRuns)} diff` 
                                            : "TBD"
                                        }
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {(pred.confidence * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {liveMatches.length === 0 && !loading && (
                <div className="text-center py-8">
                    <p className="text-gray-600">No live matches available. Click "Fetch Live Matches" to check for updates.</p>
                </div>
            )}
        </div>
    );
};

export default LiveCricketPredictor;