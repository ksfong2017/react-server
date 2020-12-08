import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import OnboardingCard from './OnboardingCard';
import { Form, Modal, Button } from 'react-bootstrap';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
class OnBoarding extends React.Component {
	appendLeadingZeroes(n) {
		if (n <= 9) {
			return '0' + n;
		}
		return n;
	}
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			username: '',
			customerName: '',
			customerAge: '',
			serviceOfficerName: '',
			NRIC: '',
			registrationTime: '',
			branchCode: '',
			image: '',
			productType: [],
			error: '',
			base64: '',
			productTypes: [
				{ id: '137', value: 'Investor' },
				{ id: '070', value: 'Insurannce' },
				{ id: '291', value: 'Loans' },
				{ id: '969', value: 'Savings' },
				{ id: '555', value: 'Credit Cards' },
			],
			branches: [],
			show: false,
			draft: {},
			active: {},
		};
	}
	getProfile() {
		axios
			.get('/api/profile', {
				params: {
					username: this.state.username,
				},
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				console.log(response.status);

				if (response.status === '200' || response.status === 200) {
					if (response.data.fullname != '') {
						this.setState({ serviceOfficerName: response.data.fullname });
					}
				}
			});
	}
	getDrafts() {
		axios
			.get('/api/onboarding/draft', {
				params: {
					username: this.state.username,
				},
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				if (response.status == '200') {
					
					this.setState({ draft: response.data });
					
				} else {
					this.setState({ error: response.data });
				}
			});
	}
	getActives() {
		axios
			.get('/api/onboarding/active', {
				params: {
					username: this.state.username,
				},
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				if (response.status == '200') {
					
					this.setState({ active: response.data });
					
				} else {
					this.setState({ error: response.data });
				}
			});
	}

	componentDidMount() {
		document.title = 'Onboarding';
		let uname = localStorage.getItem('username');
		this.setState({ username: uname }, function () {
			this.getDrafts();
			this.getActives();
			this.getProfile();
		});
		let list = [];
		for (let i = 1; i <= 391; i++){
			list.push(
				<option value={i} key={i}>{i}</option>
			);
		}
		this.setState({branches: list});
	}

	changeFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}
	b64toBlob(dataURI, type) {
		var byteString = atob(dataURI.split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);

		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: type });
	}
	handleFileChange = (e) => {
		let file = e.target.files[0];
		let type = file.type;
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			this.setState({
				base64: reader.result,
			});
		};
		// File > base64 > blob
		/*this.changeFile(file).then((base64) => {
            //console.log(base64);
			this.fileBlob = this.b64toBlob(base64, type);
			this.setState({ [e.target.name]: this.fileBlob });
            //console.log(this.fileBlob)
		});
		*/
		//console.log(new Blob(file, {type: file.type}));
		this.setState({ [e.target.name]: file });
		//let url = URL.createObjectURL(e.target.files[0]);
		//fetch(url).then(r => r.blob()).then(blob => this.setState({ image: blob }));
	};

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value, error: '' });
		
	};

	handleCustomerAgeChange = (e) => {
		let value = e.target.value;
		if (isNaN(value)) {
			console.log('not valid');
		} else {
			console.log('valid');
			this.setState({ [e.target.name]: parseInt(value), error: '' });
		}
	};

	handleBranchCodeChange = (e) => {
		let value = e.target.value;
		if (isNaN(value)) {
			console.log('not valid');
		} else {
			console.log('valid');
			this.setState({ [e.target.name]: parseInt(value), error: '' });
		}
	};
	handleProductTypeChange = (e) => {
		let productType = this.state.productType;
		let value = e.target.value;
		if (e.target.checked) {
			productType.push(value);
		} else {
			let index = productType.indexOf(value);
			if (index > -1) {
				productType.splice(index, 1);
			}
		}
		this.setState({ productType: productType });
		console.log(productType);
	};
	handleSubmit(event) {
		event.preventDefault();

		var formData = new FormData();
		formData.append('username', this.state.username);
		formData.append('customerName', this.state.customerName);
		formData.append('customerAge', this.state.customerAge);
		formData.append('serviceOfficerName', this.state.serviceOfficerName);
		formData.append('NRIC', this.state.NRIC);
		formData.append('registrationTime', this.state.registrationTime);
		formData.append('branchCode', this.state.branchCode);
		formData.append('image', this.state.image);
		formData.append('productType', this.state.productType);
		formData.append('base64', this.state.base64);
		formData.append('type', event.target.value);
		axios
			.post('/api/add', formData, {
				headers: {
					Authorization: localStorage.getItem('token'),
				},
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				if (response.status == '200') {
					console.log('Fuyoh!');
					this.setState({ error: '' });
					this.setState({
						customerName: '',
						customerAge: '',
						NRIC: '',
						registrationTime: '',
						branchCode: '',
						image: '',
						productType: [],
						error: '',
						base64: '',
					});
					this.setState({show: false});
					this.getDrafts();
				} else {
					this.setState({ error: response.data });
				}
			});
	}

	handleDateTimePicker = (moment, name) => {
		let d = moment.toDate();
		let d_format =
			this.appendLeadingZeroes(d.getDate()) +
			'/' +
			this.appendLeadingZeroes(d.getMonth() + 1) +
			'/' +
			d.getFullYear() +
			' ' +
			this.appendLeadingZeroes(d.getHours()) +
			':' +
			this.appendLeadingZeroes(d.getMinutes()) +
			':' +
			this.appendLeadingZeroes(d.getSeconds());
		this.setState({ [name]: d_format });
	};
	showAdd = () => {
		this.setState({ show: true });
		let d = new Date();
		this.setState({ moment: d });
		let d_format =
			this.appendLeadingZeroes(d.getDate()) +
			'/' +
			this.appendLeadingZeroes(d.getMonth() + 1) +
			'/' +
			d.getFullYear() +
			' ' +
			this.appendLeadingZeroes(d.getHours()) +
			':' +
			this.appendLeadingZeroes(d.getMinutes()) +
			':' +
			this.appendLeadingZeroes(d.getSeconds());
		this.setState({ registrationTime: d_format });
	};

	handleShow = () => {
		this.setState({ show: true });
	};

	handleClose = () => {
		this.setState({ show: false });
	};

	render() {
		return (
			<div>
				<div>
					<Modal show={this.state.show} onHide={this.handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>Add</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form.Group controlId="formBasicCustomerName">
								<Form.Label>Customer Name</Form.Label>
								<Form.Control
									type="text"
									name="customerName"
									placehoder="Enter Customer name"
									onChange={this.handleChange}
									value={this.state.customerName}
								/>
							</Form.Group>
							<Form.Group controlId="formBasicCustomerAge">
								<Form.Label>Customer Age</Form.Label>
								<Form.Control
									type="number"
									name="customerAge"
									placehoder="Enter Customer Age"
									onChange={this.handleChange}
									value={this.state.customerAge}
								/>
							</Form.Group>
							<Form.Group controlId="formBasicServiceOfficerName">
								<Form.Label>Service Officer Name</Form.Label>
								<Form.Control
									type="text"
									name="serviceOfficerName"
									placehoder="Enter Service Officer Name"
									onChange={this.handleChange}
									value={this.state.serviceOfficerName}
								/>
							</Form.Group>

							<Form.Group controlId="formBasicNRIC">
								<Form.Label>NRIC</Form.Label>
								<Form.Control
									type="text"
									name="NRIC"
									placehoder="Enter NRIC"
									onChange={this.handleChange}
									value={this.state.NRIC}
								/>
							</Form.Group>
							<Form.Group controlId="formBasicNRIC">
								<Form.Label>Registration Time</Form.Label>
								<Datetime
									onChange={(moment) => this.handleDateTimePicker(moment, 'registrationTime')}
									value={this.state.moment}
								/>
							</Form.Group>
							<Form.Group controlId="formBasicBranchCode">
								<Form.Label>Branch Code</Form.Label>
								<Form.Control as="select" className="mr-sm-2" id="inlineFormCustomSelect" custom name="branchCode" onChange={this.handleChange}>
									<option value="0">Choose...</option>
									{this.state.branches}
								</Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.File
									id="exampleFormControlFile1"
									type="file"
									name="image"
									onChange={this.handleFileChange}
									label="Image"
								/>
							</Form.Group>
							{this.state.productTypes.map((productType) => {
								return (
									<Form.Group controlId="formBasicCheckbox" key={productType.id}>
										<Form.Check
											type="checkbox"
											name="productType"
											label={productType.value}
											onChange={this.handleProductTypeChange}
										/>
									</Form.Group>
								);
							})}
							<div id="error" style={{ color: 'red' }}>
								{this.state.error}
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="" onClick={this.handleClose}>
								Cancel
							</Button>
							<Button variant="secondary" onClick={this.handleSubmit} value="Draft">
								Save as Draft
							</Button>
							<Button variant="primary" onClick={this.handleSubmit} value="Active">
								Add
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
				<div class="col-lg-8 mx-auto">
					<div class="d-flex">
						<h2>Onboarding</h2>
						<Button className="flex-at-end" variant="primary" onClick={this.showAdd}>
							Add
						</Button>
					</div>
					<h3>Drafts</h3>
					<div class="drafts">
						{Object.keys(this.state.draft).map((key, i) => {
							return <OnboardingCard key={key} data={this.state.draft[key]} />;
						})}
					</div>
					<h3>Active</h3>
					<div class="drafts">
						{Object.keys(this.state.active).map((key, i) => {
							return <OnboardingCard key={key} data={this.state.active[key]} />;
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(OnBoarding);
