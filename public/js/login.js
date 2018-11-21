//--------------------------//
//	   AUTH- AJAX CALLS		//
//--------------------------//
let currentUser;

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
		console.log(user.username);
		const authTokenStr = data.authToken;
		localStorage.setItem('token', authTokenStr);
		// localStorage.setItem('username', user.username);
		currentUser = parseJwt(authTokenStr);
		console.log(currentUser);

		$('#login').addClass('hidden');
		$('#createLink').removeClass('hidden');
		$('#LogOut').removeClass('hidden');
		getEvents();

	})
	.fail(err => {
		console.error(err);
		$('.message').html('Invalid username or password');
		//clear fields
		$('#username').val("");
		$('#password').val("");
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
		url: '/api/users',
		method: 'POST',
		data: JSON.stringify(newUser),
		dataType: 'json',
		contentType: 'application/json'
	})
	.done(data => {
		console.log(data);
		console.log(data.username);
		$('#register').addClass('hidden');
		//login
		$('#username').val(data.username);
		$('.message').html(`Registration successful. <br> Please sign in!`);
		$('.message').css('color', 'green');
		$('#login').removeClass('hidden');
	})
	.fail(err => {
		console.error(err)
		console.error(err.responseJSON.message);
		$('.registration-message').html(err.responseJSON.message);
	})
}


function parseJwt(token){
	let base64Url = token.split('.')[1];
	let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	return JSON.parse(window.atob(base64));
}



function logOutUser(){
	$('#LogOut').on('click', function(event){
		event.preventDefault();
		location.reload();
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

$(logOutUser);
$(registerUser);
$(submitLogin);
$(getRegister);
$(getLogIn);
