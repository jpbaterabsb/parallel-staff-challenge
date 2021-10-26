const { parse } = require("date-fns");
const { Email } = require("../models/Email");
const { Patient } = require("../models/Patient");

exports.processData = async (patientsData) => {
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
    return dbPatients;
}