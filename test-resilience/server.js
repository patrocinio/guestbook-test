//const MESSAGE_URL = "http://frontend.guestbook/guestbook.php?cmd=get&key=messages"
const BASE_URL = "http://backend-guestbook.patrocinio8-fa9ee67c9ab6a7791435450358e564cc-0001.us-east.containers.appdomain.cloud/";
const NUM_MESSAGES = 200;
const ERROR = "error"

var request = require('request-promise');
var assert = require('assert');
var sleep = require('sleep');

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
			console.log("==> Error: ", error);
			result = ERROR;
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
			return "";
		}

		messages = data.split(',')
		return messages;
	} catch (error) {
		return -1;
	}
}

async function clearMessages() {
	const result = await sendRequest("clear");
	console.log ("Clear message result: ", result);
}

function findMissing (messages) {
    var m = [];
		for (let count = 0; count < NUM_MESSAGES; count++) {
			m[count] = true;
		}

		for (message in messages) {
			console.log ("Messages: ", message);
			m[message] = false;
		}

		for (count = 0; count < NUM_MESSAGES; count++) {
			if (m[count]) {
				console.log ("Missing message " + count);
			}
		}
}

async function countMessages (expected) {
	messages = await retrieveMessages();
	number = messages.length;
	console.log ("Number: ", number);
	if (number != expected) {
		findMissing (messages);
	}
	assert (number == expected);
}

async function addMessage(message) {
	let result = "";
	let count = 0;

	do {
		console.log ("Adding message ", message, " count: ", count);
		result = await sendRequest ("append/" + message);
		console.log ("Add message result: " + JSON.stringify(result));
	} while (result == ERROR);

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

async function waitForEmptyQueue () {
	console.log ("Waiting for empty queue...");
	let empty = false;

	while (!empty) {
		console.log ("Querying queue size...");
		const result = await sendRequest("emptyQueue");
		console.log ("Result: ", result.data);
		empty = result.data;
		console.log ("Data: ", empty);
		if (!empty) {
			sleep.sleep (1);
		}
	}
}

async function run() {
	await clearMessages();
	await countMessages(0);
	await addMessages();
	await waitForEmptyQueue();
	console.log ("Sleeping 2 seconds");
	sleep.sleep(2);
	await countMessages(NUM_MESSAGES);
}


console.log ("Welcome to test resilience");
run();

console.log ("== Done == ");
//resetRedis ();
