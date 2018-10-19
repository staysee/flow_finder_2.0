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
	const eventData = [];

	for(let i=1; i<=10; i++){
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
			building: faker.address.streetAddress(),
			street: faker.address.streetName(),
			city: faker.address.city(),
			state: faker.address.state(),
			zipcode: faker.address.zipcode()
		},
		date: 'January 1, 2018',
		time: {
			startTime: 7,
			endTime: 9
		},
		prop: generateProp()
	}
}



const eventSchema = mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	address: {
		building: String,
		street: String,
		city: String,
		state: String,
		zipcode: String
	},
	date: Date,
	time: {
		startTime: Number,
		endTime: Number
	},
	prop: String
})