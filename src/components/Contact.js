import React from 'react';

class Contact extends React.Component {

    constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			subject: '',
			yourname: '',
			yourphonenumber: '',
        };
        
    }
	render() {
		return (
			<div class="login">
				<div class="login-box">
					<h2 class="text-center">Contact Us</h2>
					<div>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group >
								<Form.Label>Subject</Form.Label>
								<Form.Control
									type="text"
									name="subject"
									placehoder="Enter Subject"
									onChange={this.handleChange}
									value={this.state.subject}
								/>
							</Form.Group>
                            <Form.Group >
								<Form.Label>Your Name</Form.Label>
								<Form.Control
									type="text"
									name="yourname"
									placehoder="Enter Your Name"
									onChange={this.handleChange}
									value={this.state.yourname}
								/>
							</Form.Group>
                            <Form.Group >
								<Form.Label>Subject</Form.Label>
								<Form.Control
									type="text"
									name="subject"
									placehoder="Enter Subject"
									onChange={this.handleChange}
									value={this.state.subject}
								/>
							</Form.Group>
						
							<Button variant="primary" type="submit">
								Send
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

export default Contact;
