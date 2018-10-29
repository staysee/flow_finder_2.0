'use strict'

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { Event } = require('./models');

const jsonParser = bodyParser.json();
const app = express();

const eventRouter = require('./eventRouter');

app.use(morgan('common'));
app.use(express.static('public'));
// app.use(express.json());



app.use('/events', eventRouter);
// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
	res.status(404).json({message: 'Endpoint Not Found'});
})



// OPEN/CLOSE SERVER
let server;

function runServer(databaseUrl, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}

			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer }; 



