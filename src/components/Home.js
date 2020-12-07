import React from 'react';
import { Carousel } from 'react-bootstrap';
class Home extends React.Component {
	render() {
		return (
			<video width="100%" autoPlay loop>
          <source src="./videos/video.mp4" type="video/mp4" muted />
        </video>
		);
	}
}

export default Home;
