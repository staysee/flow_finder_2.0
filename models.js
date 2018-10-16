'use strict'

const mongoose = require('mongoose');

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
	prop: String
})

const Event = mongoose.model('Event', eventSchema);
module.exports = { Event };
