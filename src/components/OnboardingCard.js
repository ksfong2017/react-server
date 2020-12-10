import React from 'react';
import { Button, Card } from 'react-bootstrap';
class OnBoardingCard extends React.Component {
	constructor(props) {
		super(props);
		this.handleShift = this.handleShift.bind(this);
	}
	componentDidMount(){

	}

	blobToImage(){

	}
	handleShift() {
		

	}
	render() {
		return (
			<div class="card-holder col-12 col-md-6 col-lg-4 ">
				<Card >
					<Card.Img variant="top" src={this.props.data.image} />
					<Card.Body>
						<Card.Title>{this.props.data.customerName}</Card.Title>
						<Card.Text>
						{this.props.data.registrationTime}
						</Card.Text>
						<div class="d-flex">
						<Button variant="primary">Edit</Button>
						<Button variant="primary" className="flex-at-end" onClick={() => this.props.shift(this.props.id, this.props.type )}>Shit to {this.props.type == "Draft" ? "Active" : "Draft"}</Button>
						</div>
						
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default OnBoardingCard;
