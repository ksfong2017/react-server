const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const axios = require('axios');
const app = express();
const multer = require('multer');
const FormData = require('form-data');
const upload = multer();
const port = process.env.PORT || 5000;
const path = require('path');

if (process.env.NODE_ENV != 'dev') {
	app.use(express.static(path.join(__dirname, '/build')));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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
				try {
					res.status(response.status).send(response.data);
				} catch (e) {}
			});
	}
});

app.post('/api/validateForm', upload.single('image'), function (req, res) {
	//console.dir(req.body);
	//console.log(req.file);
	//console.log(req.file instanceof Blob);
	//console.log(req.files);
	if (
		req.headers['authorization'] == ''
		/*||
	  req.query["customerName"] == "" ||
	  req.query["customerAge"] == "" ||
	  req.query["serviceOfficerName"] == "" ||
	  req.query["NRIC"] == "" ||
	  req.query["registrationTime"] == "" ||
	  req.query["branchCode"] == "" ||
	  req.query["image"] == "" ||
	  req.query["productType"] == ""*/
	) {
		res.status(401).send('Missing credentials');
	} else if (
		req.headers['authorization'] == undefined ||
		req.body['customerName'] == undefined ||
		req.body['customerAge'] == undefined ||
		req.body['serviceOfficerName'] == undefined ||
		req.body['NRIC'] == undefined ||
		req.body['registrationTime'] == undefined ||
		req.body['branchCode'] == undefined ||
		req.file == undefined ||
		req.file['fieldname'] == undefined ||
		req.body['productType'] == undefined
	) {
		console.log('here');
		res.status(400).send('The request parameters are incorrect');
	} else {
		let file = req.file;
		console.log(file);
		var formData = new FormData();
		formData.append('customerName', req.body['customerName']);
		formData.append('customerAge', req.body['customerAge']);
		formData.append('serviceOfficerName', req.body['serviceOfficerName']);
		formData.append('NRIC', req.body['NRIC']);
		formData.append('registrationTime', req.body['registrationTime']);
		formData.append('branchCode', req.body['branchCode']);
		formData.append('image', file.buffer, file.originalname);
		formData.append('productType', req.body['productType']);
		axios
			.post('http://localhost:3001/validateForm', formData, {
				headers: {
					Authorization: req.headers['authorization'],
					'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
				},
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
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
if (process.env.NODE_ENV != 'dev') {
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname + '/build/index.html'));
	});
}

app.listen(port, () => console.log(`Listening on port ${port}`));
