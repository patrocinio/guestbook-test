//const MESSAGE_URL = "http://frontend.guestbook/guestbook.php?cmd=get&key=messages"
const MESSAGE_URL = "http://frontend-guestbook.patrocinio8-fa9ee67c9ab6a7791435450358e564cc-0001.us-east.containers.appdomain.cloud/guestbook.php?cmd=get&key=messages"
const REDIS_URL	 = "https://redis-master-guestbook.patrocinio8-fa9ee67c9ab6a7791435450358e564cc-0001.us-east.containers.appdomain.cloud"

var request = require('request-promise')
var redis = require('./redisHelper')

async function retrieveMessages() {
	const options = {
		uri: MESSAGE_URL,
		json: true
	}
	try {
		const result = await request.get(options);
		data = result.data;
		console.log ("Data: ", data)
		messages = data.split(',')
		return messages.length;
	} catch (error) {
		return -1;
	}
}

async function countMessages (expected) {
	number = await retrieveMessages();
	console.log ("Number: ", number)
}

function resetRedis() {
	console.log ("Deleting all messages");
	client = redis.connectToRedis(REDIS_URL);
	client.del ("messages")
}

console.log ("Welcome to test resilience");
countMessages();

console.log ("== Done == ");
//resetRedis ();
