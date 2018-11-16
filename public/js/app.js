let eventData;
let eventID;

//--------------------------//
//		AJAX CALLS			//
//--------------------------//
function getEvents(){
	$.ajax({
		method: 'GET',
		url: '/api/events',
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
		url: `/api/events/${eventId}`,
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
			url: '/api/events',
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
		url: `/api/events/${eventId}`,
		dataType: 'json'
	})
	.done(function(res){
		console.log(res);
		eventID = res.id
		console.log(eventID);
		$('#edit-name').val(res.name);
		$('#edit-description').val(res.description);
		$('#edit-venue').val(res.address.building);
		$('#edit-street').val(res.address.street);
		$('#edit-city').val(res.address.city);
		$('#edit-state').val(res.address.state);
		$('#edit-zipcode').val(res.address.zipcode);
		$('#edit-date').val(res.date);
		$('#edit-starttime').val(res.time.startTime);
		$('#edit-endtime').val(res.time.endTime);
		$('#edit-prop').val(res.prop);

		$('.form-heading').html('Update Event');
		$('#editModal').removeClass('hidden');
	})
	.fail(err => {
		console.error(err);
	})
}

function updateEvent(eventId, event){
	$.ajax({
		method: 'PUT',
		url: `/api/events/${eventId}`,
		data: JSON.stringify(event),
		dataType: 'json',
		contentType: 'application/json',
	})
	.done(() => {
		console.log('The Event was Updated');
	})
	.fail(err => {
		console.error(err);
	})
}

function deleteEvent(eventId){
	$.ajax({
		method: 'DELETE',
		url: `/api/events/${eventId}`,
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
				<img class="event-thumbnail" src="../img/gianni-zanato-461187-unsplash.jpg" alt="rose">
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
		$('#editModal').addClass('hidden');
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
	$('#create-event-form').submit(function(event) {
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

function watchSubmitEditedEvent(){
	$('#edit-event-form').submit(function(event) {
		event.preventDefault();
		
		const updatedData = {
			id: `${eventID}`,
			name: $('#edit-name').val(),
			description:$('#edit-description').val(),
			address: {
				building: $('#edit-venue').val(),
				street: $('#edit-street').val(),
				city: $('#edit-city').val(),
				state: $('#edit-state').val(),
				zipcode: $('#edit-zipcode').val()
			},
			date: getDate($('#edit-date').val()),
			time: {
				startTime: $('#edit-starttime').val(),
				endTime: $('#edit-endtime').val()
			},
			prop: $('#edit-prop').val()
		}
		console.log('Send Updated Event data');
		
		updateEvent(eventID, updatedData);

		// clearEventForm();
	})
}

function handleDeleteEvents(){
	$('.events-all').on('click', '.js-delete-button', function(events){
		let deleteEventId = $(this).closest('.event-item').data('eventid');
		console.log(`Deleting Event: ${deleteEventId}`)
		deleteEvent(deleteEventId);
	})
}

function handleUpdateEvent(){
	$('.events-all').on('click', '.js-fa-edit', function(event){
		let updateEventId = $(this).closest('.event-item').data('eventid');
		console.log(`Updating Event: ${updateEventId}`);

		getEventToUpdate(updateEventId);
	})
}

// LINKS
function handleAccount(){
	$('#accountLink').click(function(event) {
		event.preventDefault()
		window.location.replace("/views/login.html")
	})
}



// $(getEvents);
$(openModal);
$(closeModal);
$(handleShowAllEvents);
$(watchSubmitEvent);
$(watchSubmitEditedEvent);
$(handleDeleteEvents);
$(handleUpdateEvent);
$(handleAccount);




