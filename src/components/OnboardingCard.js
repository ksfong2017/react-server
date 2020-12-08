import React from 'react';
import { Button, Card } from 'react-bootstrap';
class OnBoardingCard extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount(){

	}

	blobToImage(){

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
						<Button variant="primary">Edit</Button>
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default OnBoardingCard;
