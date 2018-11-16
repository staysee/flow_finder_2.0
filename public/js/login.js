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

$(getSignUp);
$(getSignIn);