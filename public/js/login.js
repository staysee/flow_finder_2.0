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
		console.log(user);
		const authTokenStr = data.authToken;
		localStorage.setItem('token', authTokenStr);
		$('#login').addClass('hidden');
	})
	.fail(err => {
		console.error(err);
		$('.login-message').html('Invalid username or password');
	})
}


function createUser(){
	const newUser = {
		username: $('#new-username').val(),
		password: $('#new-password').val(),
		firstName: $('#firstname').val(),
		lastName: $('#lastname').val()
	}

	$.ajax({
		method: 'POST',
		url: '/api/users',
		data: JSON.stringify(newUser),
		dataType: 'JSON',
		contentType: 'application/json'
	})
	.done(data => {
		console.log(data);
	})
	.fail(err => {
		console.error(err)
	})
}



function registerUser(){
	$('.register-form').on('submit',function(event){
		event.preventDefault();
		createUser();
	})
}

function submitLogin(){
	$('.login-form').on('submit',function(event){
		event.preventDefault();
		authenticateUser();
	})
}


function getRegister() {
	$('#login').on('click', '.create-account', function() {
		$('#login').addClass('hidden');
		$('#register').removeClass('hidden');
	})
}

function getLogIn() {
	$('#register').on('click', '.have-account', function() {
		$('#register').addClass('hidden');
		$('#login').removeClass('hidden');
	})
}

$(registerUser);
$(submitLogin);
$(getRegister);
$(getLogIn);
