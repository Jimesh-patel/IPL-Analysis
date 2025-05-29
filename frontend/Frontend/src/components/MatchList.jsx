import React, { useEffect, useState } from 'react';

const MatchList = ({ selectedSeason }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`http://localhost:5000/season/${selectedSeason}/matches`);
                if (!response.ok) {
                    throw new Error('Failed to fetch matches');
                }
                const data = await response.json();
                setMatches(data.matches);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedSeason) {
            fetchMatches();
        }
    }, [selectedSeason]);

    if (loading) {
        return <div>Loading matches...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="match-list">
            <h2>Matches for Season {selectedSeason}</h2>
            <ul>
                {matches.map(match => (
                    <li key={match.match_id}>
                        <strong>{match.team1} vs {match.team2}</strong><br />
                        Winner: {match.winner}<br />
                        Venue: {match.venue}<br />
                        Date: {new Date(match.date).toLocaleDateString()}<br />
                        Match Type: {match.match_type}<br />
                        Toss Winner: {match.toss_winner} (Decision: {match.toss_decision})<br />
                        Target Runs: {match.target_runs}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MatchList;