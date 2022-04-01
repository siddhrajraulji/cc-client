import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

const fakeAuth = {
 
  signout() {
	localStorage.clear();
    //setTimeout(cb, 100);
   return <Redirect to="/login" />;
  }
}

const AuthButton = withRouter(({ history }) => (
  
  
    
	<p>
      Welcome! <button onClick={fakeAuth.signout}>Sign out</button>
    </p>
	
 
))

export default AuthButton;


