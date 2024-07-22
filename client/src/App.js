import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DiaryForm from './components/DiaryForm';
import EntriesList from './components/EntriesList';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import SummaryReport from './components/SummaryReport';
import ExportData from './components/ExportData';

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/entries">View Entries</Link></li>
                        <li><Link to="/calendar">Calendar</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/summary">Summary Report</Link></li>
                        <li><Link to="/export">Export Data</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<DiaryForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/entries" element={<EntriesList />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/summary" element={<SummaryReport />} />
                    <Route path="/export" element={<ExportData />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;