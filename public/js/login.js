//--------------------------//
//	   AUTH- AJAX CALLS		//
//--------------------------//
function authenticateUser() {
	const user = {
		username: $('#username').val(),
		password: $('#password').val(),
	};

	$.ajax({
		method: 'POST',
		url: '/api/auth/login',
		data: JSON.stringify(user),
		dataType: 'JSON',
		contentType: 'application/json'
	})
	.done(data => {
		console.log(data);
		//what do i do with the authToken?
	})
	.fail(err => {
		console.error(err);
	})
}


function submitLogin(){
	$('.signin-form').on('submit',function(event){
		event.preventDefault();
		// alert('test');
		authenticateUser();
	})
}


function getSignUp() {
	$('#signin').on('click', '.create-account', function() {
		$('#signin').addClass('hidden');
		$('#signup').removeClass('hidden');
	})
}

function getSignIn() {
	$('#signup').on('click', '.have-account', function() {
		$('#signup').addClass('hidden');
		$('#signin').removeClass('hidden');
	})
}


$(submitLogin);
$(getSignUp);
$(getSignIn);
