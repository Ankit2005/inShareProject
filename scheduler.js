const File = require('./models/file.js');
const schedule = require('node-schedule');
const fs = require('fs');
const connectDB = require('./config/db');
const sendEmail = require('./services/emailService.js');
connectDB();

module.exports = schedule.scheduleJob('2 * * * * *', async function () {
    const pastDate = new Date(Date.now() - 6 * 6 * 100);

    //const oldFiles = await File.find({ size: { $lt: '2479720' } });
    const oldFiles = await File.find({ createdAt: { $lt: pastDate } });   
    if (oldFiles.length) {
        const time = new Date().toLocaleTimeString();
        sendEmail({
            from: 'ankitmb15@gmail.com',
            to: 'ankitb@topsinfosolutions.com',
            subject: `inShare File Sharing. ${time} ${__dirname}`,
            text: `email send to job`,
            html: '<h1>Email Send Successfully. this is heroku server </h1>'
        })

        for (const file of oldFiles) {
            try {
                console.log('file path');
                console.log(file.path)
                const x = fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch (err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
});
