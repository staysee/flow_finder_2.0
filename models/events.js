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
	date: String,
	time: {
		startTime: String,
		endTime: String
	},
	prop: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	}
})

//derived properties for clients who only need a human-readable string
eventSchema.virtual('addressString').get(function() {
	return `${this.address.building} ${this.address.street} ${this.address.city} ${this.address.state} ${this.address.zipcode}`.trim();
})

//instance of Event model...specifies how events are represented outside of our app via our API
eventSchema.methods.serialize = function() {
	return {
		id: this._id,
		name: this.name,
		description: this.description,
		address: this.address,
		date: this.date,
		time: this.time,
		prop: this.prop,
		user: this.user
	};
}

const Event = mongoose.model('Event', eventSchema);
module.exports = { Event };
