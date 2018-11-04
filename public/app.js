let eventData ;

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

function renderEvents(event, index){
	return `
		<div class="event-item">
			<span class="js-delete-button delete-button data-eventId="${event.id}">&times;</span>
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
			<button class="update-button js-update-button">Update</button>
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

function handleSubmitEvent(event){
	$('.js-event-form').submit(function(event) {
		event.preventDefault();
		
		const userInput = {
			name: $('#event-name').val(),
			description:$('#event-description').val(),
			address: {
				building: $('#event-venue').val(),
				street: $('#event-street').val(),
				city: $('#event-name').val(),
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
		console.log(userInput);

		$.ajax({
			url: '/events',
			method: 'POST',
			data: JSON.stringify(userInput),
			contentType: 'application/json',
			success: function(data){
				$('.events-all').html(data);
			}
		})
	})
}


function getDate(eventDate) {
	let date = new Date(eventDate)
	let fullDate = [date.getMonth()+1, date.getDate(), date.getFullYear()].join('/');
	return fullDate;
}


function deleteEvent(event){
	let id = $(this).attr('eventId');

	$.ajax({
		method: 'DELETE',
		url: `/events/${id}`,
		contentType: 'application/json'
	})
	.done(() => {
		getEvents();
	})
	.fail(err => {
		console.error(err)
	})

}

function updateEvent(event){
	$.ajax({
		method: 'PUT'
	})
}





// MODAL
function openModal(){
	$('#createLink').click(function(event) {
		event.preventDefault()
		$('#createModal').removeClass('hidden');
	})
}

function closeModal(){
	$('.closeModal').on('click',function(){
		$('#createModal').addClass('hidden');
	})
}



//CLICK HANDLERS
function watchShowEvents(){
	$('.js-show-button').click(function(event) {
		event.preventDefault();
		getEvents();
	})
}

function watchDeleteEvents(){
	$('.events-all').on('click', '.js-delete-button', deleteEvent)
}

function watchUpdateEvent(){
	$('.events-all').on('click', '.js-update-button', function(event){
		event.preventDefault();
		alert('update')
	})
}

$(handleSubmitEvent);
$(openModal);
$(closeModal);
$(watchShowEvents);
$(watchDeleteEvents);
// $(getEvents);
$(watchUpdateEvent);





