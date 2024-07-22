import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

function Dashboard() {
    const [entries, setEntries] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const entriesResponse = await axios.get('http://localhost:5000/api/entries', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setEntries(entriesResponse.data);

                const statsResponse = await axios.get('http://localhost:5000/api/summary', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStats(statsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (!stats) return <div>Loading...</div>;

    const painLevelData = {
        labels: entries.map(entry => new Date(entry.date).toLocaleDateString()),
        datasets: [{
            label: 'Pain Level',
            data: entries.map(entry => entry.painLevel),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const triggerData = {
        labels: stats.commonTriggers.map(t => t.item),
        datasets: [{
            label: 'Common Triggers',
            data: stats.commonTriggers.map(t => t.count),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }]
    };

    const symptomData = {
        labels: stats.commonSymptoms.map(s => s.item),
        datasets: [{
            data: stats.commonSymptoms.map(s => s.count),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
            ],
        }]
    };

    return (
        <div>
            <h1>Migraine Dashboard</h1>
            <p>Total Entries: {stats.totalEntries}</p>
            <p>Average Pain Level: {stats.averagePainLevel.toFixed(2)}</p>

            <h2>Pain Level Over Time</h2>
            <Line data={painLevelData} />

            <h2>Common Triggers</h2>
            <Bar data={triggerData} />

            <h2>Common Symptoms</h2>
            <Pie data={symptomData} />

            <h2>Medication Effectiveness</h2>
            <ul>
                {stats.medicationEffectiveness.map((med, index) => (
                    <li key={index}>{med.name}: {med.averageEffectiveness.toFixed(2)}</li>
                ))}
            </ul>

            <h2>Advice Effectiveness</h2>
            <ul>
                {stats.adviceEffectiveness.map((advice, index) => (
                    <li key={index}>{advice.advice}: {advice.averageEffectiveness.toFixed(2)}</li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;