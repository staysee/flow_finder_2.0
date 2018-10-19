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
	time: {
		startTime: Number,
		endTime: Number
	},
	prop: String
})

eventSchema.virtual('addressString').get(function() {
	return `${this.address.building} ${this.address.street}`.trim();
})

eventSchema.methods.serialize = function() {
	return {
		id: this._id,
		name: this.name,
		description: this.description,
		address: this.addressString,
		prop: this.prop
	};
}

const Event = mongoose.model('Event', eventSchema);
module.exports = { Event };
