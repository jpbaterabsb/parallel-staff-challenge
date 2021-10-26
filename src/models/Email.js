const mongoose = require('mongoose');


const EmailSchema = mongoose.Schema({
    name: String,
    scheduled_date: Date,
    patientId: mongoose.Types.ObjectId
});

exports.Email = mongoose.model('Email', EmailSchema);