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

app.use(morgan('common'));
app.use(express.static('public'));
// app.use(express.json());


//EVENTS - GET
app.get('/events', (req, res) => {

	Event
		.find()
		.then(events => {
			res.json({
				events: events.map(event => event.serialize())
			})
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: `Internal Server Error`})
		})
})

//EVENTS - GET ONE
app.get('/events/:id', (req, res) => {
	Event
		.findById(req.params.id)	//looks for single document
		.then(event => res.json(event.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: `Internal Servor Error`})
		})
})

//EVENTS - POST
app.post('/events', jsonParser, (req, res) => {
	const requiredFields = ['name', 'description', 'address', 'date', 'time', 'prop'];
	for (let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message); //400=Bad Request
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
		.then(event => res.status(201).json(event.serialize()))	//201=Created
		.catch(err => {
			console.error(err);
			res.status(500).json({error: `Internal Servor Error`})
		})
})


//EVENTS - DELETE
app.delete('/events/:id', jsonParser, (req, res) => {
	Event
		.findByIdAndRemove(req.params.id)
		.then(event=> res.status(204).end())	//204=No Content; server fulfilled request but no content sent back
		.catch(err => res.status(500).json({error: `Internal Servor Error`}));
})

//EVENTS - PUT
app.put('/events/:id', jsonParser, (req, res) => {
	//Make sure id in request params and request body is the same
	console.log(req.body);
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (`Request path id (${req.params.id}) and request body id ` +
			`${req.body.id}) must match`);
		console.error(message);
		//return here to break out of the function
		return res.status(400).json({message: message});	//400=BadRequest
	}
	//generate object of fields to be updated, other fields left untouched
	const toUpdate = {};
	const updateableFields = ['name', 'description', 'address', 'date', 'time', 'prop'];
	updateableFields.forEach(field => {
		if (field in req.body){
			toUpdate[field] = req.body[field];
		}
	})

	Event
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})	//2 args: id, object describing how doc should be updated
		.then(event => res.status(204).end())	//204=Request fulfilled but no content sent back
		.catch(err => res.status(500).json({message: `Internal Servor Error`}))
})

// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
	res.status(404).json({message: 'Endpoint Not Found'});
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



