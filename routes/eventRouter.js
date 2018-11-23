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
		.findById(req.params.id)	//looks for single document
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
			return res.status(400).send(message); //400=Bad Request
		}
	}
	// console.log(`user:${req.user.id}`);

	// let userID;
	//GET to find userObjectId
	//Store the ObjectId into a variable thn pass it into user in Event create
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
		.then(event => res.status(201).json(event.serialize()))	//201=Created
		.catch(err => {
			console.error(err);
			res.status(500).json({error: `Internal Server Error`})
		})
})


//EVENTS - DELETE
router.delete('/:id', jsonParser, (req, res) => {
	Event
		.findByIdAndRemove(req.params.id)
		.then(event=> res.status(204).end())	//204=No Content; server fulfilled request but no content sent back
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
		.catch(err => res.status(500).json({message: `Internal Server Error`}))
})


module.exports = router;







