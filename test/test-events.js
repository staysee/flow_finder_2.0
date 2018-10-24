'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const { Event } = require('../models');
const { app, runServer, closeServer } = require('../server.js');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);


function seedEventData() {
	console.info('seeding event data');
	const seedData = [];

	for(let i=1; i<=5; i++){
		seedData.push(generateEventData());
	}
	return Event.insertMany(seedData);
}

function generateProp() {
	const props = ['Hoop', 'Staff', 'Poi', 'Rope Dart'];
	return props[Math.floor(Math.random() * props.length)];
}

function generateEventData(){
	return {
		name: faker.lorem.sentence(),
		description: faker.lorem.paragraph(),
		address:{
			building: faker.company.companyName(),
			street: faker.address.streetAddress(),
			city: faker.address.city(),
			state: faker.address.state(),
			zipcode: faker.address.zipCode()
		},
		date: faker.date.future(),
		time: {
			startTime: 10,
			endTime: 12
		},
		prop: generateProp()
	}
}

//clear database for each test
function tearDownDb() {
	console.warn('deleting database');
	return mongoose.connection.db.dropDatabase();
}

describe('hit up root url for client', function () {
	it('should show html and give 200 status code', () => {
		return chai.request(app)
				.get('/')
				.then(res => {
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				})
	})
})

describe('Events API Resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	})

	before(function() {
		return seedEventData();
	})

	after(function() {
		return tearDownDb();
	})

	after(function() {
		return closeServer();
	})

	
	describe('GET endpoint', function() {
		it('should return all existing events', function() {
			
			let res;
			return chai.request(app)
				.get('/events')
				.then(function(_res){
					res = _res;

					expect(res).to.have.status(200);
					// console.info(res.body);
					expect(res.body.events).to.have.lengthOf.at.least(1);
					return Event.count();
				})
				.then(function(count){
					expect(res.body.events).to.have.lengthOf(count);
				})
		})

		it('should return events with the right fields', function(){
			
			let resEvent;
			return chai.request(app)
				.get('/events')
				.then(function(res){
					console.info(res)
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body.events).to.be.a('array');
					expect(res.body.events).to.have.lengthOf.at.least(1);

					res.body.events.forEach(function(event){
						// console.info(event)
						expect(event).to.be.a('object');
						expect(event).to.include.keys('name', 'description', 'address', 'date', 'time', 'prop');
					})
					resEvent = res.body.events[0];
					return Event.findById(resEvent.id);
				})
				.then(function(event){
					// console.info(resEvent);
					// console.info(event);
					expect(resEvent.id).to.equal(event.id);
					expect(resEvent.name).to.equal(event.name);
					expect(resEvent.description).to.equal(event.description);
					expect(resEvent.address.building).to.equal(event.address.building);
					expect(resEvent.address.street).to.equal(event.address.street);
					expect(resEvent.address.city).to.equal(event.address.city);
					expect(resEvent.address.zipcode).to.equal(event.address.zipcode);
					expect(resEvent.date).to.equal(event.date);
					expect(resEvent.time.startTime).to.equal(event.time.startTime);
					expect(resEvent.time.endTime).to.equal(event.time.endTime);
					expect(resEvent.prop).to.equal(event.prop);
				})
		})
	}) //end GET endpoint test

	describe('POST endpoint', function() {
		it('should add a new event', function() {

			const newEvent = generateEventData();

			return chai.request(app)
			.post('/events')
			.send(newEvent)
			.then(function(res) {
				// console.info(res);
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('id', 'name', 'description', 'address', 'date', 'time', 'prop');
				expect(res.body.id).to.not.be.null;
				expect(res.body.name).to.equal(newEvent.name);
				expect(res.body.description).to.equal(newEvent.description);
				expect(res.body.address.building).to.equal(newEvent.address.building);
				expect(res.body.address.street).to.equal(newEvent.address.street);
				expect(res.body.address.city).to.equal(newEvent.address.city);
				expect(res.body.address.street).to.equal(newEvent.address.street);
				expect(res.body.address.zipcode).to.equal(newEvent.address.zipcode);
				// expect(res.body.date).to.equal(newEvent.date);
				expect(res.body.time.startTime).to.equal(newEvent.time.startTime);
				expect(res.body.time.endTime).to.equal(newEvent.time.endTime);
				expect(res.body.prop).to.equal(newEvent.prop);

				return Event.findById(res.body.id);
			})
			.then(function(event){
				expect(event.name).to.equal(newEvent.name);
				expect(event.description).to.equal(newEvent.description);
				expect(event.address.building).to.equal(newEvent.address.building);
				expect(event.address.street).to.equal(newEvent.address.street);
				expect(event.address.city).to.equal(newEvent.address.city);
				expect(event.address.state).to.equal(newEvent.address.state);
				expect(event.address.zipcode).to.equal(newEvent.address.zipcode);
				// expect(event.date).to.equal(newEvent.date);
				expect(event.time.startTime).to.equal(newEvent.time.startTime);
				expect(event.time.endTime).to.equal(newEvent.time.endTime);
				expect(event.prop).to.equal(newEvent.prop);
			})
		})
	}) //end POST endpoint test

	describe('DELETE endpoint', function() {
	//get an event
	//make a delete request for event's id
	//assert that response has right status code
	//prove the event with id doesn't exist in db anymore
		it('should delete a restaurant by id', function() {
			let event;
			return Event
				.findOne()
				.then(_event => {
					event = _event;
					return chai.request(app).delete(`/events/${event.id}`);
				})
				.then(res => {
					expect(res).to.have.status(204);
					return Event.findById(event.id);
				})
				.then(_event => {
					expect(_event).to.be.null;
				})
			
		})
	}) //end DELETE endpoint test

}) // end Events API Resource test




























