import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RunsOverGraph = ({ score }) => {
    console.log("score:", score);
    if (!score || !score.scorecard) return null;
    const innings = score.scorecard;

    const datasets = innings.map((inning, idx) => {
        let overRuns = [];
        if (Array.isArray(inning.overs)) {
            overRuns = inning.overs.map(over => over.runs);
        } else if (Array.isArray(inning.balls)) {
            const runsByOver = {};
            inning.balls.forEach(ball => {
                const overNum = ball.overNum || Math.floor(ball.overs);
                runsByOver[overNum] = (runsByOver[overNum] || 0) + (ball.runs || 0);
            });
            overRuns = Object.values(runsByOver);
        } else if (Array.isArray(inning.overSepBallRuns)) {
            overRuns = inning.overSepBallRuns;
        } else if (typeof inning.score === "number" && typeof inning.overs === "number") {
           overRuns = Array(Math.floor(inning.overs)).fill(null);
            overRuns[overRuns.length - 1] = inning.score;
        } else {
            return null;
        }


        if (!overRuns.length) return null;

        let cumulative = [];
        overRuns.reduce((acc, curr, i) => {
            cumulative[i] = acc + (curr || 0);
            return cumulative[i];
        }, 0);

        return {
            label: inning.batTeamName || `Innings ${idx + 1}`,
            data: cumulative,
            fill: false,
            borderColor: idx === 0 ? "rgb(37, 99, 235)" : "rgb(16, 185, 129)",
            backgroundColor: idx === 0 ? "rgb(37, 99, 235)" : "rgb(16, 185, 129)",
            tension: 0.2,
        };
    }).filter(Boolean);

    if (!datasets.length || datasets.every(ds => ds.data.length === 0)) {
        return (
            <div className="bg-white p-4 rounded shadow text-center text-gray-500">
                Over-wise run data not available.
            </div>
        );
    }

    const maxOvers = Math.max(...datasets.map(ds => ds.data.length));
    const labels = Array.from({ length: maxOvers }, (_, i) => (i + 1).toString());

    const data = {
        labels,
        datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Runs vs Over" },
        },
        scales: {
            x: { title: { display: true, text: "Over" } },
            y: { title: { display: true, text: "Runs" } },
        },
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <Line data={data} options={options} />
        </div>
    );
};

export default RunsOverGraph;
