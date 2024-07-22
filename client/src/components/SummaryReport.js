import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SummaryReport() {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/summary', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setSummary(response.data);
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        };
        fetchSummary();
    }, []);

    if (!summary) return <div>Loading...</div>;

    return (
        <div>
            <h1>Migraine Summary Report</h1>
            <p>Total Entries: {summary.totalEntries}</p>
            <p>Average Pain Level: {summary.averagePainLevel.toFixed(2)}</p>

            <h2>Common Triggers</h2>
            <ul>
                {summary.commonTriggers.map((trigger, index) => (
                    <li key={index}>{trigger}</li>
                ))}
            </ul>
            <h2>Most Effective Treatments</h2>
            <ul>
                {summary.effectiveTreatments.map((treatment, index) => (
                    <li key={index}>{treatment}</li>
                ))}
            </ul>
            <h2>Pain Distribution</h2>
            <ul>
                {Object.entries(summary.painDistribution).map(([level, count]) => (
                    <li key={level}>
                        Pain Level {level}: {count} occurrences
                    </li>
                ))}
            </ul>
            <h2>Monthly Trend</h2>
            <ul>
                {summary.monthlyTrend.map((month, index) => (
                    <li key={index}>
                        {month.month}: {month.count} migraines
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SummaryReport;