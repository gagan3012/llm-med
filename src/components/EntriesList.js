import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EntriesList() {
    const [entries, setEntries] = useState([]);
    const [viewMode, setViewMode] = useState('patient');

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/entries', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setEntries(response.data);
            } catch (error) {
                console.error('Error fetching entries:', error);
            }
        };

        fetchEntries();
    }, []);

    return (
        <div>
            <h1>Migraine Diary Entries</h1>
            <div>
                <button onClick={() => setViewMode('patient')}>Patient View</button>
                <button onClick={() => setViewMode('doctor')}>Doctor View</button>
            </div>
            {entries.map((entry, index) => (
                <div key={index}>
                    <h3>{new Date(entry.date).toLocaleDateString()}</h3>
                    <p><strong>Pain Level:</strong> {entry.painLevel}</p>
                    <p><strong>Duration:</strong> {entry.duration}</p>
                    <p><strong>Triggers:</strong> {entry.triggers.join(', ')}</p>
                    <p><strong>Symptoms:</strong> {entry.symptoms.join(', ')}</p>
                    <p><strong>Medications:</strong> {entry.medications.map(med => `${med.name} (${med.dosage})`).join(', ')}</p>
                    <p><strong>Notes:</strong> {entry.notes}</p>
                    {viewMode === 'patient' ? (
                        <div>
                            <h4>Advice for You:</h4>
                            <p>{entry.patientAdvice}</p>
                        </div>
                    ) : (
                        <div>
                            <h4>Technical Analysis:</h4>
                            <p>{entry.doctorAnalysis}</p>
                        </div>
                    )}
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default EntriesList;