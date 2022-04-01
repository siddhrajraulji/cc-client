import React, {Component} from 'react';
import { withRouter, Redirect } from "react-router-dom";
import axios from 'axios';
import Auth from "../modules/Auth";

class Logout extends Component {
	
 state = {
    redirect: false,
  }	
	
	
 
  
  
  handleClick = () => {

    const headers = {
      'Content-Type': 'application/json',
      'Authkey': Auth.Authkey(),
      'session': Auth.getToken()
    }
    
    
      axios.post(`${Auth.getapiurl()}/userlogout`,
      {},
      {
        headers: headers
      }).then(res => {
    
            
            const status = res.data.status;
             
              if(status == 1){
                Auth.toastmsg(res.data.message,'S');
                localStorage.clear(); 
                 window.location.href = Auth.getSiteUrl()+'/';
              }     
    
    
            }).catch(error => {
                    localStorage.clear(); 
                 window.location.href = Auth.getSiteUrl()+'/';
      })

    

   

      this.setState({redirect: true})
	
	
  }
  render() {
	  
	const {redirect} = this.state;
	
	
	
	if(redirect){
     return <Redirect push to="/login"/> 
	}  
    
	return <button className="btn btn-danger btn-xs" onClick={this.handleClick}><i className="fa fa-sign-out"></i> Logout</button>;
  
}
}


export default withRouter(Logout);