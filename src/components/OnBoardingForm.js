import React from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Datetime from 'react-datetime';
class OnBoardingForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			customerName: '',
			customerAge: 18,
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
			customerNameError: '',
			customerAgeError: '',
			serviceOfficerNameError: '',
			NRICError: '',
			branchCodeError: '',
			imageError: '',
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		document.title = 'Onboarding';
		let uname = localStorage.getItem('username');
		let list = [];
		for (let i = 1; i <= 391; i++) {
			list.push(
				<option value={i} key={i}>
					{i}
				</option>
			);
		}
		this.setState({ branches: list });
		this.setState({ serviceOfficerName: this.props.serviceOfficerName, username: this.props.username }, () => {
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
			this.setState({ show: true });
		});
	}
	appendLeadingZeroes(n) {
		if (n <= 9) {
			return '0' + n;
		}
		return n;
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

	checkImage(file) {
		if (file.type != 'image/jpg' && file.type != 'image/jpeg' && file.type != 'image/png') {
			console.log('reached');
			this.setState({ imageError: 'Invalid File Type. Please attach only PNG/JPEG.' });
		} else if (file.size > 2097152) {
			console.log('reached2');
			this.setState({ imageError: 'File size should be smaller than 2mb.' });
		} else {
			let type = file.type;
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				this.setState({
					base64: reader.result,
				});
			};

			this.setState({ image: file });
			this.setState({ imageError: '' });
		}
	}
	handleFileChange = (e) => {
		let file = e.target.files[0];
		console.log(file);
		this.checkImage(file);

		// File > base64 > blob
		/*this.changeFile(file).then((base64) => {
            //console.log(base64);
			this.fileBlob = this.b64toBlob(base64, type);
			this.setState({ [e.target.name]: this.fileBlob });
            //console.log(this.fileBlob)
		});
		*/
		//console.log(new Blob(file, {type: file.type}));

		//let url = URL.createObjectURL(e.target.files[0]);
		//fetch(url).then(r => r.blob()).then(blob => this.setState({ image: blob }));
	};
	checkCustomerName(value) {
		console.log('customername: ' + value.length);
		if (value.length > 64) {
			this.setState({
				customerNameError: 'Customer Name must not exceed 64 characters.',
				customerName: value,
			});
		} else if (value.length == 0) {
			this.setState({
				customerNameError: 'Customer Name must not be blank.',
				customerName: value,
			});
		} else {
			this.setState({
				customerNameError: '',
				customerName: value,
			});
		}
	}

	handleCustomerNameChange = (e) => {
		console.log('trigger');
		let value = e.target.value;

		this.checkCustomerName(value);
	};
	checkCustomerAge(value) {
		const isValidCustomerAge = !isNaN(value) && value >= 18;

		if (isValidCustomerAge) {
			this.setState({ customerAgeError: '', customerAge: value });
		} else {
			this.setState({
				customerAgeError: 'Customer Age must be at least 18 years old.',
				customerAge: value,
			});
		}
	}
	handleCustomerAgeChange = (e) => {
		let value = parseInt(e.target.value);
		this.checkCustomerAge(value);
	};

	checkServiceOfficerName(value) {
		if (value.length > 64) {
			this.setState({
				serviceOfficerNameError: 'Service Officer Name must not exceed 64 characters.',
				serviceOfficerName: value,
			});
		} else if (value.length == 0) {
			this.setState({
				serviceOfficerNameError: 'Service Officer Name must not be blank.',
				serviceOfficerName: value,
			});
		} else {
			this.setState({ serviceOfficerNameError: '', serviceOfficerName: value });
		}
	}
	handleServiceOfficerNameChange = (e) => {
		let value = e.target.value;
		this.checkServiceOfficerName(value);
	};
	handleNRICChange = (e) => {
		let value = e.target.value;
		console.log(typeof value);
		this.checkNRIC(value);
	};
	// Global HandleChange
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};
	checkbranchCode(value) {
		const isValidBranchCode = !isNaN(value) && value >= 1 && value <= 391;
		if (isValidBranchCode) {
			this.setState({ branchCodeError: '', branchCode: value });
		} else {
			this.setState({ branchCodeError: 'Please choose a valid Branch Code.', branchCode: value });
		}
	}
	handleBranchCodeChange = (e) => {
		let value = parseInt(e.target.value);
		this.checkbranchCode(value);
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
		this.checkCustomerName(this.state.customerName);
		this.checkCustomerAge(this.state.customerAge);
		this.checkNRIC(this.state.NRIC);
		this.checkServiceOfficerName(this.state.serviceOfficerName);
		this.checkbranchCode(this.state.branchCode);
		this.checkImage(this.state.image);
		console.log(this.state);
		if (
			this.state.NRICError.length == 0 &&
			this.state.branchCodeError.length == 0 &&
			this.state.customerAgeError.length == 0 &&
			this.state.customerNameError.length == 0 &&
			this.state.imageError.length == 0 &&
			this.state.serviceOfficerNameError.length == 0
		) {
			var formData = new FormData();
			formData.append('username', this.state.username);
			formData.append('customerName', this.state.customerName);
			formData.append('customerAge', this.state.customerAge);
			formData.append('serviceOfficerName', this.state.serviceOfficerName);
			formData.append('NRIC', this.state.NRIC);
			formData.append('registrationTime', this.state.registrationTime);
			formData.append('branchCode', this.state.branchCode);
			formData.append('image', this.state.image);
			formData.append('productType', JSON.stringify(this.state.productType));
			formData.append('base64', this.state.base64);
            formData.append('type', event.target.value);
            console.log("abcx");
            console.dir(this.state.productType);


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
							customerAge: 18,
							NRIC: '',
							registrationTime: '',
							branchCode: '',
							image: '',
							productType: [],
							error: '',
							base64: '',
							customerNameError: '',
							customerAgeError: '',
							serviceOfficerNameError: '',
							NRICError: '',
							branchCodeError: '',
							imageError: '',
						});
						this.props.reload();
						this.handleClose();
					} else {
						this.setState({ error: response.data });
					}
				});
		} else {
			this.setState({ error: 'Please sort out the error before submitting.' });
		}
	}
	handleShow = () => {
		this.setState({ show: true });
	};

	handleClose = () => {
		this.setState({ show: false });
		this.props.handlePopupClose();
	};
	handleDateTimePicker = (moment, name) => {
		try {
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
		} catch (e) {}
	};

	checkNRIC = (NRIC) => {
		let validity = true;

		if (NRIC.length < 9) {
			validity = false;
		}
		let firstLetter = NRIC.charAt(0);
		let lastLetter = NRIC.charAt(NRIC.length - 1);
		if (firstLetter != firstLetter.toUpperCase() || !isNaN(firstLetter)) {
			validity = false;
		}
		if (lastLetter != lastLetter.toUpperCase() || !isNaN(lastLetter)) {
			validity = false;
		}

		for (let i = 1; i < NRIC.length - 1; i++) {
			let n = NRIC.charAt(i);
			if (isNaN(n)) {
				validity = false;
				break;
			}
		}
		if (validity) {
			this.setState({ NRICError: '', NRIC: NRIC });
		} else {
			this.setState({
				NRICError: 'Invalid NRIC. Alphabets must be capitalized.',
				NRIC: NRIC,
			});
		}
	};
	render() {
		return (
			<div>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>{this.props.type}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label>Customer Name</Form.Label>
							<Form.Control
								type="text"
								name="customerName"
								placehoder="Enter Customer name"
								onChange={this.handleCustomerNameChange}
								value={this.state.customerName}
								className={this.state.customerNameError.length > 0 ? 'not-valid' : ''}
							/>

							{this.state.customerNameError ? (
								<div class="error">{this.state.customerNameError}</div>
							) : null}
						</Form.Group>
						<Form.Group>
							<Form.Label>Customer Age</Form.Label>
							<Form.Control
								type="number"
								name="customerAge"
								placehoder="Enter Customer Age"
								onChange={this.handleCustomerAgeChange}
								value={this.state.customerAge}
								className={this.state.customerAgeError.length > 0 ? 'not-valid' : ''}
							/>
							{this.state.customerAgeError ? (
								<div class="error">{this.state.customerAgeError}</div>
							) : null}
						</Form.Group>
						<Form.Group>
							<Form.Label>Service Officer Name</Form.Label>
							<Form.Control
								type="text"
								name="serviceOfficerName"
								placehoder="Enter Service Officer Name"
								onChange={this.handleServiceOfficerNameChange}
								value={this.state.serviceOfficerName}
								className={this.state.serviceOfficerNameError.length > 0 ? 'not-valid' : ''}
							/>
							{this.state.serviceOfficerNameError.length > 0 ? (
								<div class="error">{this.state.serviceOfficerNameError}</div>
							) : null}
						</Form.Group>

						<Form.Group>
							<Form.Label>NRIC</Form.Label>
							<Form.Control
								type="text"
								name="NRIC"
								placehoder="Enter NRIC"
								onChange={this.handleNRICChange}
								value={this.state.NRIC}
								className={this.state.NRICError.length > 0 ? 'not-valid' : ''}
							/>
							{this.state.NRICError.length > 0 ? <div class="error">{this.state.NRICError}</div> : null}
						</Form.Group>
						<Form.Group>
							<Form.Label>Registration Time</Form.Label>
							<Datetime
								onChange={(moment) => this.handleDateTimePicker(moment, 'registrationTime')}
								value={this.state.moment}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Branch Code</Form.Label>
							<Form.Control
								as="select"
								className="mr-sm-2"
								id="inlineFormCustomSelect"
								custom
								name="branchCode"
								onChange={this.handleBranchCodeChange}
								className={this.state.branchCodeError.length > 0 ? 'not-valid' : ''}
							>
								<option value="0">Choose...</option>
								{this.state.branches}
							</Form.Control>
							{this.state.branchCodeError.length > 0 ? (
								<div class="error">{this.state.branchCodeError}</div>
							) : null}
						</Form.Group>
						<Form.Group>
							<Form.File
								id="exampleFormControlFile1"
								type="file"
								name="image"
								onChange={this.handleFileChange}
								label="Image"
								className={this.state.imageError.length > 0 ? 'not-valid' : ''}
							/>
							{this.state.imageError.length > 0 ? <div class="error">{this.state.imageError}</div> : null}
						</Form.Group>
						{this.state.productTypes.map((productType) => {
							return (
								<Form.Group controlId="formBasicCheckbox" key={productType.id}>
									<Form.Check
										type="checkbox"
										name="productType"
										label={productType.value}
										onChange={this.handleProductTypeChange}
										value={productType.id}
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
						{this.props.type == 'Add'
							? [
									<Button variant="secondary" onClick={this.handleSubmit} value="Draft">
										Save as Draft
									</Button>,
									<Button variant="primary" onClick={this.handleSubmit} value="Active">
										Add
									</Button>,
							  ]
							: [
									<Button variant="secondary" onClick={this.handleSubmit} value="Delete">
										Delete
									</Button>,
									<Button variant="primary" onClick={this.handleSubmit} value="Save">
										Save
									</Button>,
							  ]}
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export default OnBoardingForm;
