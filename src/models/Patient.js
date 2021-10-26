const mongoose = require('mongoose');

const PatientSchema = mongoose.Schema({
    programIdentifier: String,
    dataSource: String,
    cardNumber: String,
    memberId: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipCode: String,
    telephoneNumber: String,
    emailAddress: String,
    consent: String,
    mobilePhone: String
});


exports.Patient = mongoose.model('Patient', PatientSchema);