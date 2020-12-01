const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

app.use(express.static(path.join(__dirname, '/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

function login(username, password) {
	return axios
		.post('http://localhost:3001/login', {
			username: username,
			password: password,
		})
		.then((response) => response)
		.catch((error) => error.response);
}

app.post('/api/login', function (req, res) {
	console.log(req.body);
	if (req.body['username'] == undefined || req.body['password'] == undefined) {
		res.status(400).send('The request parameters are incorrect');
	} else if (req.body['username'] == '' || req.body['password'] == '') {
		res.status(401).send('Missing credentials');
	} else {
		var username = req.body['username'];
		var password = req.body['password'];
		axios
			.post('http://localhost:3001/login', {
				username: username,
				password: password,
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
        //console.log(response.data);
				try {
					res.status(response.status).send(response.data);
				} catch (e) {}
			});
	}
});

app.get('/api/hello', (req, res) => {
	res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
	console.log(req.body);
	res.send(`I received your POST request. This is what you sent me: ${req.body.post}`);
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
