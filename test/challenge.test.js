const { format } = require("date-fns");
const { sortBy } = require('lodash');

const { extractDataFromCSV } = require("../src/utils/file.utils");
const { connect, disconnect } = require("./configurations/db.util");
const { processData } = require("../src/services/process-csv.service");
const { Email } = require("../src/models/Email");

beforeEach(async () => {
    await connect();
});

afterEach(async () => {
    await disconnect();
});

test('Verify the data in CSV file matches the data in Patients collection', async () => {
    let patientDataFromCsv = await extractDataFromCSV(`${__dirname}/files/patients.csv`);
    let patientDB = await processData(patientDataFromCsv);
    sortBy(patientDataFromCsv, 'memberId');
    sortBy(patientDB, 'memberId');
    for (let index = 0; index < patientDataFromCsv.length; index++) {
        await patientMaches(patientDB[index], patientDataFromCsv[index]);
    }
});

test('Print out all Patient IDs where the first name is missing', async () => {
    const patientDataFromCsv = await extractDataFromCSV(`${__dirname}/files/patients.csv`);
    const patientDB = await processData(patientDataFromCsv);
    const patientIdWhichNameIsMissing = patientDB.filter(p => !p.firstName).map(p => p._id.toString());
    expect(patientIdWhichNameIsMissing.length).toBe(2);
    console.log(patientIdWhichNameIsMissing);
});

test('Print out all Patient IDs where the email address is missing, but consent is Y', async () => {
    const patientDataFromCsv = await extractDataFromCSV(`${__dirname}/files/patients.csv`);
    const patientDB = await processData(patientDataFromCsv);
    const patientIdWhichNameIsMissing = patientDB.filter(p => !p.emailAddress && p.consent === 'Y').map(p => p._id.toString());
    expect(patientIdWhichNameIsMissing.length).toBe(1);
    console.log(patientIdWhichNameIsMissing);
});


test('Verify Emails were created in Emails Collection for patients who have CONSENT as Y', async () => {
    const patientDataFromCsv = await extractDataFromCSV(`${__dirname}/files/patients.csv`);
    const patientDB = await processData(patientDataFromCsv);
    const ids = patientDB.filter(p => p.consent === 'Y').map(p => p._id.toString());
    const emails = await Email.find({});
    emails.forEach(e => {
        expect(ids.includes(e.patientId.toString())).toBeTruthy();
    });
});

test('Verify emails for each patient are scheduled correctly.', async () => {
    const patientDataFromCsv = await extractDataFromCSV(`${__dirname}/files/patients.csv`);
    const patientDB = await processData(patientDataFromCsv);
    const emails = await Email.find({});
    const patientToSendEmail = patientDB.filter(p => p.consent === 'Y');
    for (let index = 0; index < patientToSendEmail.length; index++) {
        const today = new Date();
        const email = emails[index];
        const patient = patientToSendEmail[index];
        expect(email.name).toBe(`Day ${index + 1}`);
        expect(format(email.scheduled_date, 'MM/dd/yyyy')).toBe(format(today.setDate(today.getDate() + index), 'MM/dd/yyyy'));
        expect(email.patientId.toString()).toBe(patient._id.toString());
    }
});


async function patientMaches(db, csv) {
    expect(db.memberId === csv.memberId).toBeTruthy();
    expect(db.programIdentifier === csv.programIdentifier).toBeTruthy();
    expect(db.dataSource === csv.dataSource).toBeTruthy();
    expect(db.cardNumber === csv.cardNumber).toBeTruthy();
    expect(db.firstName === csv.firstName).toBeTruthy();
    expect(db.lastName === csv.lastName).toBeTruthy();
    expect(format(db.dateOfBirth, 'MM/dd/yyyy')).toBe(format(csv.dateOfBirth, 'MM/dd/yyyy'));
    expect(db.address1 === csv.address1).toBeTruthy();
    expect(db.address2 === csv.address2).toBeTruthy();
    expect(db.city === csv.city).toBeTruthy();
    expect(db.state === csv.state).toBeTruthy();
    expect(db.zipCode === csv.zipCode).toBeTruthy();
    expect(db.telephoneNumber === csv.telephoneNumber).toBeTruthy();
    expect(db.emailAddress === csv.emailAddress).toBeTruthy();
    expect(db.consent === csv.consent).toBeTruthy();
    expect(db.mobilePhone === csv.mobilePhone).toBeTruthy();
}