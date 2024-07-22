const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/DiaryEntry');
const auth = require('../middleware/auth');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

router.get('/', auth, async (req, res) => {
    try {
        const entries = await DiaryEntry.find({ user: req.user._id }).sort('date');

        const csvStringifier = createCsvStringifier({
            header: [
                { id: 'date', title: 'Date' },
                { id: 'painLevel', title: 'Pain Level' },
                { id: 'duration', title: 'Duration' },
                { id: 'triggers', title: 'Triggers' },
                { id: 'symptoms', title: 'Symptoms' },
                { id: 'medications', title: 'Medications' },
                { id: 'notes', title: 'Notes' },
            ]
        });

        const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(entries.map(entry => ({
            ...entry.toObject(),
            medications: entry.medications.map(m => `${m.name} (${m.dosage})`).join(', '),
            triggers: entry.triggers.join(', '),
            symptoms: entry.symptoms.join(', ')
        })));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=migraine_diary.csv');
        res.status(200).send(csvString);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;