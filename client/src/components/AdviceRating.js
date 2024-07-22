import React, { useState } from 'react';
import axios from 'axios';

function AdviceRating({ entryId, advice }) {
    const [effectiveness, setEffectiveness] = useState(3);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/entries/${entryId}/advicerating`,
                { advice, effectiveness },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert('Advice rating submitted successfully');
        } catch (error) {
            console.error('Error submitting advice rating:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p>Rate the effectiveness of this advice: {advice}</p>
            <select value={effectiveness} onChange={(e) => setEffectiveness(Number(e.target.value))}>
                <option value={1}>Not effective</option>
                <option value={2}>Slightly effective</option>
                <option value={3}>Moderately effective</option>
                <option value={4}>Very effective</option>
                <option value={5}>Extremely effective</option>
            </select>
            <button type="submit">Submit Rating</button>
        </form>
    );
}

export default AdviceRating;