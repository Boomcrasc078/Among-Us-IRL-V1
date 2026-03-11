const errorScreenwElement = document.getElementById('error');
const errorTextElement = document.getElementById('error-text');
const elements = document.getElementsByClassName('menu');

function error(enable, message) {
	closeAll();

	if (enable) {
		errorScreenwElement.style.display = 'block';
		errorTextElement.textContent = message;
	} else {
		errorScreenwElement.style.display = 'none';
		errorTextElement.textContent = '';
	}
}

function closeAll() {
	for (element of elements) {
		element.style.display = 'none';
	}
}

function onDisconnection(reason) {
	console.log(`You have been disconnected: ${reason}`);
	closeAll();
	error(true, `Du har blivit frånkopplad: ${reason}`);
}
