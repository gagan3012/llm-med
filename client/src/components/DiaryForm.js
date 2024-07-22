import React, { useState } from 'react';
import axios from 'axios';

function DiaryForm() {
    const [entry, setEntry] = useState({
        date: new Date().toISOString().split('T')[0],
        painLevel: 0,
        duration: '',
        triggers: [],
        symptoms: [],
        medications: [{ name: '', dosage: '', effectiveness: 3 }],
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEntry(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e) => {
        const { name, value } = e.target;
        setEntry(prev => ({ ...prev, [name]: value.split(',').map(item => item.trim()) }));
    };

    const handleMedicationChange = (index, field, value) => {
        const newMedications = [...entry.medications];
        newMedications[index][field] = value;
        setEntry(prev => ({ ...prev, medications: newMedications }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/entries', entry, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Entry submitted successfully');
        } catch (error) {
            console.error('Error submitting entry:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="date" name="date" value={entry.date} onChange={handleChange} required />
            <input type="number" name="painLevel" min="0" max="10" value={entry.painLevel} onChange={handleChange} required />
            <input type="text" name="duration" value={entry.duration} onChange={handleChange} placeholder="Duration" required />
            <input type="text" name="triggers" value={entry.triggers.join(', ')} onChange={handleArrayChange} placeholder="Triggers (comma-separated)" />
            <input type="text" name="symptoms" value={entry.symptoms.join(', ')} onChange={handleArrayChange} placeholder="Symptoms (comma-separated)" />
            {entry.medications.map((med, index) => (
                <div key={index}>
                    <input type="text" value={med.name} onChange={(e) => handleMedicationChange(index, 'name', e.target.value)} placeholder="Medication name" />
                    <input type="text" value={med.dosage} onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)} placeholder="Dosage" />
                    <select value={med.effectiveness} onChange={(e) => handleMedicationChange(index, 'effectiveness', parseInt(e.target.value))}>
                        <option value={1}>Not effective</option>
                        <option value={2}>Slightly effective</option>
                        <option value={3}>Moderately effective</option>
                        <option value={4}>Very effective</option>
                        <option value={5}>Extremely effective</option>
                    </select>
                </div>
            ))}
            <button type="button" onClick={() => setEntry(prev => ({ ...prev, medications: [...prev.medications, { name: '', dosage: '', effectiveness: 3 }] }))}>
                Add Medication
            </button>
            <textarea name="notes" value={entry.notes} onChange={handleChange} placeholder="Notes" />
            <button type="submit">Submit Entry</button>
        </form>
    );
}

export default DiaryForm;