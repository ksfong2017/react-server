import logo from './logo.svg';
import './App.css';
import React from 'react';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import OnBoarding from './components/OnBoarding';
import View from './components/View';
class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<NavigationBar />
				<Router>
					<Switch>
						<Route exact path="/" component={Home}></Route>
						<Route path="/about-us"></Route>
						<Route path="/contact-us"></Route>
						<Route path="/login" component={Login}></Route>
						<Route path="/onboarding" component={OnBoarding}></Route>
						<Route path="/view/:id" component={View}></Route>
					</Switch>
				</Router>
			</React.Fragment>
		);
	}
}

export default App;
