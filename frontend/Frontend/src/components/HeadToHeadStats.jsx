import React, { useEffect, useState } from 'react';

const HeadToHeadStats = ({ team1, team2 }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeadToHeadStats = async () => {
            try {
                const response = await fetch(`http://localhost:5000/head-to-head/${team1}/${team2}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (team1 && team2) {
            fetchHeadToHeadStats();
        }
    }, [team1, team2]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="head-to-head-stats">
            <h2>Head-to-Head: {stats.teams}</h2>
            <div className="basic-stats">
                <h3>Basic Stats</h3>
                <p>Total Matches: {stats.basic_stats.total_matches}</p>
                <p>{team1} Wins: {stats.basic_stats.team1_wins}</p>
                <p>{team2} Wins: {stats.basic_stats.team2_wins}</p>
                <p>No Results: {stats.basic_stats.no_results}</p>
                <p>{team1} Win Percentage: {stats.basic_stats.team1_win_pct}%</p>
                <p>{team2} Win Percentage: {stats.basic_stats.team2_win_pct}%</p>
                <p>Head-to-Head Leader: {stats.basic_stats.head_to_head_leader}</p>
            </div>
            <div className="venue-performance">
                <h3>Venue Performance</h3>
                {Object.entries(stats.venue_performance).map(([venue, performance]) => (
                    <div key={venue}>
                        <h4>{venue}</h4>
                        <p>Total Matches: {performance.total_matches}</p>
                        <p>{team1} Wins: {performance.team1_wins}</p>
                        <p>{team2} Wins: {performance.team2_wins}</p>
                        <p>{team1} Win Percentage: {performance.team1_win_pct}%</p>
                        <p>{team2} Win Percentage: {performance.team2_win_pct}%</p>
                        <p>Venue Leader: {performance.venue_leader}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeadToHeadStats;