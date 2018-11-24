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
		// console.log(eventData);
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
		// displayEvents(res);
		getEvents();
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
		dataType: 'json',
		headers:{
			"Authorization": `Bearer ${localStorage.getItem('token')}`
		}
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
		$('#edit-date').val(updateDate(res.date));
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
		$('#editModal').addClass('hidden');
		getEvents();
	})
	.fail(err => {
		console.error(err);
	})
}

function deleteEvent(eventId){
	$.ajax({
		method: 'DELETE',
		url: `/api/events/${eventId}`,
		contentType: 'application/json',
		headers:{
			"Authorization": `Bearer ${localStorage.getItem('token')}`
		}
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
			<div class="user-options">
				<i class="far fa-edit js-fa-edit"></i>
				<span class="js-delete-button delete-button">&times;</span>
			</div>

			<div class="content">
				<div class="event-image">
					<img class="event-thumbnail" src="../img/gianni-zanato-461187-unsplash.jpg" alt="rose">
				</div>
				<div class="event-information">

					<div class="info-left column">
						<div class="event-name">${event.name}</div>
						<div class="event-description">${event.description}</div>
						<div class="event-address">${event.address.building}<br>${event.address.street}<br>${event.address.city}, ${event.address.state} ${event.address.zipcode}</div>
					</div>

					<div class="info-middle column">
						<div class="event-date">${event.date}</div>
						<div class="event-time">${formatTimes(event.time.startTime)} - ${formatTimes(event.time.endTime)}</div>
					</div>

					<div class="info-right column">
						<div class="event-prop">${event.prop}</div>
					</div>
				</div>
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

function updateDate(eventDate){
	console.log(eventDate.split('/'));
	let dateSplit = eventDate.split('/');
	let month = dateSplit[0];
	let date = dateSplit[1]
	let year = dateSplit[2];
	let inputDate = `${year}-${month}-${date}`;

	return inputDate
}

function formatTimes(twentyfourtime){
	let time = twentyfourtime.split(':');
	let hours = time[0];
	let mins = time[1];
	let formattedTime;

	let hh = hours % 12

	if (hours == 24){
		formattedTime = `12:${mins} AM`
	} else if (hours == 12){
		formattedTime = `12:${mins} PM`
	} else if (hours > 12){
		formattedTime = `${hh}:${mins} PM`
	} else if (hours < 12){
		formattedTime = `${hh}:${mins} AM`
	}

	return formattedTime
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
		const authTokenStr = localStorage.getItem('token');
		let currentUser = parseJwt(authTokenStr)

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
			prop: $('#event-prop').val(),
			user: currentUser.user.userId
		}
		console.log(EventData);
		console.log(currentUser.user.userId)
		
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



// $(getEvents);
$(openModal);
$(closeModal);
// $(handleShowAllEvents);
$(watchSubmitEvent);
$(watchSubmitEditedEvent);
$(handleDeleteEvents);
$(handleUpdateEvent);




