'use strict'

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { Event } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));


//EVENTS - GET
app.get('/events', (req, res) => {
	Event
		.find()
		.then(events => {
			res.json(events.map(event => event.serialize()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: `Internal Server Error`})
		})
})

//EVENTS - GET ONE
app.get('/events/:id', (req, res) => {
	Event
		.findById(req.params.id)
		.then(event => res.json(event.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: `Internal Servor Error`})
		})
})

//EVENTS - POST
app.post('/events', (req, res) => {
	const requiredFields = ['name', 'description', 'address', 'date', 'time', 'prop'];
	for (let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if (!(field in req.body)){
      		const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Event
		.create({
			name: req.body.name,
			description: req.body.description,
			address: req.body.address,
			date: req.body.date,
			time: req.body.time,
			prop: req.body.prop
		})
		.then(event => res.status(201).json(event.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: `Internal Servor Error`})
		})
})






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

module.exports = { runServer, app, closeServer }; 



