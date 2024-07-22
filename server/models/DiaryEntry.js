const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    painLevel: { type: Number, required: true },
    duration: { type: String, required: true },
    triggers: [String],
    symptoms: [String],
    medications: [{
        name: String,
        dosage: String,
        effectiveness: { type: Number, min: 1, max: 5 }
    }],
    notes: String,
    doctorAnalysis: String,
    patientAdvice: String,
    doctorNotes: String,
    adviceTried: [{
        advice: String,
        effectiveness: { type: Number, min: 1, max: 5 }
    }]
});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);