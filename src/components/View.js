import React from 'react';

class View extends React.Component {


	constructor(props) {
		super(props);
		console.log(this.props.match.params.id);
		console.log('abc');
	}

	abc = () => {
		this.props.history.push('/home', '');
	}
	render() {
		return (
			<div>
				<h2>{this.props.match.params.id}</h2>
				<button color="primary" onClick={this.abc}>
					View Profile
				</button>
			</div>
		);
	}
}

export default View;
