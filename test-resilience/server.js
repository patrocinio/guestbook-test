const MESSAGE_URL = "http://frontend.guestbook/guestbook.php?cmd=get&key=messages"

var request = require('request')

function countMessages () {
	request.get(url, function (error, response, body) {
		console.log('error:', error); // Print the error if one occurred
		console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
	})

}

console.log ("Welcome to test resilience");
countMessages ();
