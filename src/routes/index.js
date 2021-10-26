const { parse } = require('date-fns');
const express = require('express');
const mongoose = require('mongoose');
const { upload } = require('../configurations/upload');
const { Email } = require('../models/Email');
const { Patient } = require('../models/Patient');
const { extractDataFromCSV, getPath } = require('../utils/file.utils');


const router = express.Router();

router.put('/upload', upload.single('file'), async (req, res) => {
    const filePath = getPath(req);
    let patientsData = await extractDataFromCSV(filePath, true);

    patientsData = patientsData.map(p => {
        if (p.dateOfBirth) {
            p.dateOfBirth = parse(p.dateOfBirth, 'MM/dd/yyyyy', new Date());
        }
        return p;
    });

    const dbPatients = await Patient.create(patientsData);

    const emailsData = [];
    dbPatients
    .filter(p => 'Y' === p.consent)
        .forEach((p, i) => {
                const today = new Date();
                emailsData.push({
                    name: `Day ${i + 1}`,
                    scheduled_date: today.setDate(today.getDate() + i),
                    patientId: p._id
                })
        });

    await Email.insertMany(emailsData);
    return res.status(200).json({message: "The document was read successfully"});
});

router.get('/health', (req, res) => {
    res.status(200).json({ message: "UP" });
});

exports.v1 = router;