import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function CalendarView() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/entries', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const calendarEvents = response.data.map(entry => ({
                    title: `Pain Level: ${entry.painLevel}`,
                    start: new Date(entry.date),
                    end: new Date(entry.date),
                    allDay: true,
                    resource: entry
                }));
                setEvents(calendarEvents);
            } catch (error) {
                console.error('Error fetching entries:', error);
            }
        };
        fetchEntries();
    }, []);

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
            />
        </div>
    );
}

export default CalendarView;