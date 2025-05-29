import React, { useEffect, useState } from 'react';

const SeasonSelector = ({ onSeasonSelect }) => {
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState('');

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch('http://localhost:5000/seasons');
                const data = await response.json();
                setSeasons(data.seasons);
            } catch (error) {
                console.error('Error fetching seasons:', error);
            }
        };

        fetchSeasons();
    }, []);

    const handleSeasonChange = (event) => {
        setSelectedSeason(event.target.value);
        onSeasonSelect(event.target.value);
    };

    return (
        <div className="season-selector">
            <h2>Select a Season</h2>
            {seasons.map((season) => (
                <div key={season}>
                    <label>
                        <input
                            type="radio"
                            value={season}
                            checked={selectedSeason === season}
                            onChange={handleSeasonChange}
                        />
                        {season}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default SeasonSelector;