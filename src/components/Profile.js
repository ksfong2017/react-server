import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			username: '',
			fullname: '',
            image: '',
            success: '',
            error: ''
		};
	}
	componentDidMount() {
		let uname = localStorage.getItem('username');
		this.setState({ username: uname });
		axios
			.get('/api/profile', {
				params: {
					username: uname,
				},
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				//console.log(response.status);

				if (response.status === '200' || response.status === 200) {
                    
                    
					this.setState({ fullname: response.data.fullname });
				}
			});
	}
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value, error: '' });
	};

	handleSubmit(event) {
		event.preventDefault();
		axios
			.put('/api/profile', {
                username: this.state.username,
                fullname: this.state.fullname
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				//console.log(response.status);

				if (response.status === '200' || response.status === 200) {
                    this.setState({ success: "Successfully updated profile!" });
				} else {
					this.setState({ error: response.data });
				}
			});
	}
	render() {
		return (
			<div class="login">
				<div class="login-box">
					<h2 class="text-center">Your Profile</h2>
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
                                    disabled
								/>
							</Form.Group>

							<Form.Group controlId="formBasicFullName">
								<Form.Label>Full Name</Form.Label>
								<Form.Control
									type="text"
									name="fullname"
									placehoder="Enter Full Name"
                                    onChange={this.handleChange}
                                    value={this.state.fullname}
								/>
							</Form.Group>

							<Button variant="primary" type="submit">
								Save
							</Button>
                            <Form.Text id="success" style={{ color: 'black' }}>
								{this.state.success}
							</Form.Text>
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

export default Profile;
