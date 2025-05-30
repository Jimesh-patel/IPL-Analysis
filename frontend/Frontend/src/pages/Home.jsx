import React, { useState, useEffect } from 'react';
import TeamSelector from '../components/TeamSelector';
import SeasonSelector from '../components/SeasonSelector';
import MatchList from '../components/MatchList';
import HeadToHeadStats from '../components/HeadToHeadStats';
import PerformanceCard from '../components/PerformanceCard';
import './cricket-theme.css';

const Home = () => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [matches, setMatches] = useState([]);
    const [headToHead, setHeadToHead] = useState(null);
    const [performance, setPerformance] = useState(null);

    const fetchMatches = async (season) => {
        if (season) {
            const response = await fetch(`http://localhost:5000/season/${season}/matches`);
            const data = await response.json();
            setMatches(data.matches);
        }
    };

    const fetchPerformance = async (team) => {
        if (team) {
            const response = await fetch(`http://localhost:5000/team/${team}/performance`);
            const data = await response.json();
            setPerformance(data);
        }
    };

    const fetchHeadToHead = async (team1, team2) => {
        if (team1 && team2) {
            const response = await fetch(`http://localhost:5000/head-to-head/${team1}/${team2}`);
            const data = await response.json();
            setHeadToHead(data);
        }
    };

    useEffect(() => {
        fetchMatches(selectedSeason);
    }, [selectedSeason]);

    useEffect(() => {
        fetchPerformance(selectedTeam);
    }, [selectedTeam]);

    return (
        <div className="home-container">
            <h1>Cricket Analysis</h1>
            <TeamSelector onTeamSelect={setSelectedTeam} />
            <SeasonSelector onSeasonSelect={setSelectedSeason} />
            {selectedTeam && <PerformanceCard performance={performance} />}
            {selectedSeason && <MatchList matches={matches} />}
            {selectedTeam && (
                <div>
                    <h2>Head-to-Head Stats</h2>
                    <TeamSelector onTeamSelect={(team) => fetchHeadToHead(selectedTeam, team)} />
                    {headToHead && <HeadToHeadStats stats={headToHead} />}
                </div>
            )}
        </div>
    );
};

export default Home;