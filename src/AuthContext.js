import React from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import store from 'store';
const AuthContext = React.createContext()

class AuthProvider extends React.Component {


  state = { isAuth: false }

  constructor(props,context) {
    super(props,context)
    
    if(localStorage.getItem('id_token')){
       this.state.isAuth =  true ;
       this.setState({ isAuth: true })
    }else{
       this.state.isAuth = false ;
       this.setState({ isAuth: false })
    }

   this.login = this.login.bind(this)
   this.logout = this.logout.bind(this)
   this.check_auth = this.check_auth.bind(this)
  
  }

  login() {
  
  setTimeout(() => localStorage.getItem('id_token') ?
      this.setState({ isAuth: true })
     :
      this.setState({ isAuth: false })
    , 1000)
  
  }

  logout() {
    
	this.setState({ isAuth: false })
    localStorage.clear();
	return <Redirect to="/login" />;
	
    
  }
  
  
   check_auth(){
	
	if(store.get('id_token')){
		
		 axios.post(`http://192.168.1.208:5000/admin/getUser`, {  session: store.get('id_token') })
          .then(res => {
           
          if(JSON.stringify(res.data.fname))
		  {
			  
		  }else{
			  
			  this.state.isAuth = false;
		      localStorage.clear();
		  }
          
          

        });
    
	}else{
		this.state.isAuth = false;
		localStorage.clear();
		}
   }


  
  
  

  render() {
    return (
      <AuthContext.Provider
        value={{
          isAuth: this.state.isAuth,
          login: this.login,
          logout: this.logout,
		  check_auth:this.check_auth
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer }
