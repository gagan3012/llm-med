const schedule = require('node-schedule');
const DiaryEntry = require('./models/DiaryEntry');
const User = require('./models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // Configure your email service here
});

async function checkForPatterns() {
    const users = await User.find({ userType: 'patient' });

    for (const user of users) {
        const recentEntries = await DiaryEntry.find({ user: user._id }).sort('-date').limit(10);

        // Check for patterns (e.g., increasing pain levels)
        const increasingPain = recentEntries.every((entry, index, arr) => {
            if (index === 0) return true;
            return entry.painLevel >= arr[index - 1].painLevel;
        });

        if (increasingPain) {
            // Send notification
            const mailOptions = {
                from: 'youremail@example.com',
                to: user.email,
                subject: 'Migraine Pattern Detected',
                text: "We've noticed an increasing trend in your pain levels.Please consult your doctor."
      };

            transporter.sendMail(mailOptions);
        }
    }
}

function setupNotifications() {
    // Run the check daily
    schedule.scheduleJob('0 0 * * *', checkForPatterns);
}

module.exports = { setupNotifications };