import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
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
			customerName: 'abc',
			customerAge: 12,
			serviceOfficerName: 'abc',
			NRIC: 'S9430515B',
			registrationTime: '12/12/2012 12:12:12',
			branchCode: 1,
			image: '',
			productType: [],
			error: '',
			productTypes: [
				{ id: '137', value: 'Investor' },
				{ id: '070', value: 'Insurannce' },
				{ id: '291', value: 'Loans' },
				{ id: '969', value: 'Savings' },
				{ id: '555', value: 'Credit Cards' },
			],
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

	handleFileChange = (e) => {
		let file = e.target.files[0];
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
		formData.append('customerName', this.state.customerName);
		formData.append('customerAge', this.state.customerAge);
		formData.append('serviceOfficerName', this.state.serviceOfficerName);
		formData.append('NRIC', this.state.NRIC);
		formData.append('registrationTime', this.state.registrationTime);
		formData.append('branchCode', this.state.branchCode);
		formData.append('image', this.state.image);
		formData.append('productType', this.state.productType);

		axios
			.post('http://expressbackend-env.eba-mmzyvbbv.us-east-1.elasticbeanstalk.com/extendSession', formData, {
				headers: {
					Authorization: localStorage.getItem('token'),
				},
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				if (response.status == '200') {
					console.log('Fuyoh!');


				} else {
					this.setState({ error: response.data });
				}
			});
	}
	render() {
		return (
			<div>
				<h2>Onboarding</h2>
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
