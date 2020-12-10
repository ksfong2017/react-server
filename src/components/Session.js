import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import decode from 'jwt-decode';
class Session extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			remainingHours: 0,
			remainingMins: 0,
			remainingSecs: 0,
			show: false,
		};
	}

	componentDidMount() {
		this.checkExpiry();
	}
	componentWillUnmount() {
		clearInterval(this.countdown);
		clearTimeout(this.popup);
	}
	checkExpiry() {
		let current = new Date();
		let expiry = new Date(localStorage.getItem('expiry'));

		console.log(expiry);
		if (expiry < current) {
			// Expired
			localStorage.removeItem('token');
			localStorage.removeItem('expiry');
			localStorage.removeItem('loginStatus');

			this.props.updateLoginStatus(false);
		} else {
			// Lets get how long we have left
			let diffms = expiry - current;
			let diff = parseInt(diffms / 1000);
			this.updateRemaining(diff);
			console.log(diff);
			this.countdown = setInterval(() => {
				if (this.state.remainingSecs > 0) {
					this.setState({ remainingSecs: this.state.remainingSecs - 1 });
				} else if (this.state.remainingMins > 0) {
					this.setState({ remainingMins: this.state.remainingMins - 1 });
					this.setState({ remainingSecs: 59 });
				} else if (this.state.remainingHours > 0) {
					this.setState({ remainingHours: this.state.remainingHours - 1 });
					this.setState({ remainingMins: 59 });
				} else {
					clearInterval(this.countdown);
					localStorage.removeItem('token');
					localStorage.removeItem('expiry');
					localStorage.removeItem('loginStatus');

					this.props.updateLoginStatus(false);
				}
			}, 1000);

			let popupdelay;
			if (diffms < 20000) {
				popupdelay = 0;
			} else {
				popupdelay = diffms - 20000;
			}

			this.popup = setTimeout(() => {
				// Recheck if expiry is updated
				if (expiry.getTime() != new Date(localStorage.getItem('expiry')).getTime()) {
				} else {
					this.setState({ show: true });
				}
			}, popupdelay); // trigger when left 20s
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
				if (response.status === '200' || response.status === 200) {
					let token = response.data;
					let decodedToken = decode(token);
					let diff = parseInt(decodedToken.exp) - parseInt(decodedToken.iat);
					let expiry = new Date();
					expiry.setSeconds(expiry.getSeconds() + diff - 10);
					clearInterval(this.countdown);
					clearTimeout(this.popup);

					localStorage.setItem('token', 'Bearer ' + token);
                    localStorage.setItem('expiry', expiry);
                    this.setState({ show: false });
                    this.checkExpiry();
                    
				} else {
				}
			});
	};

	pad(num, size) {
		num = num.toString();
		while (num.length < size) num = '0' + num;
		return num;
	}
	updateRemaining(n) {
		let hours = parseInt(n / 3600);
		let remainder = parseInt(n - hours * 3600);
		let mins = parseInt(remainder / 60);
		remainder = remainder - mins * 60;
		let secs = remainder;

		this.setState({
			remainingHours: hours,
			remainingMins: mins,
			remainingSecs: secs,
		});
	}
	handleShow = () => {
		this.setState({ show: true });
	};

	handleClose = () => {
		this.setState({ show: false });
	};
	render() {
		return (
			<div class="col-12">
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>
							Session Timing Out in{' '}
							{this.pad(this.state.remainingHours, 2) +
								':' +
								this.pad(this.state.remainingMins, 2) +
								':' +
								this.pad(this.state.remainingSecs, 2)}
						</Modal.Title>
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
				<div>
					Session Time:{' '}
					{this.pad(this.state.remainingHours, 2) +
						':' +
						this.pad(this.state.remainingMins, 2) +
						':' +
						this.pad(this.state.remainingSecs, 2)}
				</div>
			</div>
		);
	}
}

export default Session;
