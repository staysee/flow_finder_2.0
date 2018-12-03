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
		if(eventData.length === 0){
			$('.msg').html("There are no events. Create an event to connect with other flow artists!");
			$('.alert-message').css("display", "inline-block");
		}

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

function postEvent(newEventData){
	$.ajax({
			url: '/api/events',
			method: 'POST',
			data: JSON.stringify(newEventData),
			contentType: 'application/json',
	})
	.done((res) => {
		getEvents();
		$('#createModal').addClass('hidden');
		$('.msg').html("Thanks for sharing your event!");
		$('.alert-message').css("display","inline-block");
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
		console.log(res.date);
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
		$('#editModal').addClass('hidden');
		$('.msg').html("Your event was updated successfully!");
		$('.alert-message').css("display","inline-block");
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
		$('.msg').html("Your event was deleted successfully!");
		$('.alert-message').css("display","inline-block");
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
	const authTokenStr = localStorage.getItem('token');
	let currentUser = parseJwt(authTokenStr)
	let option;

	if (currentUser.user.userId !== event.user){
		option = "hidden"
	} else {
		option = ""
	}

	return `
		<div class="js-event-item event-item" data-eventid="${event.id}">
			<div id="options" class="user-options ${option}">
				<i class="far fa-edit js-fa-edit" aria-haspopup="true"></i>
				<span class="js-delete-button delete-button">&times;</span>
			</div>

			<div class="js-event-name event-name">${event.name}</div>
			<div class="event-prop">${event.prop}</div>
			<div class="js-event-information event-information hidden">

				<div class="row">
					<div class="event-description">${event.description}</div>
				</div>

				<div class="details">
					<div class="datetime">
						<div class="event-date">${formatDate(event.date)}</div>
						<div class="event-time">${formatTimes(event.time.startTime)} - ${formatTimes(event.time.endTime)}</div>
					</div>
					<div class="address">
						<div class="event-address">${event.address.building}<br>${event.address.street}<br>${event.address.city}, ${event.address.state} ${event.address.zipcode}</div>
					</div>
				</div>
			</div>
		</div>
	`
}

function displayEvents(data){
	let eachEvent = $.map(eventData, function (event, index){
		return renderEvents(event)
	})
	$('.events-all').html(eachEvent)
}

function getDate(eventDate) {
	let date = new Date(eventDate)
	let fullDate = [date.getUTCMonth()+1, date.getUTCDate(), date.getUTCFullYear()].join('/');
	return fullDate;
}

function updateDate(eventDate){
	let dateSplit = eventDate.split('/');
	let month = dateSplit[0];
	let date = dateSplit[1]
	let year = dateSplit[2];

	if (month.length == 1){
		month = "0" + month;
	}
	if (date.length == 1){
		date = "0" + date;
	}
	
	let inputDate = `${year}-${month}-${date}`;

	return inputDate
}

function formatDate(eventDate){
	let months = [
				'January', 'February', 'March',
				'April', 'May', 'June',
				'July', 'August', 'September',
				'October', 'November', 'December'
	];

	let dateSplit = eventDate.split('/');
	let month = dateSplit[0];
	let date = dateSplit[1]
	let year = dateSplit[2];

	let stringDate = `${months[month-1]} ${date}, ${year}`;

	return stringDate
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
		
		postEvent(EventData);
		clearEventForm();
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
		
		updateEvent(eventID, updatedData);
		clearEventForm();
	});
}

function handleDeleteEvents(){
	$('.events-all').on('click', '.js-delete-button', function(events){
		let deleteEventId = $(this).closest('.event-item').data('eventid');
		deleteEvent(deleteEventId);
	});
}

function handleUpdateEvent(){
	$('.events-all').on('click', '.js-fa-edit', function(event){
		let updateEventId = $(this).closest('.event-item').data('eventid');
		getEventToUpdate(updateEventId);
	});
}

function toggleEvent(){
	$('.events-all').on('click', '.js-event-item', function(event){
		$(this).closest('.event-item').find('.js-event-information').toggleClass('hidden');
	});
}

function handleCloseMsg(){
	$('.js-close-msg').on('click', function(event){
		event.preventDefault();
		$('.alert-message').css("display", "none");
		$('.msg').html("");
	});
}

$(handleCloseMsg);
$(toggleEvent);
$(openModal);
$(closeModal);
$(watchSubmitEvent);
$(watchSubmitEditedEvent);
$(handleDeleteEvents);
$(handleUpdateEvent);


