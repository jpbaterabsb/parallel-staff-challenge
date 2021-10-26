const mongoose = require('mongoose');

exports.connect = async () => {
    await mongoose.connect('mongodb://localhost:27017', { user: 'root', pass: 'root', useNewUrlParser: true, useUnifiedTopology: true });
}

exports.disconnect = async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
}