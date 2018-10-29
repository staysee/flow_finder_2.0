
function getEvents(){
	$.ajax({
		type: 'GET',
		url: '/events',
		dataType: 'json',
	})
	.done(function(response){
		console.log(response);
		displayEvents();
	})

}

function renderEvents(){
	return `
		<div class="event-item">
			<div class="event-name"></div>
			<div class="event-description"></div>
			<div class="event-address"></div>
			<div class="event-date"></div>
			<div class="event-time"></div>
			<div class="event-prop"></div>
		</div>
	`
}

function displayEvents(){
	console.log("from displayEvents function")
}

//CLICK HANDLERS
function watchShowEvents(){
	$('.js-show-button').click(function(event) {
		event.preventDefault();
		alert('hi')
	})

}

$(watchShowEvents);
$(getEvents);