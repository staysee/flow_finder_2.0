const FLOWFINDER_URL = 'https://flow-finder-2.herokuapp.com'

function getEvents(){
	$.ajax({
		type: 'GET',
		url: FLOWFINDER_URL+'/events',
		dataType: 'json',
	})
	.done(function(response){
		console.log(response);
		displayEvents(response);
	})

}

function renderEvents(event){
	return `
		<div class="event-item">
			<div class="event-name">${event.name}</div>
			<div class="event-description">${event.description}</div>
			<div class="event-address">${event.address.building} ${event.address.street} ${event.address.city}, ${event.address.state} ${event.address.zipcode}</div>
			<div class="event-date"${event.date}></div>
			<div class="event-time">${event.time.startTime} - ${event.time.endTime}</div>
			<div class="event-prop">${event.prop}</div>
		</div>
	`
}

function displayEvents(data){
	console.log("from displayEvents function")
	let eachEvent = $.map(data.events, function (event, index){
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
	})
}


function getDate(eventDate) {
	let date = new Date(eventDate)
	let fullDate = [date.getMonth()+1, date.getDate(), date.getFullYear()].join('/');
	return fullDate;
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

$(handleSubmitEvent);
$(openModal);
$(closeModal);
$(watchShowEvents);
// $(getEvents);