import './App.css';
import React from 'react';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import OnBoarding from './components/OnBoarding';
import View from './components/View';
import Logout from './components/Logout';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import Session from './components/Session';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			error: '',
			loginStatus: false,
			remainingSecs: 20,
			extend: false,
			username: '',
		};
	}

	componentWillMount() {
		this.checkExpiry();
	}

	checkExpiry() {
		let expiry = new Date(localStorage.getItem('expiry'));
		let current = new Date();
		if (expiry > current) {
			this.setState({ loginStatus: localStorage.getItem('loginStatus') == 'true' ? true : false });
		}
	}
	updateLoginStatus(status) {
		this.setState({ loginStatus: status });
	}
	updateState(newstate) {
		this.setState(newstate);
	}
	updateUsername(username) {
		this.setState({ username: username });
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
				<NavigationBar loginStatus={this.state.loginStatus} />
				{this.state.loginStatus ? <Session updateLoginStatus={this.updateLoginStatus.bind(this)} /> : null}

				<Router onChange={this.routeChange}>
					<Switch>
						<Route exact path="/" component={Home}></Route>
						<Route path="/about-us"></Route>
						<Route path="/contact-us"></Route>
						<Route
							path="/login"
							component={(props) => (
								<Login
									loginStatus={this.state.loginStatus}
									updateLoginStatus={this.updateLoginStatus.bind(this)}
									{...props}
								/>
							)}
						></Route>
						<PrivateRoute
							path="/onboarding"
							component={(props) => <OnBoarding {...props} />}
						></PrivateRoute>
						<PrivateRoute path="/profile" component={(props) => <Profile {...props} />}></PrivateRoute>
						<Route path="/view/:id" component={View}></Route>
						<Route
							path="/logout"
							component={(props) => <Logout updateState={this.updateState.bind(this)} {...props} />}
						></Route>
					</Switch>
				</Router>
			</React.Fragment>
		);
	}
}

export default App;
