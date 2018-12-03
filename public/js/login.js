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
		const authTokenStr = data.authToken;
		localStorage.setItem('token', authTokenStr);

		$('#login').addClass('hidden');
		$('#intro').addClass('hidden');
		$('#createLink').removeClass('hidden');
		$('#LogOut').removeClass('hidden');
		getEvents();

	})
	.fail(err => {
		console.error(err);
		$('.message').html('Invalid username or password');
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
		$('#register').addClass('hidden');

		$('#username').val(data.username);
		$('.message').html(`Registration successful. <br> Please sign in!`);
		$('.message').css('color', 'green');
		$('#login').removeClass('hidden');
		clearUserForm();
	})
	.fail(err => {
		console.error(err)
		$('.registration-message').html(err.responseJSON.message);
	})
}

//-------------------------------------------//
//	   LOGIN/REGISTER/LOGOUT FUNCTIONS	     //
//-------------------------------------------//
function clearUserForm(){
	$('#firstname').val(""),
	$('#lastname').val(""),
	$('#new-username').val(""),
	$('#new-password').val("")
}

function parseJwt(token){
	let base64Url = token.split('.')[1];
	let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	return JSON.parse(window.atob(base64));
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

function logOutUser(){
	$('#LogOut').on('click', function(event){
		event.preventDefault();
		location.reload();
		localStorage.clear();
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
