require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const entryRoutes = require('./routes/entries');
const summaryRoutes = require('./routes/summary');
const exportRoutes = require('./routes/export');
const { setupNotifications } = require('./notifications');
const { ensureDbFile } = require('./utils/csvDatabase');

const app = express();

app.use(cors());
app.use(express.json());

// Ensure the CSV database file exists
ensureDbFile();

app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/export', exportRoutes);

setupNotifications();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));