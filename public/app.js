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
	.done(function(response){
		eventData = response.events;
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
	.done(function(response){
		console.log(response);
	})
	.fail(err => {
		console.error(err);
	})
}

//WORKING ON THIS TO COMBINE POST AND PUT
function postEvent(event){
	$.ajax({
			url: '/events',
			method: 'POST',
			data: JSON.stringify(newEventData),
			contentType: 'application/json',
	})
	.done((data) => {
		getEvents();
	})
	.fail(err => {
		console.error(err)
	})
}

//WORKING ON THIS TO COMBINE POST AND PUT
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




//current working for POST
function handleSubmitEvent(){
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

		$.ajax({
			url: '/events',
			method: 'POST',
			data: JSON.stringify(newEventData),
			contentType: 'application/json',
			success: function(data){
				$('.events-all').html(data);
				$('#createModal').addClass('hidden');
			}
		})

		clearEventForm();
	})
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
		$('.form-heading').html('Create an Event')
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
function handleBrowseEvents(){
	$('.js-show-button').click(function(event) {
		event.preventDefault();
		getEvents();
	})
}

function handleDeleteEvents(){
	$('.events-all').on('click', '.js-delete-button', function(events){
		let deleteEventId = $(this).closest('.event-item').data('eventid');
		console.log(deleteEventId)
		// deleteEvent(deleteEventId);
	})
}

function handleUpdateEvent(){
	$('.events-all').on('click', '.js-fa-edit', function(event){
		let updateEventId = $(this).closest('.event-item').data('eventid');
		console.log(updateEventId);
		$('.form-heading').html('Update Event');

		//prefill form
		let name = $(this).closest('.event-item').find('.event-name')[0].innerText;
		let description = $(this).closest('.event-item').find('.event-description')[0].innerText;

		$('#event-name').val(name);
		$('#event-description').val(description);

		$('#createModal').removeClass('hidden');

		// updateEvent(updateEventId);

	})
}


$(handleSubmitEvent);
$(openModal);
$(closeModal);
$(handleBrowseEvents);
$(handleDeleteEvents);
// $(getEvents);
$(handleUpdateEvent);




