const File = require('./models/file.js');
const schedule = require('node-schedule');
const fs = require('fs');
const connectDB = require('./config/db');
const sendEmail = require('./services/emailService.js');
// connectDB();


module.exports = schedule.scheduleJob('30 2 * * *', async function () {
    console.log('job is call');
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // const oldFiles = await File.find({ size: { $lt: '85112622' } });
    //const oldFiles = await File.find({ });
    const oldFiles = await File.find({ createdAt: { $lt: pastDate } });
    const time = new Date().toLocaleTimeString();
    if (oldFiles.length) {
        console.log(oldFiles)
        sendEmail({
            from: 'ankitmb15@gmail.com',
            to: 'ankitb@topsinfosolutions.com',
            subject: `inShare File Sharing.  Dev : Ankit`,
            text: `email send to job`,
            html: '<h1> Delete All expirer files in db  call 2:30' + `server time : ${time}` + ' </h1>'
        })

        for (const file of oldFiles) {
            try {
                console.log('file path');
                console.log(file.path)
                //fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch (err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    } else {
        sendEmail({
            from: 'ankitmb15@gmail.com',
            to: 'ankitb@topsinfosolutions.com',
            subject: `inShare File Sharing. `,
            text: `email send to job else part `,
            html: '<h1> Not Found Old Files In Database call only 2:30 ' + `server time : ${time}` + ' </h1>'
        })
    }
});
