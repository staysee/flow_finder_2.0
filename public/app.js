let eventData ;

//--------------------------//
//		AJAX CALLS			//
//--------------------------//
function getEvents(){
	$.ajax({
		method: 'GET',
		url: '/events',
		dataType: 'json',
	})
	.done(function(res){
		eventData = res.events;
		console.log(eventData);

		displayEvents(eventData);
	})
	.fail(err => {
		console.error(err)
	})
}

function getOneEvent(eventId){
	$.ajax({
		method: 'GET',
		url: `/events/${eventId}`,
		dataType: 'json'
	})
	.done(function(res){
		console.log(res);
	})
	.fail(err => {
		console.error(err);
	})
}

//WORKING ON THIS TO COMBINE POST AND PUT
function postEvent(newEventData){
	$.ajax({
			url: '/events',
			method: 'POST',
			data: JSON.stringify(newEventData),
			contentType: 'application/json',
	})
	.done((res) => {
		displayEvents(res);
		$('#createModal').addClass('hidden');
	})
	.fail(err => {
		console.error(err)
	})
}


function getEventToUpdate(eventId){
	$.ajax({
		method: 'GET',
		url: `/events/${eventId}`,
		dataType: 'json'
	})
	.done(function(res){
		console.log(res);
		let id = res.id
		console.log(id);
		$('#event-name').val(res.name);
		$('#event-description').val(res.description);
		$('#event-venue').val(res.address.building);
		$('#event-street').val(res.address.street);
		$('#event-city').val(res.address.city);
		$('#event-state').val(res.address.state);
		$('#event-zipcode').val(res.address.zipcode);
		$('#event-date').val(res.date);
		$('#event-starttime').val(res.time.startTime);
		$('#event-endtime').val(res.time.endTime);
		$('#event-prop').val(res.prop);

		$('.form-heading').html('Update Event');
		$('#createModal').removeClass('hidden');
	})
	.fail(err => {
		console.error(err);
	})
}

function updateEvent(eventId){
	$.ajax({
		method: 'PUT',
		url: `/events/${eventId}`,
		data: JSON.stringify(event),
		dataType: 'json',
		contentType: 'application/json',
	})
	.done(() => {
		getEvents();
	})
	.fail(err => {
		console.error(err);
	})
}

function deleteEvent(eventId){
	$.ajax({
		method: 'DELETE',
		url: `/events/${eventId}`,
		contentType: 'application/json'
	})
	.done(() => {
		getEvents();
	})
	.fail(err => {
		console.error(err)
	})

}

//--------------------------//
//		APP FUNCTIONS		//
//--------------------------//
function renderEvents(event, index){
	return `
		<div class="event-item" data-eventid="${event.id}">
			<i class="far fa-edit js-fa-edit"></i>
			<span class="js-delete-button delete-button">&times;</span>
			<div class="event-image">
				<img class="event-thumbnail" src="./img/gianni-zanato-461187-unsplash.jpg" alt="rose">
			</div>
			<div class="event-information">
				<div class="info-left">
					<div class="event-name">${event.name}</div>
					<div class="event-description">${event.description}</div>
					<div class="event-address">${event.address.building} ${event.address.street} ${event.address.city}, ${event.address.state} ${event.address.zipcode}</div>
				</div>
				<div class="event-date">${event.date}</div>
				<div class="event-time">${event.time.startTime} - ${event.time.endTime}</div>
				<div class="event-prop">${event.prop}</div>
			</div>
		</div>
	`
}

function displayEvents(data){
	console.log("from displayEvents function")
	let eachEvent = $.map(eventData, function (event, index){
		return renderEvents(event)
	})
	$('.events-all').html(eachEvent)
}



function getDate(eventDate) {
	let date = new Date(eventDate)
	let fullDate = [date.getMonth()+1, date.getDate(), date.getFullYear()].join('/');
	return fullDate;
}




//WORKING ON THIS TO COMBINE POST AND PUT
function saveEvent(event){
	$('.js-event-form').submit(function(event) {
		event.preventDefault();
		
		const newEventData = {
			name: $('#event-name').val(),
			description:$('#event-description').val(),
			address: {
				building: $('#event-venue').val(),
				street: $('#event-street').val(),
				city: $('#event-city').val(),
				state: $('#event-state').val(),
				zipcode: $('#event-zipcode').val()
			},
			date: getDate($('#event-date').val()),
			time: {
				startTime: $('#event-starttime').val(),
				endTime: $('#event-endtime').val()
			},
			prop: $('#event-prop').val()
		}
		console.log(newEventData);
	})

	postEvent();
}



//--------------------------//
//		EVENT FORM MODAL	//
//--------------------------//
function openModal(){
	$('#createLink').click(function(event) {
		event.preventDefault()
		$('.form-heading').html('Create an Event');
		$('#createModal').removeClass('hidden');

	})
}

function closeModal(){
	$('.closeModal').on('click',function(){
		$('#createModal').addClass('hidden');
		$('.form-heading').html('');
		clearEventForm();
	})
}

function clearEventForm(){
	$('#event-name').val(""),
	$('#event-description').val("")
	$('#event-venue').val("")
	$('#event-street').val("")
	$('#event-city').val("")
	$('#event-state').val("")
	$('#event-zipcode').val("")
	$('#event-date').val("")
	$('#event-starttime').val("")
	$('#event-endtime').val("")
	$('#event-prop').val("")
}



//--------------------------//
//		EVENT HANDLERS		//
//--------------------------//
function handleShowAllEvents(){
	$('.js-show-button').click(function(event) {
		event.preventDefault();
		getEvents();
	})
}

function watchSubmitEvent(){
	$('.js-event-form').submit(function(event) {
		event.preventDefault();
		
		const EventData = {
			name: $('#event-name').val(),
			description:$('#event-description').val(),
			address: {
				building: $('#event-venue').val(),
				street: $('#event-street').val(),
				city: $('#event-city').val(),
				state: $('#event-state').val(),
				zipcode: $('#event-zipcode').val()
			},
			date: getDate($('#event-date').val()),
			time: {
				startTime: $('#event-starttime').val(),
				endTime: $('#event-endtime').val()
			},
			prop: $('#event-prop').val()
		}
		console.log(EventData);
		

		postEvent(EventData);
		// clearEventForm();
	})
}

function handleDeleteEvents(){
	$('.events-all').on('click', '.js-delete-button', function(events){
		let deleteEventId = $(this).closest('.event-item').data('eventid');
		console.log(deleteEventId)
		deleteEvent(deleteEventId);
	})
}

function handleUpdateEvent(){
	$('.events-all').on('click', '.js-fa-edit', function(event){
		let updateEventId = $(this).closest('.event-item').data('eventid');
		console.log(updateEventId);

		getEventToUpdate(updateEventId);
	})
}

// LINKS



// $(getEvents);
$(openModal);
$(closeModal);
$(handleShowAllEvents);
$(watchSubmitEvent);
$(handleDeleteEvents);
$(handleUpdateEvent);




