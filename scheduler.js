const File = require('./models/file.js');
const schedule = require('node-schedule');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();

async function deletedOldFiles() {
   const job = schedule.scheduleJob('1 * * * * *', async function () {
        console.log('3434')
        const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        //const oldFiles = await File.find({ size: { $lt: '2479720' } });
        const oldFiles = await File.find({ createdAt: { $lt: pastDate } });

        console.log('oldFiles');
        console.log(oldFiles);
        if (oldFiles.length) {
            for (const file of oldFiles) {
                try {
                    fs.unlinkSync(file.path);
                    await file.remove();
                    console.log(`successfully deleted ${file.filename}`);
                } catch (err) {
                    console.log(`error while deleting file ${err} `);
                }
            }            
        }
    });

    job()
    console.log('jon done .');
}

// deletedOldFiles();
deletedOldFiles().then(process.exit);