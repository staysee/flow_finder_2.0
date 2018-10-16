'use strict'

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));


app.listen(process.env.PORT || 8080, () => console.log(
	`Your app is listening on port ${process.env.PORT || 8080}`));

module.exports = app;