import React, { useState } from 'react';
import axios from 'axios';

function DoctorNotes({ entryId }) {
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/entries/${entryId}/doctornotes`,
                { notes },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert('Doctor notes added successfully');
        } catch (error) {
            console.error('Error adding doctor notes:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter doctor notes"
            />
            <button type="submit">Add Notes</button>
        </form>
    );
}

export default DoctorNotes;