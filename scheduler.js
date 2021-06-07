const File = require('./models/file.js');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();

async function deletedOldFiles() {

    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    console.log(pastDate)

    const oldFiles = await File.find({ createdAt: { $lt: pastDate } });

    // console.log('old files list')
    // console.log(oldFiles)
    if (oldFiles.length) {
        for (const file of oldFiles) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch(err) {
                console.log(`error while deleting file ${err} `);
            }
        }

        console.log('jon done .');

    }
}

deletedOldFiles().then(process.exit);