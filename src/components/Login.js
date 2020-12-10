import React from 'react';
import axios from 'axios';
import decode from 'jwt-decode';
import { withRouter } from 'react-router';
import './css/Login.css';
import { Form, Button } from 'react-bootstrap';
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			username: '',
			password: '',
			loginStatus: false,
			rememberme: '',
		};

		// If logged in and valid expiry, navigate to home
		if (localStorage.getItem('expiry')) {
			let expiry = new Date(localStorage.getItem('expiry'));
			let current = new Date();
			if (expiry > current) {
				this.props.history.replace('/');
			}
		}
	}
	componentDidMount() {
		document.title = 'Login';


		if (localStorage.getItem('rememberme') === 'true'){
			this.setState({
				username: localStorage.getItem('username') || '',
				password: localStorage.getItem('password') || '',
				rememberme: localStorage.getItem('rememberme') === 'true' ? true : false,
			});
		}
		
	}

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value, error: '' });
	};
	handleCheckBoxChange = (e) => {
		if (e.target.checked) {
			this.setState({ [e.target.name]: true });
		} else {
			this.setState({ [e.target.name]: false });
		}
		console.log(this.state.rememberme);
	};
	handleSubmit(event) {
		event.preventDefault();

		axios
			.post('/api/login', {
				username: this.state.username,
				password: this.state.password,
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				console.log(response.status);

				if (response.status === '200' || response.status === 200) {
					let token = response.data;
					let decodedToken = decode(token);
					let diff = parseInt(decodedToken.exp) - parseInt(decodedToken.iat);
					let expiry = new Date();
					expiry.setSeconds(expiry.getSeconds() + diff - 10);

					// If remember me is checked, save username inside browser
					if (this.state.rememberme) {
						localStorage.setItem('username', this.state.username);
						localStorage.setItem('rememberme', this.state.rememberme);
					}

					// Save Token, Expiry, Loginstatus
					localStorage.setItem('token', 'Bearer ' + token);
					localStorage.setItem('expiry', expiry);
					localStorage.setItem('loginStatus', true);

					console.log(localStorage.getItem('expiry'));

					// Update Main App State with new Login Status
					this.props.updateLoginStatus(true);
					

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
								if (response.data.fullname == ''){

									this.props.history.replace('/profile');
								} else {

									this.props.updateFullname(response.data.fullname);
									this.props.history.replace('/onboarding');
								}
							}
						});
					
				} else {
					// Display Error from response
					this.setState({ error: response.data });
				}
			});
	}

	render() {
		return (
			<div class="login">
				<div class="login-box">
					<h2 class="text-center">Login</h2>
					<div>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId="formBasicUsername">
								<Form.Label>Username</Form.Label>
								<Form.Control
									type="text"
									name="username"
									placehoder="Enter Username"
									onChange={this.handleChange}
									value={this.state.username}
								/>
							</Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									name="password"
									placehoder="Password"
									onChange={this.handleChange}
								/>
							</Form.Group>
							<Form.Group controlId="formBasicCheckbox">
								<Form.Check
									type="checkbox"
									name="rememberme"
									label="Remember Me"
									onChange={this.handleCheckBoxChange}
									checked={this.state.rememberme}
								/>
							</Form.Group>
							<Button variant="primary" type="submit">
								Login
							</Button>
							<Form.Text id="error" style={{ color: 'red' }}>
								{this.state.error}
							</Form.Text>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Login);
