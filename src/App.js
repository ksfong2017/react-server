import logo from './logo.svg';
import './App.css';
import React from 'react';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import OnBoarding from './components/OnBoarding';
import View from './components/View';
import Logout from './components/Logout';
import axios from 'axios';
import decode from 'jwt-decode';
import { Modal, Button } from 'react-bootstrap';
import PrivateRoute from './components/PrivateRoute';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			error: '',
			loginStatus: false,
			remainingSecs: 20,
			extend: false,
		};
	}

	componentWillMount() {
		this.setState({ loginStatus: localStorage.getItem('loginStatus') == 'true' ? true : false });
		this.extendSessionPopup();
	}
	extendSessionPopup() {
		console.log('Extend Session Popup');

		if (localStorage.getItem('expiry') == null) {
		} else {
			let expiry = new Date(localStorage.getItem('expiry'));
			let current = new Date();

			if (expiry < current) {
				// Expired
				localStorage.removeItem('token');
				localStorage.removeItem('expiry');
				localStorage.removeItem('loginStatus');
			} else {
				// Haven't expire
				let diff = expiry - current - 20000; // - 20000 for letting user know 20s before expire
				console.log(diff);

				let timerPopup = setTimeout(() => {
					if (this.state.loginStatus) {
						this.setState({ show: true });
						//console.log('showed');
						current = new Date();
						let remaining = parseInt((expiry - current) / 1000);

						let counter = setInterval(() => {
							if (remaining <= 0) {
								// User didn't click
								if (!this.state.extend) {
									localStorage.removeItem('token');
									localStorage.removeItem('expiry');
									localStorage.removeItem('loginStatus');
                  
                  this.setState({ show: false });
								} else {
                  this.setState({ extend: false });
                }
								clearInterval(counter);
							}
							this.setState({ remainingSecs: remaining });
							remaining -= 1;
						}, 1000);
					}
				}, diff);
			}
		}
	}
	stopTimer() {
		clearTimeout(this.timerPopup);
	}
	extend = () => {
		axios
			.get('http://expressbackend-env.eba-mmzyvbbv.us-east-1.elasticbeanstalk.com/extendSession', {
				headers: {
					Authorization: localStorage.getItem('token'),
				},
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				if (response.status === '200' || response.status === 200) {
          
					let token = response.data;
          let decodedToken = decode(token);
          console.log(decodedToken);
					let diff = parseInt(decodedToken.exp) - parseInt(decodedToken.iat);
          let expiry = new Date();
          console.log(diff);
					expiry.setSeconds(expiry.getSeconds() + diff);
          console.log(expiry);
					localStorage.setItem('token', 'Bearer ' + token);
					localStorage.setItem('expiry', expiry);
					this.extendSessionPopup();
					this.setState({ show: false });
					this.setState({ extend: true });
				} else {
					this.setState({ error: response.data });
				}
			});
	};

	updateState(newstate) {
		this.setState(newstate);
	}

	handleShow = () => {
		this.setState({ show: true });
	};

	handleClose = () => {
		this.setState({ show: false });
	};
	render() {
		return (
			<React.Fragment>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Session Timing Out in {this.state.remainingSecs}s</Modal.Title>
					</Modal.Header>
					<Modal.Body>Would you like to extend?</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button variant="primary" onClick={this.extend}>
							Extend
						</Button>
					</Modal.Footer>
				</Modal>
				<NavigationBar app={this.state} />

				<Router onChange={this.routeChange}>
					<Switch>
						<Route exact path="/" component={Home}></Route>
						<Route path="/about-us"></Route>
						<Route path="/contact-us"></Route>
						<Route
							path="/login"
							component={(props) => (
								<Login
									extendSessionPopup={this.extendSessionPopup.bind(this)}
									updateState={this.updateState.bind(this)}
									{...props}
								/>
							)}
						></Route>
						<PrivateRoute path="/onboarding" component={OnBoarding}></PrivateRoute>
						<Route path="/view/:id" component={View}></Route>
						<Route
							path="/logout"
							component={(props) => (
								<Logout
									updateState={this.updateState.bind(this)}
									stopTimer={this.stopTimer.bind(this)}
									{...props}
								/>
							)}
						></Route>
					</Switch>
				</Router>
			</React.Fragment>
		);
	}
}

export default App;
