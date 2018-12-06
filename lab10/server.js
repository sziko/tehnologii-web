const express = require('express');
const app = express();
const port = 3000
const fs = require('fs');
const https = require('https');

function getRequest(url, callback) {
	https.get(url, (resp) => {
		var getChunks = '';
		resp.on('data', (chunk) => {
			getChunks += chunk;
		});

		resp.on('end', () => {
			callback(JSON.parse(getChunks));
		});


	});
}

app.get('/', (request, response) => {
	response.sendfile('./index.html');
});

app.get('/file', (request, response) => {
	fs.readFile('./some-file.txt', 'utf8', (error, content) => {
		response.send(content);	
	});
});

app.get('/api', (request, response) => {
	getRequest('https://jsonplaceholder.typicode.com/posts', (data) => {
		response.send(data);
	});
});

app.listen(port);