import logo from './logo.svg';
import './App.css';
import React from 'react';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import OnBoarding from './components/OnBoarding';
import View from './components/View';
import axios from 'axios';
import decode from 'jwt-decode';
import { Modal, Button } from 'react-bootstrap';
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			error: '',
			remainingSecs: 20,
		};
	}
	componentWillMount() {
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
			} else {
				// Haven't expire
				let diff = expiry - current - 20000; // - 20000 for letting user know 20s before expire
				console.log(diff);

				setTimeout(() => {
					this.setState({ show: true });
          console.log('showed');
          current = new Date();
          let remaining = parseInt((expiry - current) / 1000);
					
					let counter = setInterval(() => {
            if (remaining <= 0){

              // User didn't click

              clearInterval(counter);
            }
						this.setState({ remainingSecs: remaining });
						remaining -= 1;
					}, 1000);
				}, diff);
			}
		}
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
				if (response.status == '200') {
					var token = response.data;
					var decodedToken = decode(token);
					var diff = parseInt(decodedToken.exp) - parseInt(decodedToken.iat);
					var expiry = new Date();
					expiry.setSeconds(expiry.getSeconds() + diff / 10);

					localStorage.setItem('token', 'Bearer ' + token);
					localStorage.setItem('expiry', expiry);
					this.extendSessionPopup();
					this.setState({ show: false });
				} else {
					this.setState({ error: response.data });
				}
			});
	};
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
				<NavigationBar />

				<Router onChange={this.routeChange}>
					<Switch>
						<Route exact path="/" component={Home}></Route>
						<Route path="/about-us"></Route>
						<Route path="/contact-us"></Route>
						<Route
							path="/login"
							component={(props) => (
								<Login extendSessionPopup={this.extendSessionPopup.bind(this)} {...props} />
							)}
						></Route>
						<Route path="/onboarding" component={OnBoarding}></Route>
						<Route path="/view/:id" component={View}></Route>
					</Switch>
				</Router>
			</React.Fragment>
		);
	}
}

export default App;
