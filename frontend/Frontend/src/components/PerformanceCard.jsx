import React from 'react';

const PerformanceCard = ({ performanceData }) => {
    if (!performanceData) {
        return <div>Loading...</div>;
    }

    const {
        team,
        total_matches,
        wins,
        losses,
        no_result,
        win_ratio,
        loss_ratio,
        seasons_played,
        total_seasons
    } = performanceData;

    return (
        <div className="performance-card">
            <h2>{team} Performance</h2>
            <p>Total Matches: {total_matches}</p>
            <p>Wins: {wins}</p>
            <p>Losses: {losses}</p>
            <p>No Result: {no_result}</p>
            <p>Win Ratio: {win_ratio}%</p>
            <p>Loss Ratio: {loss_ratio}%</p>
            <p>Seasons Played: {seasons_played.join(', ')}</p>
            <p>Total Seasons: {total_seasons}</p>
        </div>
    );
};

export default PerformanceCard;