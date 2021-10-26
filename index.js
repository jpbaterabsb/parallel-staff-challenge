
const mongoose = require('mongoose');
const { app } = require('./src/configurations/express');

// open mongoose connection
mongoose.connect('mongodb://localhost:27017', { user: 'root', pass: 'root', useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log(`Listening to port 3000`);
    });
  });

/**
* Exports express
* @public
*/
module.exports = app;