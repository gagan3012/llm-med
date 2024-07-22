const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getGPTAnalysis } = require('../utils/gpt');
const { writeEntry, findEntriesByUser, updateEntry } = require('../utils/csvDatabase');

router.post('/', auth, async (req, res) => {
    try {
        const entryData = { ...req.body, user: req.user.id };
        const entryText = `Date: ${entryData.date}\nPain Level: ${entryData.painLevel}\nDuration: ${entryData.duration}\nTriggers: ${entryData.triggers.join(', ')}\nSymptoms: ${entryData.symptoms.join(', ')}\nMedications: ${entryData.medications.map(m => `${m.name} (${m.dosage})`).join(', ')}\nNotes: ${entryData.notes}`;

        const doctorAnalysis = await getGPTAnalysis(entryText, "You are a neurologist specializing in migraine management. Provide a technical analysis of the patient's migraine diary entry, including potential correlations, patterns, and suggestions for the treating physician.");
        const patientAdvice = await getGPTAnalysis(entryText, "You are a supportive health coach specializing in migraine management. Provide friendly, easy-to-understand advice for the patient based on their migraine diary entry. Include actionable tips for managing their condition and potential lifestyle adjustments.");

        const entry = await writeEntry({
            ...entryData,
            doctorAnalysis,
            patientAdvice
        });

        res.status(201).send(entry);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const entries = await findEntriesByUser(req.user.id);
        res.send(entries);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/:id/doctornotes', auth, async (req, res) => {
    try {
        const entry = await updateEntry(req.params.id, { doctorNotes: req.body.notes });
        if (!entry) {
            return res.status(404).send();
        }
        res.send(entry);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/:id/advicerating', auth, async (req, res) => {
    try {
        const entry = await updateEntry(req.params.id, {
            adviceTried: JSON.stringify([...JSON.parse(entry.adviceTried || '[]'), {
                advice: req.body.advice,
                effectiveness: req.body.effectiveness
            }])
        });
        if (!entry) {
            return res.status(404).send();
        }
        res.send(entry);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;