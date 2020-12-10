import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import OnboardingCard from './OnboardingCard';
import { Form, Modal, Button } from 'react-bootstrap';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import OnBoardingForm from './OnBoardingForm';
class OnBoarding extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			serviceOfficerName: '',
			draft: {},
			active: {},
			edit: {
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
			},
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
			.get('/api/onboarding/draft/all', {
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
			.get('/api/onboarding/active/all', {
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
	}
	reload = () => {
		this.getActives();
		this.getDrafts();
	};

	showAdd = () => {
		this.setState({ show: true });
	};

	handleShow = () => {
		this.setState({ show: true });
	};

	handleClose = () => {
		this.setState({ show: false });
	};
	shift = (key, type) => {
		axios
			.put('/api/onboarding/shift', {
				username: this.state.username,
				id: key,
				type: type,
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				console.log(response.status);

				if (response.status === '200' || response.status === 200) {
					this.reload();
				}
			});
	};

	render() {
		//const isValidCustomerName = this.state.customerName.length > 0 && this.state.customerName.length <= 64;
		//const isValidCustomerAge = this.state.customerAge >= 18;
		//const isValidServiceOfficerName =
		//	this.state.serviceOfficerName.length > 0 && this.state.serviceOfficerName.length <= 64;
		//const isValidNRIC = this.checkNRIC(this.state.NRIC);
		//const isValidBranchCode = this.state.branchCode >= 1 && this.state.branchCode <= 391;
		//const isValidImage = this.checkFile(this.state.image);
		return (
			<div>
				{this.state.show ? (
					<OnBoardingForm
						reload={this.reload.bind(this)}
						username={this.state.username}
						edit={this.state.edit}
						serviceOfficerName={this.state.serviceOfficerName}
						type="Add"
						handlePopupClose={this.handleClose.bind(this)}
					/>
				) : null}
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
							return (
								<OnboardingCard
									key={key}
									data={this.state.draft[key]}
									id={key}
									shift={this.shift}
									type="Draft"
								/>
							);
						})}
					</div>
					<h3>Active</h3>
					<div class="drafts">
						{Object.keys(this.state.active).map((key, i) => {
							return (
								<OnboardingCard
									key={key}
									data={this.state.active[key]}
									id={key}
									shift={this.shift}
									type="Active"
								/>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(OnBoarding);
