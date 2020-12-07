import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isLogin = () => { 
    let expiry = new Date(localStorage.getItem("expiry"));
    let current = new Date();
    if(expiry > current){
        return true;
    
    }
    return false;
}
const PrivateRoute = ({component: Component, ...rest}) => {
    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            isLogin() ?
                <Component {...props} />
            : <Redirect to="/login" />
        )} />
    );
};

export default PrivateRoute;
