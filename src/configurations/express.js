const express = require('express');
const { v1 } = require('../routes');

const application = express();

application.use(express.json())
application.use(express.urlencoded({ extended: true}))

application.use('/v1', v1);

exports.app = application;