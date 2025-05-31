import React, { useState, useEffect } from 'react';

const PlayerPerformanceHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState(null);
  const [statsData, setStatsData] = useState([]);
  const [selectedStat, setSelectedStat] = useState('');
  const [topN, setTopN] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats for dropdown options
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/player-performance/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStatsData(data.stats || []);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load stats options');
      }
    };
    fetchStats();
  }, []);

  // Fetch heatmap data
  useEffect(() => {
    const fetchHeatmapData = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5000/player-performance/heatmap?top_n=${topN}`;
        if (selectedStat) {
          url += `&sort_by=${selectedStat}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch heatmap data');
        const data = await response.json();
        setHeatmapData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching heatmap data:', err);
        setError('Failed to load heatmap data');
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [selectedStat, topN]);

  // Get all metrics from the stats array
  const getMetrics = () => {
    if (!heatmapData || !heatmapData.stats) return [];
    return heatmapData.stats;
  };

  // Get normalized value for display (already normalized in API response)
  const getNormalizedValue = (playerIndex, metricIndex) => {
    if (!heatmapData || !heatmapData.normalized_values) return 0;
    return heatmapData.normalized_values[playerIndex]?.[metricIndex] || 0;
  };

  // Get actual value for tooltip
  const getActualValue = (playerIndex, metricIndex) => {
    if (!heatmapData || !heatmapData.values) return 0;
    return heatmapData.values[playerIndex]?.[metricIndex] || 0;
  };

  // Get color based on normalized value
  const getColor = (normalizedValue) => {
    if (normalizedValue == null) return '#f0f0f0';
    
    // Color scale from blue (0) to red (1)
    const colors = [
      '#08306b', '#08519c', '#2171b5', '#4292c6', '#6baed6',
      '#9ecae1', '#c6dbef', '#deebf7', '#fee0d2', '#fcbba1',
      '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'
    ];
    
    const index = Math.floor(normalizedValue * (colors.length - 1));
    return colors[index];
  };

  // Format metric names for display
  const formatMetricName = (metric) => {
    return metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const metrics = getMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading heatmap data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🏏</span>
        <h2 className="text-xl font-semibold text-gray-800">
          Player Performance Heatmap (Normalized 0-1) 
          {selectedStat && ` (Sorted by ${formatMetricName(selectedStat)})`}
        </h2>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Sort By:</label>
          <select
            value={selectedStat}
            onChange={(e) => setSelectedStat(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-48"
          >
            <option value="">Overall Performance</option>
            {statsData.map((stat, index) => (
              <option key={index} value={stat}>
                {formatMetricName(stat)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Top Players:</label>
          <select
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
            <option value={20}>Top 20</option>
          </select>
        </div>
      </div>

      {/* Heatmap */}
      {heatmapData && heatmapData.players && heatmapData.players.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 font-medium text-gray-700  border border-gray-200 min-w-32">
                    Player (Top to Bottom)
                  </th>
                  {metrics.map((metric, index) => (
                    <th
                      key={index}
                      className="text-sm p-2 font-medium text-gray-800 border border-gray-200 min-w-20"
                      style={{ height: '80px' }}
                    >
                      <div className="whitespace-nowrap text-xs">
                        {formatMetricName(metric)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.players.map((player, playerIndex) => (
                  <tr key={playerIndex}>
                    <td className="p-2 font-medium text-gray-800 border border-gray-200 text-sm">
                      {player}
                    </td>
                    {metrics.map((metric, metricIndex) => {
                      const normalizedValue = getNormalizedValue(playerIndex, metricIndex);
                      const actualValue = getActualValue(playerIndex, metricIndex);
                      return (
                        <td
                          key={metricIndex}
                          className="border border-gray-200 relative group cursor-pointer"
                          style={{
                            backgroundColor: getColor(normalizedValue),
                            width: '40px',
                            height: '25px'
                          }}
                          title={`${player} - ${formatMetricName(metric)}: ${actualValue}`}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            <div className="font-semibold">{player}</div>
                            <div>{formatMetricName(metric)}</div>
                            <div>Normalized: {normalizedValue.toFixed(3)}</div>
                            <div>Value: {actualValue}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}

      {/* Color Legend */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Color Scale:</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-600">0</span>
          <div className="flex">
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                className="w-4 h-4 border border-gray-300"
                style={{
                  backgroundColor: getColor(i / 15)
                }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">1</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Players:</span> {heatmapData?.players?.length || 0}
          </div>
          <div>
            <span className="font-medium">Metrics:</span> {metrics.length}
          </div>
          <div>
            <span className="font-medium">Sort By:</span> {selectedStat ? formatMetricName(selectedStat) : 'Overall Performance'}
          </div>
          <div>
            <span className="font-medium">Display:</span> Top {topN}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPerformanceHeatmap;