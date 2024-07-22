const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/DiaryEntry');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const entries = await DiaryEntry.find({ user: req.user._id }).sort('date');

        const summary = {
            totalEntries: entries.length,
            averagePainLevel: entries.reduce((sum, entry) => sum + entry.painLevel, 0) / entries.length,
            commonTriggers: getCommonItems(entries.flatMap(entry => entry.triggers)),
            commonSymptoms: getCommonItems(entries.flatMap(entry => entry.symptoms)),
            medicationEffectiveness: calculateMedicationEffectiveness(entries),
            adviceEffectiveness: calculateAdviceEffectiveness(entries)
        };

        res.json(summary);
    } catch (error) {
        res.status(500).send(error);
    }
});

function getCommonItems(items) {
    const counts = items.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([item, count]) => ({ item, count }));
}

function calculateMedicationEffectiveness(entries) {
    const medications = entries.flatMap(entry => entry.medications);
    const effectivenessByMed = medications.reduce((acc, med) => {
        if (!acc[med.name]) {
            acc[med.name] = { total: 0, count: 0 };
        }
        acc[med.name].total += med.effectiveness;
        acc[med.name].count += 1;
        return acc;
    }, {});

    return Object.entries(effectivenessByMed).map(([name, data]) => ({
        name,
        averageEffectiveness: data.total / data.count
    }));
}

function calculateAdviceEffectiveness(entries) {
    const advice = entries.flatMap(entry => entry.adviceTried);
    const effectivenessByAdvice = advice.reduce((acc, item) => {
        if (!acc[item.advice]) {
            acc[item.advice] = { total: 0, count: 0 };
        }
        acc[item.advice].total += item.effectiveness;
        acc[item.advice].count += 1;
        return acc;
    }, {});

    return Object.entries(effectivenessByAdvice).map(([advice, data]) => ({
        advice,
        averageEffectiveness: data.total / data.count
    }));
}

module.exports = router;