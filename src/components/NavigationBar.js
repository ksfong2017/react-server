import React from 'react';
import { BrowserRouter as Router,
Switch, Route} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import OnBoarding from "./OnBoarding";
import View from "./View";
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import "./css/NavigationBar.css";

class NavigationBar extends React.Component {
    
   

    render() {
        return (
            <div>
                <div  className="row">
                    <div className="col-md-12">
                    <Router>
                            <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                                <Navbar.Brand href="#home">React Bootstrap Navbar</Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="mr-auto">
                                    <Nav.Link href="/">Home</Nav.Link>
                                    <Nav.Link href="/about-us">Contact Us</Nav.Link>
                                    <Nav.Link href="/contact-us">About Us</Nav.Link>
                                    <Nav.Link href="/onboarding">OnBoarding</Nav.Link>
                                    <Nav.Link href="/view/abc">ABC</Nav.Link>
                                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                    </NavDropdown>
                                    </Nav>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                </Navbar.Collapse>
                            </Navbar>
                            <br />
                            <Switch>
                                <Route exact path="/" component={Home} >
                                    
                                </Route>
                                <Route path="/about-us">
                                    
                                </Route>
                                <Route path="/contact-us">
                                    
                                </Route>
                                <Route path="/login" component={Login} >
                                    
                                </Route>
                                <Route path="/onboarding" component={OnBoarding} >
                                    
                                </Route>
                                <Route path="/view/:id" component={View} ></Route>
                            </Switch>
                        </Router>
                    </div>

                </div>
            </div>
        )

    }


}
export default NavigationBar;