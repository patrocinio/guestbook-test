//const MESSAGE_URL = "http://frontend.guestbook/guestbook.php?cmd=get&key=messages"
const BASE_URL = "http://frontend-guestbook.patrocinio8-fa9ee67c9ab6a7791435450358e564cc-0001.us-east.containers.appdomain.cloud/guestbook.php?key=messages&"
const NUM_MESSAGES = 200;

var request = require('request-promise');
var assert = require('assert');

async function sendRequest (cmd) {
	const url = BASE_URL+cmd;
	console.log ("URL: ", url);

	const options = {
		uri: url,
		json: true
	}

	const result = await request.get(options);
	return result;
}

async function retrieveMessages() {
	try {
		const result = await sendRequest("cmd=get");
		data = result.data;
		console.log ("Data: ", data)
		messages = data.split(',')
		return messages.length - 1;
	} catch (error) {
		return -1;
	}
}

async function clearMessages() {
	const result = await sendRequest("cmd=clear");
	console.log ("Clear message result: ", result);
}

async function countMessages (expected) {
	number = await retrieveMessages();
	console.log ("Number: ", number);
	assert (number == expected);
}

async function addMessage(message) {
	const result = await sendRequest ("cmd=append&value=" + message);
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
