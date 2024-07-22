const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify/sync');

const DB_FILE = path.join(__dirname, '..', 'data', 'database.csv');

async function ensureDbFile() {
    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, 'id,user,date,painLevel,duration,triggers,symptoms,medications,notes,doctorAnalysis,patientAdvice,doctorNotes\n');
    }
}

async function readAllEntries() {
    const results = [];
    const fileStream = fs.createReadStream(DB_FILE);

    return new Promise((resolve, reject) => {
        fileStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

async function writeEntry(entry) {
    const entries = await readAllEntries();
    entry.id = entries.length + 1;
    entries.push(entry);

    const csvString = stringify(entries, { header: true });
    await fs.writeFile(DB_FILE, csvString);

    return entry;
}

async function findEntriesByUser(userId) {
    const entries = await readAllEntries();
    return entries.filter(entry => entry.user === userId);
}

async function updateEntry(id, updatedEntry) {
    const entries = await readAllEntries();
    const index = entries.findIndex(entry => entry.id === id);
    if (index !== -1) {
        entries[index] = { ...entries[index], ...updatedEntry };
        const csvString = stringify(entries, { header: true });
        await fs.writeFile(DB_FILE, csvString);
        return entries[index];
    }
    return null;
}

module.exports = {
    ensureDbFile,
    readAllEntries,
    writeEntry,
    findEntriesByUser,
    updateEntry
};