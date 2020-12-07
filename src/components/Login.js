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

		if (localStorage.getItem('expiry')) {
			let expiry = new Date(localStorage.getItem('expiry'));
			let current = new Date();
			if(expiry > current){
				this.props.history.replace('/');
			}
		}
	}
	componentDidMount() {
		this.setState({
			username: localStorage.getItem('username') || '',
			password: localStorage.getItem('password') || '',
			rememberme: localStorage.getItem('rememberme') === 'true' ? true : false,
		});
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

		/*
    const requestOptions = {
      method: "POST",
      body: "username=alpha&password=alpha"
    };
    fetch("http://localhost:3001/login", requestOptions)
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      })
      .catch(console.log);

      */

		/*
    let formdata = new FormData();

    let requestOptions = {
      method: "POST",
      body: JSON.stringify({username :"alpha", password: "alpha"}),

    };

    fetch("http://localhost:3001/login", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

      */
		/*
    let formdata = new FormData();

    console.log(this.state.username);
    console.log(this.state.password);
    formdata.append("username", this.state.username);
    formdata.append("password", this.state.password);

    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
      redirect: "follow",
    };

    fetch("http://localhost:3001/login", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.text();
        }

        throw response;
      })
      .then((token) => {
        console.log(token);
        let decodedToken = decode(token);

        //let diff = (d.exp - Date.now() / 1000 ) * 1000 - 5000;
        //console.log(diff);
        //setTimeout(() => console.log('hello! expiring'), diff)
      })
      .catch((error) =>
        error
          .text()
          .then((errormsg) =>
            console.log(
              "[" +
                error.status +
                ":" +
                error.statusText +
                "] while fetching " +
                error.url +
                ", response is [" +
                errormsg +
                "]"
            )
          )
      );
    */

		axios
			.post('http://expressbackend-env.eba-mmzyvbbv.us-east-1.elasticbeanstalk.com/login', {
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
					expiry.setSeconds(expiry.getSeconds() + diff);

					//console.log("Remember Me? " + this.state.rememberme);
					if (this.state.rememberme) {
						localStorage.setItem('username', this.state.username);
						localStorage.setItem('password', this.state.password);
						localStorage.setItem('rememberme', this.state.rememberme);
					}

					localStorage.setItem('token', 'Bearer ' + token);
					localStorage.setItem('expiry', expiry);
					localStorage.setItem('loginStatus', true);
					this.props.updateState({ loginStatus: true});
					this.props.extendSessionPopup();
					this.props.history.replace('/onboarding');
				} else {
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
