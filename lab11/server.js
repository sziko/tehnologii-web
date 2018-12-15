const express = require('express');
const app = express();
const port = 3000
const https = require('https');
const mongo = require('mongoose');
const mysql = require('mysql');

const sqlConn = mysql.createConnection({
	host: "localhost",
	user: "szili",
	password: "testpwd",
	databse: "comments"
});



mongo.connect('mongodb://127.0.0.1:27017/comments');
var db = mongo.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
	console.log('Connected!');
});

app.get('/', (request, response) => {
	response.sendfile('./index.html');
});

app.get('/mongodb/posts', (request, response) => {
	db.collection('posts').find({}).toArray().then((data) => {
		response.send(data);
	}).catch((error) => {
		response.send(error);
	});
});

app.get('/mongodb/posts/:name', (request, response) => {
	var name = request.params.name;
	db.collection('posts').find({user_name: name}).toArray().then((data) => {
		response.send(data);
	}).catch((error) => {
		response.send(error);
	});
});


app.get('/mysql/posts', (request, response) => {
	sqlConn.connect((error) => {
		if(error) throw error;
		sqlConn.query("SELECT * FROM posts", (err, result, fields) => {
			if(err) throw err;
			response.send(result);
		});
	});
});

app.get('/mysql/posts/:name', (request, response) => {
	var name = request.params.name;
	sqlConn.connect((error) => {
		if(error) throw error;
		sqlConn.query("SELECT * FROM posts WHERE user_name = " + name, (err, result, fields) => {
			if(err) throw err;
			response.send(result);
		});
	});
});


app.listen(port);