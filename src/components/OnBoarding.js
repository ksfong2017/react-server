import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import OnboardingCard from './OnboardingCard';
import { Button } from 'react-bootstrap';
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
			customerAge: 18,
			serviceOfficerName: '',
			NRIC: 'S1234567A',
			registrationTime: '',
			branchCode: 1,
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
			draft: {},
		};

		let d = new Date();
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
		console.log(d_format);
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
					console.log('Fuyoh!');
					this.setState({ draft: response.data });
					console.log(this.state.draft);
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
		});
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
		axios
			.post('/api/validateForm', formData, {
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
					this.getDrafts();
				} else {
					this.setState({ error: response.data });
				}
			});
	}
	render() {
		return (
			<div class="col-lg-8 mx-auto">
				<div class="d-flex">
					<h2>Onboarding</h2>
					<Button variant="primary">Add</Button>
				</div>
				<h3>Drafts</h3>
				<div class="drafts">
					{Object.keys(this.state.draft).map((key, i) => {
						return <OnboardingCard key={key} data={this.state.draft[key]} />;
					})}
				</div>
				<div>
					<form onSubmit={this.handleSubmit}>
						<input
							type="text"
							name="customerName"
							placehoder="Customer Name"
							onChange={this.handleChange}
						></input>
						<br />
						<input
							type="number"
							name="customerAge"
							placehoder="Customer Age"
							onChange={this.handleCustomerAgeChange}
						></input>
						<br />
						<input
							type="text"
							name="serviceOfficerName"
							placehoder="Service Officer Name"
							onChange={this.handleChange}
						></input>
						<br />
						<input type="text" name="NRIC" placehoder="NRIC" onChange={this.handleChange}></input>
						<br />
						<input
							type="text"
							name="registrationTime"
							placehoder="RegistrationTime"
							onChange={this.handleChange}
						></input>
						<br />
						<input
							type="text"
							name="branchCode"
							placehoder="Branch Code"
							onChange={this.handleBranchCodeChange}
						></input>
						<br />
						<img src={this.state.file} />
						<input type="file" name="image" onChange={this.handleFileChange} />
						<br />
						{this.state.productTypes.map((productType) => {
							return (
								<li key={productType.id}>
									<label>
										<input
											type="checkbox"
											value={productType.id}
											onChange={this.handleProductTypeChange}
										/>
										{productType.value}
									</label>
								</li>
							);
						})}
						<button type="submit">Submit</button>
					</form>
					<div id="error" style={{ color: 'red' }}>
						{this.state.error}
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(OnBoarding);
