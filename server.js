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

// FireStore
const admin = require('firebase-admin');
const serviceAccount = require('./react-31a62-3bd5fcc2d362.json');
const { profile } = require('console');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Include React Build Static files
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
			.post('http://expressbackend-env.eba-mmzyvbbv.us-east-1.elasticbeanstalk.com/login', {
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


app.post('/api/add', upload.single('image'), function (req, res) {
	console.log(req.body);
	if (req.headers['authorization'] == '') {
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
		req.body['productType'] == undefined ||
		req.body['username'] == undefined ||
		req.body['base64'] == undefined ||
		req.body['type'] == undefined
	) {
		console.log('here');
		res.status(400).send('The request parameters are incorrect');
	} else {
		let file = req.file;
		//console.log(file);
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
			.post('http://expressbackend-env.eba-mmzyvbbv.us-east-1.elasticbeanstalk.com/validateForm', formData, {
				headers: {
					Authorization: req.headers['authorization'],
					'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
				},
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				if (response.status === '200' || response.status === 200) {
					db.collection('Customer')
						.doc(req.body['username'])
						.collection(req.body['type'])
						.add({
							customerName: req.body['customerName'],
							customerAge: req.body['customerAge'],
							serviceOfficerName: req.body['serviceOfficerName'],
							NRIC: req.body['NRIC'],
							registrationTime: req.body['registrationTime'],
							branchCode: req.body['branchCode'],
							image: req.body['base64'],
							productType: req.body['productType'],
						})
						.then((result) => {
							try {
								res.status(response.status).send(response.data);
							} catch (e) {}
						});
				} else {
					try {
						res.status(response.status).send(response.data);
					} catch (e) {}
				}
			});
	}
});

app.get('/api/profile', function (req, res) {
	console.log(req.query);

	// Get Profile
	const profileRef = db.collection('profile').doc(req.query['username']);
	profileRef.get().then((doc) => {
		if (!doc.exists) {
			console.log('No such document!');
			res.status(200).send({ fullname: '' });
		} else {
			//console.log('Document data:', doc.data());
			res.status(200).send(doc.data());
		}
	});
});

app.get('/api/onboarding/draft', function (req, res) {
	console.log(req.query);
	const profileRef = db.collection('Customer').doc(req.query['username']).collection('Draft');
	profileRef.get().then((draft) => {
		let output = {};
		draft.forEach((doc) => {
			output[doc.id] = doc.data();
		});

		res.status(200).send(output);
	});
});

app.get('/api/onboarding/active', function (req, res) {
	console.log(req.query);
	const profileRef = db.collection('Customer').doc(req.query['username']).collection('Active');
	profileRef.get().then((draft) => {
		let output = {};
		draft.forEach((doc) => {
			output[doc.id] = doc.data();
		});

		res.status(200).send(output);
	});
});

app.put('/api/profile', function (req, res) {
	console.log(req.body);
	const docRef = db.collection('profile').doc(req.body['username']);
	docRef.set({ fullname: req.body['fullname'], image: '' }).then((result) => {
		res.status(200).send();
	});
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
