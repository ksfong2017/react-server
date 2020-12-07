import React from 'react';
import './css/Logout.css';

class Logout extends React.Component {
	componentDidMount() {
		localStorage.removeItem('token');
		localStorage.removeItem('expiry');
        if(localStorage.getItem('loginStatus') !== "true"){
            this.props.history.replace('/login');
        }
		setTimeout(() => {
			localStorage.removeItem('loginStatus');
			this.props.updateState({ loginStatus: false });
			this.props.updateState({ expiry: new Date() });
			this.props.stopTimer();
			this.props.history.replace('/login');
		}, 2500);
	}

	render() {
		return (
			<div className="loading-dots">
				<h2>Logging Out</h2>
                <br/>
				<h1 class="dot one">.</h1>
				<h1 class="dot two">.</h1>
				<h1 class="dot three">.</h1>
			</div>
		);
	}
}

export default Logout;
