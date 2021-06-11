
const router = require('express').Router();
require('dotenv').config();
const multer = require('multer')
const path = require('path')
const File = require('../models/file')
const { v4: uuid4 } = require('uuid')

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})

let upload = multer({
    storage,
    limit: { fileSize: 1000000 * 100 }
}).single('myfile');

router.post('/', (req, res) => {
    // Store file
    upload(req, res, async (err) => {
        // Validate request
        if (!req.file) {
            return res.json({ error: "All fields are required" })
        }
        if (err) {
            return res.status(500).send({ error: err.message })
        }
        // Store into Database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        })

        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })
    })
})


router.post('/send', async (req, res) => {

    const { uuid, emailTo, emailFrom } = req.body
    console.log(req.body)
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: "All fields are required." })
    }

    try {
        // get data from database
        const file = await File.findOne({ uuid: uuid })
        if (file.sender) {
            return res.status(422).send({ error: 'Email already sent.' })
        }

        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();

        // send email
        const sendEmail = require('../services/emailService');

        sendEmail({
            from: emailFrom,
            to: emailTo,
            subject: "inShare File Sharing.",
            text: `${emailFrom} shared file with you.`,
            html: require('../services/emailTemplate')({
                emailFrom: emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size / 1000) + 'kB',
                expires: "24 hours"
            })
        })

        //return res.status(200).send({ success: 'email send.' })
        return res.send({ success: 'email send.' })
    } catch (err) {
        return res.send({ err: 'something want wrong.' })
    }
})

module.exports = router