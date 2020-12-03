import React from 'react';
import axios from 'axios';
import decode from 'jwt-decode';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			username: '',
			password: '',
			loginStatus: false,
		};
	}

	componentDidMount() {
		this.setState({
			username: localStorage.getItem('username') || '',
			password: localStorage.getItem('password') || ''
		});
	}

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value, error: '' });
	};
	handleCheckBoxChange = (e) => {
		if (e.target.checked) {
			this.setState({ [e.target.name]: true });
		} else {
			this.setState({ [e.target.name]: false });
		}
	};
	handleSubmit(event) {
		event.preventDefault();

		/*
    const requestOptions = {
      method: "POST",
      body: "username=alpha&password=alpha"
    };
    fetch("http://localhost:3001/login", requestOptions)
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      })
      .catch(console.log);

      */

		/*
    var formdata = new FormData();

    var requestOptions = {
      method: "POST",
      body: JSON.stringify({username :"alpha", password: "alpha"}),

    };

    fetch("http://localhost:3001/login", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

      */
		/*
    var formdata = new FormData();

    console.log(this.state.username);
    console.log(this.state.password);
    formdata.append("username", this.state.username);
    formdata.append("password", this.state.password);

    var requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
      redirect: "follow",
    };

    fetch("http://localhost:3001/login", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.text();
        }

        throw response;
      })
      .then((token) => {
        console.log(token);
        var decodedToken = decode(token);

        //var diff = (d.exp - Date.now() / 1000 ) * 1000 - 5000;
        //console.log(diff);
        //setTimeout(() => console.log('hello! expiring'), diff)
      })
      .catch((error) =>
        error
          .text()
          .then((errormsg) =>
            console.log(
              "[" +
                error.status +
                ":" +
                error.statusText +
                "] while fetching " +
                error.url +
                ", response is [" +
                errormsg +
                "]"
            )
          )
      );
    */

		axios
			.post('/api/login', {
				username: this.state.username,
				password: this.state.password,
			})
			.then((response) => response)
			.catch((error) => error.response)
			.then((response) => {
				if (response.status == '200') {
					var token = response.data;
					var decodedToken = decode(token);
					var diff = parseInt(decodedToken.exp) - parseInt(decodedToken.iat);
					var expiry = new Date();
					expiry.setSeconds(expiry.getSeconds() + diff / 10);

					//console.log("Remember Me? " + this.state.rememberme);
					if (this.state.rememberme) {
						localStorage.setItem('username', this.state.username);
						localStorage.setItem('password', this.state.password);
					}

					localStorage.setItem('token', 'Bearer ' + token);
					localStorage.setItem('expiry', expiry);
					localStorage.setItem('loginstatus', true);

					this.props.history.push('/onboarding');
				} else {
					this.setState({ error: response.data });
				}
			});
	}

	render() {
		return (
			<div>
				<h2>Login</h2>
				<div>
					<form onSubmit={this.handleSubmit}>
						<input type="text" name="username" placehoder="username" onChange={this.handleChange}></input>
						<input
							type="password"
							name="password"
							placehoder="password"
							onChange={this.handleChange}
						></input>
						<label>
							<input type="checkbox" name="rememberme" onChange={this.handleCheckBoxChange} /> Remember
							Me?
						</label>
						<button type="submit">Submit</button>
					</form>
					<div id="error" style={{ color: 'red' }}>
						{this.state.error}
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
