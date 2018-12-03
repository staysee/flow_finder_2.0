const express = require('express')
const router = express.Router()
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Event } = require('../models/events');
const { User } = require('../models/users');


//send JSON representation of all events on GET requests to root
router.get('/', (req, res) => {
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
		});
})

router.get('/:id', (req, res) => {
	Event
		.findById(req.params.id)
		.then(event => res.json(event.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: `Internal Server Error`})
		})
})


//EVENTS - POST
router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['name', 'description', 'address', 'date', 'time', 'prop'];
	console.log(req.body);
	for (let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Event
		.create({
			name: req.body.name,
			description: req.body.description,
			address: {
				building: req.body.address.building,
				street: req.body.address.street,
				city: req.body.address.city,
				state: req.body.address.state,
				zipcode: req.body.address.zipcode
			},
			date: req.body.date,
			time: {
				startTime: req.body.time.startTime,
				endTime: req.body.time.endTime
			},
			prop: req.body.prop,
			user: req.body.user
		})
		.then(event => res.status(201).json(event.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: `Internal Server Error`})
		})
})


//EVENTS - DELETE
router.delete('/:id', jsonParser, (req, res) => {
	Event
		.findByIdAndRemove(req.params.id)
		.then(event=> res.status(204).end())
		.catch(err => res.status(500).json({error: `Internal Server Error`}));
})

//EVENTS - PUT
router.put('/:id', jsonParser, (req, res) => {
	//Make sure id in request params and request body is the same
	console.log(req.body);
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (`Request path id (${req.params.id}) and request body id ` +
			`${req.body.id}) must match`);
		console.error(message);

		return res.status(400).json({message: message});
	}

	const toUpdate = {};
	const updateableFields = ['name', 'description', 'address', 'date', 'time', 'prop'];
	updateableFields.forEach(field => {
		if (field in req.body){
			toUpdate[field] = req.body[field];
		}
	})

	Event
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(event => res.status(204).end())
		.catch(err => res.status(500).json({message: `Internal Server Error`}))
})


module.exports = router;







