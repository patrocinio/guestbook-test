
const BASE_URL = "http://frontend.guestbook/guestbook.php?key=messages&cmd=";
const NUM_MESSAGES = 100;

var request = require('request-promise');
var assert = require('assert');

async function sendRequest (cmd) {
	const url = BASE_URL+cmd;
	console.log ("URL: ", url);

	const options = {
		uri: url,
		json: true
	}

	let result = "";
	await request(options)
	  .then (body => {
//			console.log ("Body: <", body, ">")
			result = body;
		})
		.catch (error => {
			console.log(error);
		})
//	console.log ("Send request result: <", result, ">");
	return result;
}

async function retrieveMessages() {
	try {
		const result = await sendRequest("get");
		data = result.data;
		console.log ("Data: <", data, ">")

		if (data == '') {
			return 0;
		}

		messages = data.split(',')
		return messages.length;
	} catch (error) {
		return -1;
	}
}

async function clearMessages() {
	const result = await sendRequest("clear");
	console.log ("Clear message result: ", result);
}

async function countMessages (expected) {
	number = await retrieveMessages();
	console.log ("Number: ", number);
	assert (number == expected);
}

async function addMessage(message) {
	const result = await sendRequest ("append&value=" + message);
	console.log ("Add message result: " + JSON.stringify(result));
	return result;
}

async function addMessages() {
	let promises = [];

	try {
		for (i = 0; i < NUM_MESSAGES; i++) {
			result = addMessage(i);
			promises.push(result);
		}
		console.log ("Promises.length: " + promises.length)
		result = await Promise.all(promises);
		console.log ("Add messages result: ", result)
	} catch (error) {
		console.log ("==> Error: " + error);
	}
}

async function run() {
	await clearMessages();
	await countMessages(0);
	await addMessages();
	await countMessages(NUM_MESSAGES);
}


console.log ("Welcome to test resilience");
run();

console.log ("== Done == ");
//resetRedis ();
